import { randBetween, testRandom } from "../../../../sharedJs/utils.mjs";
import { drawSimulPaths } from "../drawAnimSvgs.js";
import { Vector2 } from "../../vector2.mjs";
import { Segment } from "./segment.mjs";



export class SingleConnection extends EventTarget {
  startId;
  #endId;
  pathElems = [];
  #startCoords;
  #endCoords;
  #mainVect;
  #totalD;
  #avgSegVect;
  #perpUnitVect;
  #numSegments;
  #probSegPattern;
  #blocksizeDecreaseProb;
  #standardSegLen;
  #segments;
  #startedDrawing = false;

  // Standard size of segment (before randomising) as percentage of viewport width).
  static #STANDARD_SEG_LEN_RATIO = 1;
  static #COMMON_PTS_MAIN_RAND = 0.02;
  static #COMMON_PTS_PERP_RAND = 0.01;

  constructor(connectionInfo) {
    super();

    this.startId = connectionInfo.elemIds[0];
    this.#endId = connectionInfo.elemIds[1];
    this.#startCoords = connectionInfo.coords[0];
    this.#endCoords = connectionInfo.coords[1];

    this.#mainVect = this.#startCoords.vectorTo(this.#endCoords);
    this.#totalD = this.#mainVect.getMag();

    const avgWindowSideLen = (window.innerWidth + window.innerHeight) / 2;
    this.#standardSegLen = (SingleConnection.#STANDARD_SEG_LEN_RATIO / 100) 
      * avgWindowSideLen;

    this.#numSegments = Math.round(this.#totalD / this.#standardSegLen);
    this.#probSegPattern = 0.4;
    this.#blocksizeDecreaseProb = 0.9;

    const avgSegVectX = this.#mainVect.x / this.#numSegments;
    const avgSegVectY = this.#mainVect.y / this.#numSegments;
    this.#avgSegVect = new Vector2(avgSegVectX, avgSegVectY);

    const perpVect = this.#mainVect.getRotatedVector(Math.PI / 2);
    this.#perpUnitVect = perpVect.getUnitVector();
  }

  // Draws all the paths of each segment, in order and emits event when all 
  // paths of all segments have been drawn.
  async draw() {
    if (this.#startedDrawing) return;
    this.#startedDrawing = true;

    for (let seg of this.#segments) {
      const segPaths = seg.allPaths.map(pathObj => pathObj.pathElem);
      await drawSimulPaths(segPaths);
    };
    
    this.dispatchEvent(
      new CustomEvent("connectionDrawn", {detail: {endId: this.#endId}})
    );
  }

  // Hide all paths, used at start of drawing animation for svg.
  hidePaths() {
    this.pathElems.forEach(path => {
      path.classList.add("hidden");
    });
  }

  // Procedurally builds connection of svg path curves between two points.
  createPaths() {
    const commonPts = this.#getCommonPts();
    const segPatternMap = this.#buildSegPatternMap();
    this.#segments = this.#getSegDetails(segPatternMap, commonPts);
    this.#setPathsAndDVals(this.#segments);
    this.#createPathElems(this.#segments);
  }

  // Creates all the path dom elements for each path of each segment in the 
  // connection.
  #createPathElems(segList) {
    segList.forEach(seg => {
      this.pathElems.push(...seg.createPathElems());
    });
  }

  // Sets the core and extra paths and the d values for all segments.
  #setPathsAndDVals(segList) {
    const setCorePath = (seg, prevSeg) => seg.setCorePath(prevSeg);
    const setExtraPaths = (seg, prevSeg, nextSeg) => seg.setExtraPaths(prevSeg, nextSeg);
    const setAllPaths = seg => seg.setAllPaths();
    const setPathDVals = seg => seg.setPathDVals();

    const pathProcessFuncs = [setCorePath, setExtraPaths, setAllPaths, setPathDVals];

    pathProcessFuncs.forEach(pathProcessFunc => {
      this.#segListProcessor(segList, pathProcessFunc)
    });
  }

  // Used to apply the set core path, set extra path and set path d val 
  // functions to all segments.
  #segListProcessor(segList, processFunc) {
    segList.forEach((seg, idx) => {
      const prevSeg = segList[idx - 1];
      const nextSeg = segList[idx + 1];
      processFunc(seg, prevSeg, nextSeg);
    });
  }

  // Creates a segment object for each segment using the segment map and common 
  // points and creates an array of these segment objects.
  #getSegDetails(segMap, commonPts) {
    const segDetails = [];

    for (let segNum = 0; segNum < segMap.length; segNum++) {
      const hasPattern = segMap[segNum] === 1 ? true : false;
      const start = commonPts[segNum];
      const end = commonPts[segNum + 1];

      const thisSegDetails = new Segment(segNum, hasPattern, start, end);

      segDetails.push(thisSegDetails);
    };

    return segDetails;
  }

