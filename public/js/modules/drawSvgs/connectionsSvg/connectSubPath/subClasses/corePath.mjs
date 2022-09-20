import { testRandom } from "../../../../../../sharedJs/utils.mjs";
import { ConnectSubPath } from "../connectSubPath.mjs";



export class CorePath extends ConnectSubPath {
  rotDirToSegVect;

  // These are used for getting 1st control point if the segment is the very 
  // first one in the connection. Mag factor is as a proportion of the segments 
  // d and angle is from the overall connection main vector. In the end it 
  // looked best just fixed at these values I think.
  static #RAND_VECT_LIMS = { 
    minAngleDiff: 25 * (Math.PI / 180),
    maxAngleDiff: 25 * (Math.PI / 180),
    minMagFact: 0.3,
    maxMagFact: 0.3
  }

  getCtrlPts(idx, segVectMag, segStart, segEnd, segUnitVect, prevSeg) {
    this.ctrlPt1 = this.#getCtrlPt1(idx, segVectMag, segStart, segUnitVect, prevSeg);
    this.ctrlPt2 = this.#getCtrlPt2(segEnd, segUnitVect, segVectMag);
  }

  // Gets the first control point for this core path cubic bezier curve.
  #getCtrlPt1(idx, segVectMag, segStart, segUnitVect, prevSeg) {
    let ctrlPt1;

    const isFirstSeg = idx === 0;

    // If very first segment in the connection, choose random direction left or 
    // right of total main vector.
    if (isFirstSeg) {
      this.rotDirToSegVect = testRandom(0.5) ? 1 : -1;
      const randLims = CorePath.#RAND_VECT_LIMS;

      const translateVect = this._getRandVect(this.rotDirToSegVect, segUnitVect, 
        segVectMag, randLims);

      ctrlPt1 = segStart.addVector(translateVect);
    }

    // Otherwise, ctrlPt1 should be previous segment's core path's ctrlPt2, 
    // rotated 180 degrees about this seg start.
    else {
      this.rotDirToSegVect = -prevSeg.corePath.rotDirToSegVect;
      const prevCoreCtrlPt2 = prevSeg.corePath.ctrlPt2;
      ctrlPt1 = this._getContinuingCtrlPt1(prevCoreCtrlPt2, segStart);
    };

    return ctrlPt1;
  }

  // Generate a random vector back from the seg end, on the same side relative 
  // to seg main vector.
  #getCtrlPt2(segEnd, segUnitVect, segVectMag) {
    const randLims = CorePath.#RAND_VECT_LIMS;
    const reverseSegVect = segUnitVect.getReverse();

    const translateVect = this._getRandVect(-this.rotDirToSegVect, reverseSegVect, 
      segVectMag, randLims);

    const ctrlPt2 = segEnd.addVector(translateVect);
    return ctrlPt2;
  }
}