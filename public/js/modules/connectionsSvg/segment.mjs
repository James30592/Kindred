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

  static #EXTRA_BOTH_PERP_PROB = 0.5;

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

    for (let extraPathNum = 0; extraPathNum < 2; extraPathNum++) {

      this.extraPaths[extraPathNum] = new ExtraPath(this.start, this.end, 
        this.idx, extraPathNum);

      const otherExtraPath = this.extraPaths[1 - extraPathNum];

      this.extraPaths[extraPathNum].getCtrlPts(this.vectMag, this.start, 
        this.end, prevSeg, nextSeg, this.corePath, otherExtraPath);
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