  // Builds array of which segments are gaps ("g") and which have a pattern (1).
  #buildSegPatternMap() {
    const segMap = Array.from("g".repeat(this.#numSegments));

    for (let segNum = 0; segNum < this.#numSegments; segNum++) {
      let probIsPattern = this.#probSegPattern;

      const [prevSeg, prevSeg2] = [segMap[segNum - 1], segMap[segNum - 2]];
      const prevSegHasPattern = prevSeg ? prevSeg !== "g" : false;
      const prevSeg2HasPattern = prevSeg2 ? prevSeg2 !== "g" : false;

      // Reduce odds of long patterned sections, make impossible to get just one 
      // patterned section alone though.
      if (prevSegHasPattern) {
        if (prevSeg2HasPattern) {
          const currBlockSize = getCurrBlockSize(segNum, segMap);
          probIsPattern *= Math.pow(this.#blocksizeDecreaseProb, currBlockSize);
        }
        else {
          probIsPattern = 1;
        };
      }
      // If last segment, then make sure it can't have pattern, to prevent 
      // isolated pattern block.
      else if (segNum === this.#numSegments - 1) {
        probIsPattern = 0;
      };

      const thisSeg = testRandom(probIsPattern) ? 1 : "g";
      segMap[segNum] = thisSeg;
    };

    return segMap;

    // Get total number of patterned segments in a row until current segNum.
    function getCurrBlockSize(segNum, segMap) {
      let blockSize = 1;
      let idx = segNum - 2;

      while (idx >= 0) {
        const currSeg = segMap[idx];
        if (currSeg === "g") break;
        blockSize ++;
        idx--;
      };

      return blockSize;
    }
  }

  // Get the common points to be used for start and end of each segment.
  #getCommonPts() {
    let commonPts = this.#getPrelimCommonPts();
    commonPts = this.#randCommonPts(commonPts);
    commonPts.splice(0, 0, this.#startCoords);
    commonPts.push(this.#endCoords);

    return commonPts;
  }

  // Lerps between start and end coords to create specified number of segments.
  #getPrelimCommonPts() {
    const pts = [];

    for (let i = 1; i < this.#numSegments; i++) {
      const xCoord = this.#startCoords.x + this.#avgSegVect.x * i;
      const yCoord = this.#startCoords.y + this.#avgSegVect.y * i;
      pts.push(new Vector2(xCoord, yCoord));
    };

    return pts;
  }

  // Randomise each preliminary common point with some ajustment in the direction of 
  // the main vector and perpendicular to it.
  #randCommonPts(commonPts) {
    for (let i = 0; i < commonPts.length; i++) {
      const commonPt = commonPts[i];

      const randAdjFactorMain = randBetween(-SingleConnection.#COMMON_PTS_MAIN_RAND, 
        SingleConnection.#COMMON_PTS_MAIN_RAND);

      const randAdjFactorPerp = randBetween(-SingleConnection.#COMMON_PTS_PERP_RAND, 
        SingleConnection.#COMMON_PTS_PERP_RAND);

      const adjVectMain = this.#avgSegVect.getScaledVector(randAdjFactorMain);
      const adjVectPerp = this.#perpUnitVect.getScaledVector(this.#totalD * randAdjFactorPerp);

      const adjCommonPt = commonPt.addVector(adjVectMain).addVector(adjVectPerp);

      commonPts[i] = adjCommonPt;
    };

    return commonPts;
  }
}