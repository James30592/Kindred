import { testRandom } from "../../../sharedJs/utils.mjs";
import { CorePath } from "./connectSubPath/subClasses/corePath.mjs";
import { ExtraPath } from "./connectSubPath/subClasses/extraPath.mjs";



export class Segment {
  idx;
  hasPattern;
  start;
  end;
  mainVect;
  mainUnitVect;
  vectMag;
  perpUnitVect;
  corePath;
  extraPaths = [];
  allPaths = [];
  extraPathsBothEndPerp = false;

  static #PROB_BOTH_EXTRA_END_PERP = 0.4;

  constructor(idx, hasPattern, start, end) {
    this.idx = idx;
    this.hasPattern = hasPattern;
    this.start = start;
    this.end = end;
    this.mainVect = this.start.vectorTo(this.end);
    this.mainUnitVect = this.mainVect.getUnitVector();
    this.vectMag = this.mainVect.getMag();
    this.perpUnitVect = this.mainUnitVect.getRotatedVector(Math.PI / 2);
  }

  // Populate the corePathCtrlPts for this segment.
  setCorePath(prevSeg) {
    this.corePath = new CorePath(this.start, this.end, this.idx);

    this.corePath.getCtrlPts(this.idx, this.vectMag, this.start, this.end, 
      this.mainUnitVect, prevSeg);
  }

  // Populate the ctrlPts for the extra paths for this segment, if it has any.
  setExtraPaths(prevSeg, nextSeg) {
    if (!this.hasPattern) return;

    // Dont allow a segment to have both ends be perpendicular for both extra 
    // paths or looks like fat bubble.
    const prevSegBothEndPerp = prevSeg?.extraPathsBothEndPerp;
    this.extraPathsBothEndPerp = prevSegBothEndPerp ? false 
      : testRandom(Segment.#PROB_BOTH_EXTRA_END_PERP);

    for (let extraPathNum = 0; extraPathNum < 2; extraPathNum++) {

      this.extraPaths[extraPathNum] = new ExtraPath(this.start, this.end, 
        this.idx, extraPathNum);

      this.extraPaths[extraPathNum].getCtrlPts(this.vectMag, this.start, 
        this.end, prevSeg, nextSeg, this.corePath, this.extraPathsBothEndPerp);
    };
  }

  // Set this allPaths now all the paths are known.
  setAllPaths() {
    this.allPaths.push(this.corePath);
    this.allPaths.push(...this.extraPaths);
  }

  setPathDVals() {
    this.allPaths.forEach(path => {
      path.setDVal();
    });
  }

  createPathElems() {
    const segPaths = [];

    this.allPaths.forEach(path => {
      segPaths.push(path.createPathElem());
    });

    return segPaths;
  }
}