import { testRandom } from "../../../../../sharedJs/utils.mjs";
import { ConnectSubPath } from "../connectSubPath.mjs";



export class ExtraPath extends ConnectSubPath{
  rotDirToCorePath;
  extraPathId;
  insideCore;
  perpRejoin = false;
  followingPerpPath = false;

  static #RAND_OUTSIDE_VECT_LIMS = { 
    minAngleDiff: 10 * (Math.PI / 180),
    maxAngleDiff: 20 * (Math.PI / 180),
    minMagFact: 0.3,
    maxMagFact: 0.4
  }

  static #PROB_BOTH_PERP_REJOIN = 0;

  // SLightly adjusted limits for if cutting inside the core path as core path curves 
  // outwards, make control points more prominent so line isn't too close to core path.
  static #RAND_INSIDE_VECT_LIMS = { 
    minAngleDiff: 30 * (Math.PI / 180),
    maxAngleDiff: 45 * (Math.PI / 180),
    minMagFact: 0.4,
    maxMagFact: 0.6
  }
  static #PROB_INSIDE_PERP_REJOIN = 1;

  static #RAND_PERP_VECT_LIMS = {
    minAngleDiff: 70 * (Math.PI / 180),
    maxAngleDiff: 90 * (Math.PI / 180),
    minMagFact: 0.3,
    maxMagFact: 0.6
  };

  constructor(segStart, segEnd, segIdx, extraPathId) {
    super(segStart, segEnd, segIdx);
    this.extraPathId = extraPathId;
  }

  getCtrlPts(segVectMag, segStart, segEnd, prevSeg, nextSeg, segCorePath, otherExtraPath) {
    this.ctrlPt1 = this.getCtrlPt1(segVectMag, prevSeg, segStart, segCorePath);
    this.ctrlPt2 = this.getCtrlPt2(segEnd, nextSeg, segVectMag, segCorePath, otherExtraPath);
  }

  // Generate a random vector to each side of the core path for each extra path, 
  // or continue the previous extra paths if there were any.
  getCtrlPt1(segVectMag, prevSeg, segStart, segCorePath) {
    let ctrlPt1;

    // True if this extra path is cutting inside the core path as the core 
    // path curves out.
    const insideCore = segCorePath.rotDirToSegVect !== this.rotDirToCorePath;
    this.insideCore = insideCore;

    // Is a following extra path, need first ctrlPt to be opposite of last 
    // seg's extra paths' 2nd ctrlPts.
    if (prevSeg?.hasPattern) {
      const followingPath = prevSeg.extraPaths[this.extraPathId];
      this.followingPerpPath = followingPath.perpRejoin;

      // Extra path will have crossed over the core path do rot dir is now opposite.
      this.rotDirToCorePath = -followingPath.rotDirToCorePath;
      const prevCtrlPt2 = followingPath.ctrlPt2;
      ctrlPt1 = this.getContinuingCtrlPt1(prevCtrlPt2, segStart);
    }

    // Otherwise, start new extra paths, slightly either side of core path.
    else {
      // ExtraPathId 0 always goes anticlockwise of core path, ExtraPathId 1 
      // always starts clockwise.
      this.rotDirToCorePath = (this.extraPathId === 1) ? 1 : -1;

      const randLims = insideCore ? ExtraPath.#RAND_INSIDE_VECT_LIMS : ExtraPath.#RAND_OUTSIDE_VECT_LIMS;
      const thisCoreStartVect = segStart.vectorTo(segCorePath.ctrlPt1).getUnitVector();

      const translateVect = this.getRandVect(this.rotDirToCorePath, 
        thisCoreStartVect, segVectMag, randLims);

      ctrlPt1 = segStart.addVector(translateVect);
    };

    return ctrlPt1;
  }

  // Generate a random vector back from the seg end, on the same side relative 
  // to the core path. If the next segment has extra paths then give it a good 
  // chance of rejoining the core path at a roughly perpendicular angle so this 
  // line can be continued on in the next segment for an interesting patterN.
  getCtrlPt2(segEnd, nextSeg, segVectMag, segCorePath, otherExtraPath) {
    let ctrlPt2;

    const thisCoreEndVect = segEnd.vectorTo(segCorePath.ctrlPt2).getUnitVector();

    let randLims = this.insideCore ? ExtraPath.#RAND_INSIDE_VECT_LIMS : ExtraPath.#RAND_OUTSIDE_VECT_LIMS;

    // If next seg has extra paths then give it good chance of being a perpendicular 
    // meeting to core path at the end if an inside path, lower chance if an outside path.
    let probPerpRejoin = 0;
    // if (nextSeg?.hasPattern & !this.followingPerpPath) {
    if (nextSeg?.hasPattern) {
      if (this.insideCore) {
        probPerpRejoin = ExtraPath.#PROB_INSIDE_PERP_REJOIN;
      }
      else {
        probPerpRejoin = otherExtraPath?.perpRejoin ? ExtraPath.#PROB_BOTH_PERP_REJOIN : 0;
      };
    };

    const perpRejoin = testRandom(probPerpRejoin);
    if (perpRejoin) {
      this.perpRejoin = true;
      randLims = ExtraPath.#RAND_PERP_VECT_LIMS;
    };
        
    const translateVect = this.getRandVect(-this.rotDirToCorePath, 
      thisCoreEndVect, segVectMag, randLims);

    ctrlPt2 = segEnd.addVector(translateVect);
    return ctrlPt2;
  }
}