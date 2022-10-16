import { testRandom } from "../../../../../../sharedJs/utils.mjs";
import { ConnectSubPath } from "../connectSubPath.mjs";



export class ExtraPath extends ConnectSubPath{
  #extraPathId;
  rotDirToCorePath;
  insideCore;

  // For the extra path that runs outside of the core path.
  static #RAND_OUTSIDE_VECT_LIMS = { 
    minAngleDiff: 10 * (Math.PI / 180),
    maxAngleDiff: 20 * (Math.PI / 180),
    minMagFact: 0.3,
    maxMagFact: 0.4
  }

  // SLightly adjusted limits for if cutting inside the core path as core path curves 
  // outwards, make control points more prominent so line isn't too close to core path.
  static #RAND_INSIDE_VECT_LIMS = {
    minAngleDiff: 5 * (Math.PI / 180),
    maxAngleDiff: 30 * (Math.PI / 180),
    minMagFact: 0.2,
    maxMagFact: 0.6
  }
  // Probability the extra path inside the core path rejoins perp, given that 
  // both extra paths don't rejoin perp.
  static #PROB_INSIDE_PERP_REJOIN = 1;

  static #RAND_PERP_VECT_LIMS = {
    minAngleDiff: 70 * (Math.PI / 180),
    maxAngleDiff: 90 * (Math.PI / 180),
    minMagFact: 0.25,
    maxMagFact: 0.36
  };

  constructor(segStart, segEnd, segIdx, extraPathId) {
    super(segStart, segEnd, segIdx);
    this.#extraPathId = extraPathId;
  }

  getCtrlPts(segVectMag, segStart, segEnd, prevSeg, nextSeg, segCorePath, bothExtraPathsEndPerp) {
    this.ctrlPt1 = this.#getCtrlPt1(segVectMag, prevSeg, segStart, segCorePath);
    this.ctrlPt2 = this.#getCtrlPt2(segEnd, nextSeg, segVectMag, segCorePath, bothExtraPathsEndPerp);
  }

  // Generate a random vector to each side of the core path for each extra path, 
  // or continue the previous extra paths if there were any.
  #getCtrlPt1(segVectMag, prevSeg, segStart, segCorePath) {
    let ctrlPt1;

    // Is a following extra path, need first ctrlPt to be opposite of last 
    // seg's extra paths' 2nd ctrlPts.
    if (prevSeg?.hasPattern) {
      const followingPath = prevSeg.extraPaths[this.#extraPathId];
      this.insideCore = followingPath.insideCore;

      // Extra path will have crossed over the core path do rot dir is now opposite.
      this.rotDirToCorePath = -followingPath.rotDirToCorePath;
      const prevCtrlPt2 = followingPath.ctrlPt2;
      ctrlPt1 = this._getContinuingCtrlPt1(prevCtrlPt2, segStart);
    }

    // Otherwise, start new extra paths, slightly either side of core path.
    else {
      // ExtraPathId 0 always goes anticlockwise of core path, ExtraPathId 1 
      // always starts clockwise.
      this.rotDirToCorePath = (this.#extraPathId === 1) ? 1 : -1;

      // True if this extra path is cutting inside the core path as the core 
      // path curves out.
      const insideCore = segCorePath.rotDirToSegVect !== this.rotDirToCorePath;
      this.insideCore = insideCore;

      const randLims = insideCore ? ExtraPath.#RAND_INSIDE_VECT_LIMS : ExtraPath.#RAND_OUTSIDE_VECT_LIMS;
      const thisCoreStartVect = segStart.vectorTo(segCorePath.ctrlPt1).getUnitVector();

      const translateVect = this._getRandVect(this.rotDirToCorePath, 
        thisCoreStartVect, segVectMag, randLims);

      ctrlPt1 = segStart.addVector(translateVect);
    };

    return ctrlPt1;
  }

  // Generate a random vector back from the seg end, on the same side relative 
  // to the core path. If the next segment has extra paths then give it a good 
  // chance of rejoining the core path at a roughly perpendicular angle so this 
  // line can be continued on in the next segment for an interesting patterN.
  #getCtrlPt2(segEnd, nextSeg, segVectMag, segCorePath, bothExtraPathsEndPerp) {
    let ctrlPt2;

    const thisCoreEndVect = segEnd.vectorTo(segCorePath.ctrlPt2).getUnitVector();

    let randLims = this.insideCore ? ExtraPath.#RAND_INSIDE_VECT_LIMS : ExtraPath.#RAND_OUTSIDE_VECT_LIMS;

    const perpRejoin = this.#getIsPerpRejoin(nextSeg, bothExtraPathsEndPerp);

    if (perpRejoin) {
      randLims = ExtraPath.#RAND_PERP_VECT_LIMS;
    };
        
    const translateVect = this._getRandVect(-this.rotDirToCorePath, 
      thisCoreEndVect, segVectMag, randLims);

    ctrlPt2 = segEnd.addVector(translateVect);
    return ctrlPt2;
  }

  // For getting the 2nd control point, works out if this extra path should 
  // rejoin at perpendicular to core path.
  #getIsPerpRejoin(nextSeg, bothExtraPathsEndPerp) {
    let probPerpRejoin = 0;
    // Don't rejoin at perp if next seg has no pattern.
    if (nextSeg?.hasPattern) {
      // If segment decided (RNG) that both extra paths should rejoin perp (for 
      // leaf shape) then make certain.
      if (bothExtraPathsEndPerp) {
        probPerpRejoin = 1;
      }
      // Otherwise give high probability to inside core path and low (currently 
      // no) probability to outside core path).
      else {
        // This probability currently set to 1 but might decrease slightly later, 
        // this is the odds of inside path rejoining perpendicular to core, if 
        // it's given that both extra paths dont rejoin perp.
        if (this.insideCore) {
          probPerpRejoin = ExtraPath.#PROB_INSIDE_PERP_REJOIN;
        }
        // Extra path that is outside of the core is never perpendicular alone, looks weird.
        else {
          probPerpRejoin = 0;
        };
      };
    };

    return testRandom(probPerpRejoin);
  }
}