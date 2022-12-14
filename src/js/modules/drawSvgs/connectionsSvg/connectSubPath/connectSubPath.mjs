import { randBetween } from "../../../../../sharedJs/utils.mjs";



export class ConnectSubPath {
  #start;
  #end;
  #dVal;
  #segIdx;
  pathElem;
  ctrlPt1;
  ctrlPt2;

  constructor(segStart, segEnd, segIdx) {
    this.#start = segStart;
    this.#end = segEnd;
    this.#segIdx = segIdx;
  }

  // Used by core and extra paths when following on from previous core / extra paths.
  _getContinuingCtrlPt1(prevCtrlPt2, segStart) {
    const segStartToPrevCtrlPt2 = segStart.vectorTo(prevCtrlPt2);

    const segStartToCtrlPt1 = segStartToPrevCtrlPt2.getRotatedVector(Math.PI);
    const ctrlPt1 = segStart.addVector(segStartToCtrlPt1);
    return ctrlPt1;
  }

  // Takes direction (1 for clockwise, -1 for anticlockwise), unitdirection vector, 
  // magnitude and then mins and max for angle and scale factor randomisation ranges.
  _getRandVect(rotDir, dirVect, segVectMag, randLims) {
    const absAngle = randBetween(randLims.minAngleDiff, randLims.maxAngleDiff);
    const angle = absAngle * rotDir;
    const unscaledVect = dirVect.getRotatedVector(angle);

    // Get random proportion of segment distance.
    const scaleFactor = randBetween(randLims.minMagFact, randLims.maxMagFact);
    
    const scale = segVectMag * scaleFactor;
    return unscaledVect.getScaledVector(scale);
  }

  // Sets the d value to be used by an svg image.
  setDVal() {
    this.#dVal = `M ${this.#start.getTxt()} 
    C ${this.ctrlPt1.getTxt()} ${this.ctrlPt2.getTxt()} ${this.#end.getTxt()}`;
  }

  createPathElem() {
    const thisPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
    thisPath.setAttribute("d", this.#dVal);
    thisPath.dataset.subDrawIdx = this.#segIdx;
    this.pathElem = thisPath;
    return this.pathElem;
  }
}