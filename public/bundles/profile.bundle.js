/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/connectSubPath.mjs":
/*!**********************************************************************************!*\
  !*** ./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/connectSubPath.mjs ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConnectSubPath": () => (/* binding */ ConnectSubPath)
/* harmony export */ });
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");




class ConnectSubPath {
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
    const absAngle = (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.randBetween)(randLims.minAngleDiff, randLims.maxAngleDiff);
    const angle = absAngle * rotDir;
    const unscaledVect = dirVect.getRotatedVector(angle);

    // Get random proportion of segment distance.
    const scaleFactor = (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.randBetween)(randLims.minMagFact, randLims.maxMagFact);
    
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

/***/ }),

/***/ "./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/subClasses/corePath.mjs":
/*!***************************************************************************************!*\
  !*** ./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/subClasses/corePath.mjs ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CorePath": () => (/* binding */ CorePath)
/* harmony export */ });
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");
/* harmony import */ var _connectSubPath_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../connectSubPath.mjs */ "./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/connectSubPath.mjs");





class CorePath extends _connectSubPath_mjs__WEBPACK_IMPORTED_MODULE_1__.ConnectSubPath {
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
      this.rotDirToSegVect = (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.testRandom)(0.5) ? 1 : -1;
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

/***/ }),

/***/ "./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/subClasses/extraPath.mjs":
/*!****************************************************************************************!*\
  !*** ./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/subClasses/extraPath.mjs ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExtraPath": () => (/* binding */ ExtraPath)
/* harmony export */ });
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");
/* harmony import */ var _connectSubPath_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../connectSubPath.mjs */ "./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/connectSubPath.mjs");





class ExtraPath extends _connectSubPath_mjs__WEBPACK_IMPORTED_MODULE_1__.ConnectSubPath{
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

    return (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.testRandom)(probPerpRejoin);
  }
}

/***/ }),

/***/ "./src/js/modules/drawSvgs/connectionsSvg/connectionsSvg.mjs":
/*!*******************************************************************!*\
  !*** ./src/js/modules/drawSvgs/connectionsSvg/connectionsSvg.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConnectionsSvg": () => (/* binding */ ConnectionsSvg)
/* harmony export */ });
/* harmony import */ var _vector2_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../vector2.mjs */ "./src/js/modules/vector2.mjs");
/* harmony import */ var _singleConnection_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./singleConnection.mjs */ "./src/js/modules/drawSvgs/connectionsSvg/singleConnection.mjs");





// SVG image of connections between DOM nodes in artistic curve style, includes 
// drawing animation.
// data-connects-to should always be written on the element that the connection 
// should start from (for animated drawing purposes).
class ConnectionsSvg {
  #elemsToJoin;
  #connections = [];
  #drawOriginId;

  constructor(elemsToJoin) {
    this.#elemsToJoin = elemsToJoin;
  }

  // Create the SVG and animate drawing the lines in.
  createAndDraw() {
    this.#createSvg(this.#elemsToJoin);
    this.#startDrawing();
  }

  // Hide all the paths, add event listeners for when a connection has finished 
  // drawing to start drawing subsequent ones and start drawing from the origin element.
  #startDrawing() {
    this.#connections.forEach(connection => {
      connection.hidePaths();
      connection.addEventListener("connectionDrawn", evt => {
        this.#draw(evt.detail.endId);
      });
    });

    this.#draw(this.#drawOriginId);
  }

  // Draws all the connections that start from a given elemend id.
  // justConnectedId is the element Id (from the data attribute) of the element 
  // that has just finished having a connection drawn to it.
  #draw(justConnectedId) {
    this.#connections.forEach(connection => {
      if (connection.startId === justConnectedId) {
        connection.draw();
      };
    });
  }

  // Create the SVG dom element with all connections, segments and paths.
  #createSvg(elems) {
    const parentElem = document.querySelector(".svg-connects-wrapper");
    const parentElemRect = parentElem.getBoundingClientRect();

    const originElem = parentElem.querySelector('[data-draw-origin="true"');
    this.#drawOriginId = originElem.dataset.connectId;
    
    const parentOffset = new _vector2_mjs__WEBPACK_IMPORTED_MODULE_0__.Vector2(parentElemRect.left, parentElemRect.top);
  
    const viewBoxWidth = parentElemRect.width;
    const viewBoxHeight = parentElemRect.height;
  
    const connectElemDetails = this.#getConnectElemDetails(elems, parentOffset);
    const connectionInfos = this.#getConnectionInfos(connectElemDetails);
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
    svg.classList.add("connections-svg");
    svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("alt", "");
    
    this.#createConnections(connectionInfos);
    this.#createSvgPaths(svg);

    parentElem.appendChild(svg);
    return svg;
  }

  // Get all the paths from each connection of the SVG.
  #createSvgPaths(svg) {
    this.#connections.forEach(connection => {
      svg.append(...connection.pathElems);
    });
  }

  // Create a connections object for each coords pair and add set the paths for 
  // each connection.
  #createConnections(connectionInfos) {
    connectionInfos.forEach(connectionInfo => {
      const connection = new _singleConnection_mjs__WEBPACK_IMPORTED_MODULE_1__.SingleConnection(connectionInfo);
      connection.createPaths();
      this.#connections.push(connection);
    });
  }

  // Get details on each connection to be drawn.
  #getConnectionInfos(elemsConnectInfos) {
    const connectionInfos = [];

    elemsConnectInfos.forEach(elem => {
      elem?.connectsTo?.forEach(connection => {
        const startCoords = elem.posn;
        const endConnectElem = elemsConnectInfos.find(elem => {
          return elem.elemId === connection;
        });

        const endCoords = endConnectElem.posn;
        const connectCoords = [startCoords, endCoords];
        const elemIds = [elem.elemId, connection];
        const connectionInfo = {coords: connectCoords, elemIds: elemIds};

        connectionInfos.push(connectionInfo);
      });
    });

    return connectionInfos;
  }

  // Get connection details for each element to be connected.
  #getConnectElemDetails(elems, parentOffset) {
    const elemsConnectInfos = [];
    
    elems.forEach(elem => {
      const connectInfo = {};

      const thisElemRect = elem.getBoundingClientRect();
      const afterElemStyles = window.getComputedStyle(elem, ':after');
      const connectPsn = this.#getConnectPsn(thisElemRect, afterElemStyles, parentOffset);

      const elemConnectId = elem.dataset.connectId;
      connectInfo.elemId = elemConnectId;
      connectInfo.posn = connectPsn;
      connectInfo.connectsTo = elem.dataset?.connectsTo?.split(",");
  
      elemsConnectInfos.push(connectInfo);
    });
  
    return elemsConnectInfos;
  }

  // Get connect position coordinates for an element.
  #getConnectPsn(elemRect, afterElemStyles, parentOffset) {
    const xCoord = elemRect.left - parentOffset.x + parseInt(afterElemStyles.left, 10);
    const yCoord = elemRect.top - parentOffset.y + parseInt(afterElemStyles.top, 10);
    const connectCoords = new _vector2_mjs__WEBPACK_IMPORTED_MODULE_0__.Vector2(xCoord, yCoord);
  
    return connectCoords;
  }
}

/***/ }),

/***/ "./src/js/modules/drawSvgs/connectionsSvg/segment.mjs":
/*!************************************************************!*\
  !*** ./src/js/modules/drawSvgs/connectionsSvg/segment.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Segment": () => (/* binding */ Segment)
/* harmony export */ });
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");
/* harmony import */ var _connectSubPath_subClasses_corePath_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connectSubPath/subClasses/corePath.mjs */ "./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/subClasses/corePath.mjs");
/* harmony import */ var _connectSubPath_subClasses_extraPath_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./connectSubPath/subClasses/extraPath.mjs */ "./src/js/modules/drawSvgs/connectionsSvg/connectSubPath/subClasses/extraPath.mjs");






class Segment {
  #idx;
  #start;
  #end;
  #mainVect;
  #mainUnitVect;
  #vectMag;
  extraPathsBothEndsPerp = false;
  hasPattern;
  corePath;
  extraPaths = [];
  allPaths = [];

  static #PROB_BOTH_EXTRA_END_PERP = 0.4;

  constructor(idx, hasPattern, start, end) {
    this.#idx = idx;
    this.hasPattern = hasPattern;
    this.#start = start;
    this.#end = end;
    this.#mainVect = this.#start.vectorTo(this.#end);
    this.#mainUnitVect = this.#mainVect.getUnitVector();
    this.#vectMag = this.#mainVect.getMag();
  }

  // Populate the corePathCtrlPts for this segment.
  setCorePath(prevSeg) {
    this.corePath = new _connectSubPath_subClasses_corePath_mjs__WEBPACK_IMPORTED_MODULE_1__.CorePath(this.#start, this.#end, this.#idx);

    this.corePath.getCtrlPts(this.#idx, this.#vectMag, this.#start, this.#end, 
      this.#mainUnitVect, prevSeg);
  }

  // Populate the ctrlPts for the extra paths for this segment, if it has any.
  setExtraPaths(prevSeg, nextSeg) {
    if (!this.hasPattern) return;

    // Dont allow a segment to have both ends be perpendicular for both extra 
    // paths or looks like fat bubble.
    const prevSegBothEndsPerp = prevSeg?.extraPathsBothEndsPerp;
    this.extraPathsBothEndsPerp = prevSegBothEndsPerp ? false 
      : (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.testRandom)(Segment.#PROB_BOTH_EXTRA_END_PERP);

    for (let extraPathNum = 0; extraPathNum < 2; extraPathNum++) {

      this.extraPaths[extraPathNum] = new _connectSubPath_subClasses_extraPath_mjs__WEBPACK_IMPORTED_MODULE_2__.ExtraPath(this.#start, this.#end, 
        this.#idx, extraPathNum);

      this.extraPaths[extraPathNum].getCtrlPts(this.#vectMag, this.#start, 
        this.#end, prevSeg, nextSeg, this.corePath, this.extraPathsBothEndsPerp);
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

/***/ }),

/***/ "./src/js/modules/drawSvgs/connectionsSvg/singleConnection.mjs":
/*!*********************************************************************!*\
  !*** ./src/js/modules/drawSvgs/connectionsSvg/singleConnection.mjs ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SingleConnection": () => (/* binding */ SingleConnection)
/* harmony export */ });
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");
/* harmony import */ var _drawAnimSvgs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../drawAnimSvgs.js */ "./src/js/modules/drawSvgs/drawAnimSvgs.js");
/* harmony import */ var _vector2_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../vector2.mjs */ "./src/js/modules/vector2.mjs");
/* harmony import */ var _segment_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./segment.mjs */ "./src/js/modules/drawSvgs/connectionsSvg/segment.mjs");







class SingleConnection extends EventTarget {
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
  static #STANDARD_SEG_LEN_RATIO = 9;
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
    this.#avgSegVect = new _vector2_mjs__WEBPACK_IMPORTED_MODULE_2__.Vector2(avgSegVectX, avgSegVectY);

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
      await (0,_drawAnimSvgs_js__WEBPACK_IMPORTED_MODULE_1__.drawSimulPaths)(segPaths);
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

      const thisSegDetails = new _segment_mjs__WEBPACK_IMPORTED_MODULE_3__.Segment(segNum, hasPattern, start, end);

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

      const thisSeg = (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.testRandom)(probIsPattern) ? 1 : "g";
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
      pts.push(new _vector2_mjs__WEBPACK_IMPORTED_MODULE_2__.Vector2(xCoord, yCoord));
    };

    return pts;
  }

  // Randomise each preliminary common point with some ajustment in the direction of 
  // the main vector and perpendicular to it.
  #randCommonPts(commonPts) {
    for (let i = 0; i < commonPts.length; i++) {
      const commonPt = commonPts[i];

      const randAdjFactorMain = (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.randBetween)(-SingleConnection.#COMMON_PTS_MAIN_RAND, 
        SingleConnection.#COMMON_PTS_MAIN_RAND);

      const randAdjFactorPerp = (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.randBetween)(-SingleConnection.#COMMON_PTS_PERP_RAND, 
        SingleConnection.#COMMON_PTS_PERP_RAND);

      const adjVectMain = this.#avgSegVect.getScaledVector(randAdjFactorMain);
      const adjVectPerp = this.#perpUnitVect.getScaledVector(this.#totalD * randAdjFactorPerp);

      const adjCommonPt = commonPt.addVector(adjVectMain).addVector(adjVectPerp);

      commonPts[i] = adjCommonPt;
    };

    return commonPts;
  }
}

/***/ }),

/***/ "./src/js/modules/drawSvgs/drawAnimSvgs.js":
/*!*************************************************!*\
  !*** ./src/js/modules/drawSvgs/drawAnimSvgs.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "drawAnimSvg": () => (/* binding */ drawAnimSvg),
/* harmony export */   "drawAnimSvgs": () => (/* binding */ drawAnimSvgs),
/* harmony export */   "drawInOrder": () => (/* binding */ drawInOrder),
/* harmony export */   "drawSimulPaths": () => (/* binding */ drawSimulPaths)
/* harmony export */ });
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");




// const svgsToDraw = document.querySelectorAll(".draw-svg");
// window.addEventListener("load", () => drawAnimSvgs(svgsToDraw));

function drawAnimSvgs(svgs) {
  svgs.forEach(svg => drawAnimSvg(svg));
}

// Animate drawing of an SVG using it's paths.
function drawAnimSvg(svg) {
  const svgPaths = svg.querySelectorAll("path");

  for (let path of svgPaths) {
    drawAnimPath(path);
  };
}

// Animated draw of a single path of an SVG.
function drawAnimPath(path) {
  const pathLength = path.getTotalLength();

  path.setAttribute("stroke-dasharray", pathLength);
  path.setAttribute("stroke-dashoffset", pathLength);

  setTimeout(() => {
    path.classList.add("draw-svg-path");
    path.setAttribute("stroke-dashoffset", 0);
  }, 0);
}

// Draws an array of paths simultaneously and returns promise that resolves 
// when all drawn.
async function drawSimulPaths(paths) {
  let pathsDrawn = new Promise(res => res());

  for (let path of paths) {
    path.classList.remove("hidden");
    drawAnimPath(path);
    pathsDrawn = (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.awaitTransition)(path, "stroke-dashoffset");
  };

  await pathsDrawn;
  return;
}

// This and below two functions not used currently as decided to use a style of 
// drawing where each connection is drawn once a connection is drawn to that 
// element, this is done in the ConnectionsSvg class.
async function drawInOrder(svg) {
  const svgPaths = Array.from(svg.children);
  svgPaths.forEach(pathElem => pathElem.classList.add("hidden"));
  
  const pathIdxElems = getPathIdxElems(svgPaths);

  for (let drawIdx = 0; drawIdx <= pathIdxElems.maxPathIdx; drawIdx++) {
    const pathIdxObj = pathIdxElems[drawIdx];

    for (let subDrawIdx = 0; subDrawIdx <= pathIdxObj.maxSubPathIdx; subDrawIdx++) {
      const subPaths = pathIdxObj[subDrawIdx];

      await drawSubPaths(subPaths, drawIdx, subDrawIdx);
    };
  };
}

// Draws the relevant sub paths with the given drawIdx and subDrawIdx and 
// returns a promise that resolves when these subPaths have finished being drawn.
async function drawSubPaths(paths) {
  let pathsDrawn = new Promise(res => res());

  for (let path of paths) {
    path.classList.remove("hidden");
    drawAnimPath(path);
    pathsDrawn = (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.awaitTransition)(path, "stroke-dashoffset");
  };

  await pathsDrawn;
  return;
}

// Builds an object with keys of drawIdxs and sub keys of subDrawIdxs and 
// properties which are arrays of paths with these draw and subDraw idxs.
function getPathIdxElems(pathElems) {
  const pathIdxElems = {maxPathIdx: 0};

  for (let pathElem of pathElems) {
    const pathDrawIdx = Number(pathElem.dataset.drawIdx);
    const pathSubDrawIdx = Number(pathElem.dataset.subDrawIdx);

    const pathIdxExists = Object.hasOwn(pathIdxElems, pathDrawIdx);

    if (pathIdxExists) {
      const subPathIdxExists = Object.hasOwn(pathIdxElems[pathDrawIdx], pathSubDrawIdx);

      // Add the pathElem.
      if (subPathIdxExists) {
        pathIdxElems[pathDrawIdx][pathSubDrawIdx].push(pathElem);
      }
      // Increase maxSubPathIdx if necessary and add the pathElem.
      else {
        const newMaxSubIdx = pathSubDrawIdx > pathIdxElems[pathDrawIdx].maxSubPathIdx;

        if (newMaxSubIdx) {
          pathIdxElems[pathDrawIdx].maxSubPathIdx = pathSubDrawIdx;
        };

        pathIdxElems[pathDrawIdx][pathSubDrawIdx] = [pathElem];
      };
    }

    // Increase the maxPathIdx if necessary and add the path and subPathElem.
    else {
      const newMaxPathIdx = pathDrawIdx > pathIdxElems.maxPathIdx;

      if (newMaxPathIdx) {
        pathIdxElems.maxPathIdx = pathDrawIdx;
      };

      pathIdxElems[pathDrawIdx] = {
        maxSubPathIdx: pathSubDrawIdx,
        [pathSubDrawIdx]: [pathElem]
      };
    };
  };

  return pathIdxElems;
}

/***/ }),

/***/ "./src/js/modules/fadeTransitions.mjs":
/*!********************************************!*\
  !*** ./src/js/modules/fadeTransitions.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fadeFromTo": () => (/* binding */ fadeFromTo),
/* harmony export */   "fadeIn": () => (/* binding */ fadeIn),
/* harmony export */   "fadeOut": () => (/* binding */ fadeOut),
/* harmony export */   "finishFadeIn": () => (/* binding */ finishFadeIn),
/* harmony export */   "finishFadeOut": () => (/* binding */ finishFadeOut),
/* harmony export */   "fullyFadeIn": () => (/* binding */ fullyFadeIn),
/* harmony export */   "fullyFadeOut": () => (/* binding */ fullyFadeOut)
/* harmony export */ });
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");
// Helper functions to assist with fading in / out DOM elements.




// Fade transition helper functions, used with transparent, fully-hidden and 
// fade-trans css classes.
// Makes display property visible and then removes transparency.
function fadeIn(elem) {
  elem.classList.remove("fully-hidden");
  setTimeout(() => elem.classList.remove("transparent"), 10);
}

async function finishFadeIn(elem) {
  await (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.awaitTransition)(elem, "opacity");
}

// Finishes when fade in is completed.
async function fullyFadeIn(elem) {
  fadeIn(elem);
  await finishFadeIn(elem);
}

function fadeOut(elem) {
  elem.classList.add("transparent");
}

// Function that returns a promise that resolves when opacity transition on the 
// given element is completed. Also fully hides the element.
async function finishFadeOut(elem) {
  await (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.awaitTransition)(elem, "opacity");
  elem.classList.add("fully-hidden");
}

// Fade out and fully hide the given element.
async function fullyFadeOut(elem) {
  fadeOut(elem);
  await finishFadeOut(elem);
}

// Fades out elem1 and fades in elem2 once transition completed, doesn't finish 
// until elem2 fully faded in. Returns promise.
function fadeFromTo(elem1, elem2) {
  const fadeCompletePromise = new Promise(async resolve => {
    await fullyFadeOut(elem1);
    await fullyFadeIn(elem2);
    resolve();
  });

  return fadeCompletePromise;
}

/***/ }),

/***/ "./src/js/modules/popBtns.mjs":
/*!************************************!*\
  !*** ./src/js/modules/popBtns.mjs ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fadeTransitions.mjs */ "./src/js/modules/fadeTransitions.mjs");




// Btn with associated content. Content fades in when button is clicked and 
// fades out when anything is clicked. Used by info buttons and nav dropdown.
class PopBtn {
  #btn;
  #content;

  constructor(popBtnContainer) {
    this.#btn = popBtnContainer.querySelector(".pop-btn");
    this.#content = popBtnContainer.querySelector(".pop-btn-content");
  }

  init() {
    this.#setupInfoBtnClick(this.#btn, this.#content);
  }

  #setupInfoBtnClick(btn, content) {
    btn.addEventListener("click", () => {
      this.#handleInfoBtnClick(btn, content);
    }, {once: true});
  }

  async #handleInfoBtnClick(btn, content) {
    await (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fullyFadeIn)(content);
    window.addEventListener("click", async () => {
      await (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fullyFadeOut)(content);
      this.#setupInfoBtnClick(btn, content);
    }, {once: true});
  }
}

// Inits all pop btns on a page.
function setupPopBtns() {
  const popBtnContainers = document.querySelectorAll(".pop-btn-container");
  
  popBtnContainers.forEach(popBtnContainer => {
    const popBtn = new PopBtn(popBtnContainer);
    popBtn.init();
  });
}

setupPopBtns();

/***/ }),

/***/ "./src/js/modules/vector2.mjs":
/*!************************************!*\
  !*** ./src/js/modules/vector2.mjs ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Vector2": () => (/* binding */ Vector2)
/* harmony export */ });

class Vector2 {
  x;
  y;
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getTxt() {
    return `${this.x}, ${this.y}`;
  }

  getReverse() {
    return new Vector2(-this.x, -this.y);
  }

  vectorTo(relVect) {
    return new Vector2(relVect.x - this.x, relVect.y - this.y);
  }

  vectorFrom(relVect) {
    return new Vector2(this.x - relVect.x, this.y - relVect.y);
  }

  addVector(vector) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  getScaledVector(scaleFactor) {
    return new Vector2(this.x * scaleFactor, this.y * scaleFactor);
  }

  getUnitVector() {
    const mag = this.getMag();
    return new Vector2(this.x / mag, this.y / mag);
  }

  getMag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  // Positive angle means clockwise, negative anticlockwise.
  getRotatedVector(angle, rotOrigin = new Vector2(0, 0)) {
    const rotVec = new Vector2(this.x, this.y);

    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // Translate point back to origin.
    rotVec.x -= rotOrigin.x;
    rotVec.y -= rotOrigin.y;

    // Rotate point.
    const xNew = rotVec.y * sinA + rotVec.x * cosA;
    const yNew = rotVec.y * cosA - rotVec.x * sinA;

    // Translate point back.
    rotVec.x = xNew + rotOrigin.x;
    rotVec.y = yNew + rotOrigin.y;
    return rotVec;
  }
}

/***/ }),

/***/ "./src/js/pages/loggedInPage.js":
/*!**************************************!*\
  !*** ./src/js/pages/loggedInPage.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_popBtns_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/popBtns.mjs */ "./src/js/modules/popBtns.mjs");


/***/ }),

/***/ "./src/sharedJs/utils.mjs":
/*!********************************!*\
  !*** ./src/sharedJs/utils.mjs ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "awaitTransition": () => (/* binding */ awaitTransition),
/* harmony export */   "clamp": () => (/* binding */ clamp),
/* harmony export */   "findAndOverwriteElsePush": () => (/* binding */ findAndOverwriteElsePush),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "randBetween": () => (/* binding */ randBetween),
/* harmony export */   "testRandMult": () => (/* binding */ testRandMult),
/* harmony export */   "testRandom": () => (/* binding */ testRandom)
/* harmony export */ });
// Clamp number between two values.
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function lerp(start, end, prprtn = 0.5) {
  return start + ((end - start) * prprtn);
}

// For ints, it is inclusive of start and not inclusive of end.
function randBetween(start = 0, end = 1, ints = false) {
  const range = end - start;
  const randFloat = (Math.random() * range) + start;
  return ints ? Math.floor(randFloat) : randFloat;
}

// Probability should be a decimal, returns true or false.
function testRandom(probability) {
  return (Math.random() <= probability) ? true : false;
}

// Takes a list of prob objects as input in format {name: name, prob: prob} and 
// returns name of chosen probObj, or false if none chosen (in case that probObjs 
// probs dont sum to 1).
function testRandMult(...probs) {
  const probsObjs = [];
  let currProbStart = 0;

  probs.forEach(prob => {
    const thisProb = {
      name: prob.name,
      start: currProbStart,
      end: currProbStart + prob.prob
    };

    probsObjs.push(thisProb);

    currProbStart += prob;
  });

  const chosenVal = Math.random();
  let returnVal = false;

  probsObjs.forEach(prob => {
    const chosenThisProb = prob.start <= chosenVal && prob.end > chosenVal;
    if (chosenThisProb) {
      returnVal = prob.name;
    };
  });

  return returnVal;
}

// Searches for a newItem in an array given an elemCompFunc that determines 
// whether it is present or not (eg. to find based on question ID). If present, 
// element in array is overwritten with newItem, otherwise newItem is pushed to 
// end of array.
function findAndOverwriteElsePush(array, newItem, elemCompFunc) {
  const foundIndex = array.findIndex(arrItem => elemCompFunc(arrItem, newItem));

  // If found, overwrite.
  if (foundIndex > -1) {
    array.splice(foundIndex, 1, newItem);
  }
  // Otherwise add.
  else {
    array.push(newItem);
  };
}

// Returns a promise that resolves when transition on given element ends, 
// optional transition property name check.
function awaitTransition(elem, propName = null) {
  return new Promise(resolve => {
    elem.addEventListener("transitionend", async evt => {

      if (propName) {
        if (evt.propertyName === propName) {
          resolve();
        }

        else {
          await awaitTransition(elem, propName);
          resolve();
        };
      }

      else {
        resolve();
      };

    }, {once: true});
  })
}

// For testing long running functions.
// await new Promise(resolve => setTimeout(resolve, 3000)); //........................................................

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./src/js/pages/profile.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_drawSvgs_connectionsSvg_connectionsSvg_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/drawSvgs/connectionsSvg/connectionsSvg.mjs */ "./src/js/modules/drawSvgs/connectionsSvg/connectionsSvg.mjs");
/* harmony import */ var _loggedInPage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loggedInPage.js */ "./src/js/pages/loggedInPage.js");





const elemsToJoin = document.querySelectorAll(".connect-elem");
const connectionsSvg = new _modules_drawSvgs_connectionsSvg_connectionsSvg_mjs__WEBPACK_IMPORTED_MODULE_0__.ConnectionsSvg(elemsToJoin);

window.addEventListener("load", () => {
  connectionsSvg.createAndDraw();
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixnRUFBVztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnRUFBVztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QixRQUFRLHVCQUF1QixFQUFFLHVCQUF1QixFQUFFLG1CQUFtQjtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZEa0U7QUFDWDtBQUN2RDtBQUNBO0FBQ0E7QUFDTyx1QkFBdUIsK0RBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLCtEQUFVO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRWtFO0FBQ1g7QUFDdkQ7QUFDQTtBQUNBO0FBQ08sd0JBQXdCLCtEQUFjO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsK0RBQVU7QUFDckI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQzVJNEM7QUFDYztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLEdBQUcsV0FBVztBQUNuQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsNERBQTREOzs7Ozs7VUNoRzVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTnVGO0FBQzVEO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLCtGQUFjO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLENBQUMsRSIsInNvdXJjZXMiOlsid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9kcmF3U3Zncy9jb25uZWN0aW9uc1N2Zy9jb25uZWN0U3ViUGF0aC9jb25uZWN0U3ViUGF0aC5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2RyYXdTdmdzL2Nvbm5lY3Rpb25zU3ZnL2Nvbm5lY3RTdWJQYXRoL3N1YkNsYXNzZXMvY29yZVBhdGgubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9kcmF3U3Zncy9jb25uZWN0aW9uc1N2Zy9jb25uZWN0U3ViUGF0aC9zdWJDbGFzc2VzL2V4dHJhUGF0aC5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2RyYXdTdmdzL2Nvbm5lY3Rpb25zU3ZnL2Nvbm5lY3Rpb25zU3ZnLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvZHJhd1N2Z3MvY29ubmVjdGlvbnNTdmcvc2VnbWVudC5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2RyYXdTdmdzL2Nvbm5lY3Rpb25zU3ZnL3NpbmdsZUNvbm5lY3Rpb24ubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9kcmF3U3Zncy9kcmF3QW5pbVN2Z3MuanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2ZhZGVUcmFuc2l0aW9ucy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3BvcEJ0bnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy92ZWN0b3IyLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL3NoYXJlZEpzL3V0aWxzLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9wYWdlcy9wcm9maWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJhbmRCZXR3ZWVuIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NoYXJlZEpzL3V0aWxzLm1qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdFN1YlBhdGgge1xyXG4gICNzdGFydDtcclxuICAjZW5kO1xyXG4gICNkVmFsO1xyXG4gICNzZWdJZHg7XHJcbiAgcGF0aEVsZW07XHJcbiAgY3RybFB0MTtcclxuICBjdHJsUHQyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihzZWdTdGFydCwgc2VnRW5kLCBzZWdJZHgpIHtcclxuICAgIHRoaXMuI3N0YXJ0ID0gc2VnU3RhcnQ7XHJcbiAgICB0aGlzLiNlbmQgPSBzZWdFbmQ7XHJcbiAgICB0aGlzLiNzZWdJZHggPSBzZWdJZHg7XHJcbiAgfVxyXG5cclxuICAvLyBVc2VkIGJ5IGNvcmUgYW5kIGV4dHJhIHBhdGhzIHdoZW4gZm9sbG93aW5nIG9uIGZyb20gcHJldmlvdXMgY29yZSAvIGV4dHJhIHBhdGhzLlxyXG4gIF9nZXRDb250aW51aW5nQ3RybFB0MShwcmV2Q3RybFB0Miwgc2VnU3RhcnQpIHtcclxuICAgIGNvbnN0IHNlZ1N0YXJ0VG9QcmV2Q3RybFB0MiA9IHNlZ1N0YXJ0LnZlY3RvclRvKHByZXZDdHJsUHQyKTtcclxuXHJcbiAgICBjb25zdCBzZWdTdGFydFRvQ3RybFB0MSA9IHNlZ1N0YXJ0VG9QcmV2Q3RybFB0Mi5nZXRSb3RhdGVkVmVjdG9yKE1hdGguUEkpO1xyXG4gICAgY29uc3QgY3RybFB0MSA9IHNlZ1N0YXJ0LmFkZFZlY3RvcihzZWdTdGFydFRvQ3RybFB0MSk7XHJcbiAgICByZXR1cm4gY3RybFB0MTtcclxuICB9XHJcblxyXG4gIC8vIFRha2VzIGRpcmVjdGlvbiAoMSBmb3IgY2xvY2t3aXNlLCAtMSBmb3IgYW50aWNsb2Nrd2lzZSksIHVuaXRkaXJlY3Rpb24gdmVjdG9yLCBcclxuICAvLyBtYWduaXR1ZGUgYW5kIHRoZW4gbWlucyBhbmQgbWF4IGZvciBhbmdsZSBhbmQgc2NhbGUgZmFjdG9yIHJhbmRvbWlzYXRpb24gcmFuZ2VzLlxyXG4gIF9nZXRSYW5kVmVjdChyb3REaXIsIGRpclZlY3QsIHNlZ1ZlY3RNYWcsIHJhbmRMaW1zKSB7XHJcbiAgICBjb25zdCBhYnNBbmdsZSA9IHJhbmRCZXR3ZWVuKHJhbmRMaW1zLm1pbkFuZ2xlRGlmZiwgcmFuZExpbXMubWF4QW5nbGVEaWZmKTtcclxuICAgIGNvbnN0IGFuZ2xlID0gYWJzQW5nbGUgKiByb3REaXI7XHJcbiAgICBjb25zdCB1bnNjYWxlZFZlY3QgPSBkaXJWZWN0LmdldFJvdGF0ZWRWZWN0b3IoYW5nbGUpO1xyXG5cclxuICAgIC8vIEdldCByYW5kb20gcHJvcG9ydGlvbiBvZiBzZWdtZW50IGRpc3RhbmNlLlxyXG4gICAgY29uc3Qgc2NhbGVGYWN0b3IgPSByYW5kQmV0d2VlbihyYW5kTGltcy5taW5NYWdGYWN0LCByYW5kTGltcy5tYXhNYWdGYWN0KTtcclxuICAgIFxyXG4gICAgY29uc3Qgc2NhbGUgPSBzZWdWZWN0TWFnICogc2NhbGVGYWN0b3I7XHJcbiAgICByZXR1cm4gdW5zY2FsZWRWZWN0LmdldFNjYWxlZFZlY3RvcihzY2FsZSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXRzIHRoZSBkIHZhbHVlIHRvIGJlIHVzZWQgYnkgYW4gc3ZnIGltYWdlLlxyXG4gIHNldERWYWwoKSB7XHJcbiAgICB0aGlzLiNkVmFsID0gYE0gJHt0aGlzLiNzdGFydC5nZXRUeHQoKX0gXHJcbiAgICBDICR7dGhpcy5jdHJsUHQxLmdldFR4dCgpfSAke3RoaXMuY3RybFB0Mi5nZXRUeHQoKX0gJHt0aGlzLiNlbmQuZ2V0VHh0KCl9YDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVBhdGhFbGVtKCkge1xyXG4gICAgY29uc3QgdGhpc1BhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInBhdGhcIilcclxuICAgIHRoaXNQYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgdGhpcy4jZFZhbCk7XHJcbiAgICB0aGlzUGF0aC5kYXRhc2V0LnN1YkRyYXdJZHggPSB0aGlzLiNzZWdJZHg7XHJcbiAgICB0aGlzLnBhdGhFbGVtID0gdGhpc1BhdGg7XHJcbiAgICByZXR1cm4gdGhpcy5wYXRoRWxlbTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyB0ZXN0UmFuZG9tIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uLy4uL3NoYXJlZEpzL3V0aWxzLm1qc1wiO1xyXG5pbXBvcnQgeyBDb25uZWN0U3ViUGF0aCB9IGZyb20gXCIuLi9jb25uZWN0U3ViUGF0aC5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENvcmVQYXRoIGV4dGVuZHMgQ29ubmVjdFN1YlBhdGgge1xyXG4gIHJvdERpclRvU2VnVmVjdDtcclxuXHJcbiAgLy8gVGhlc2UgYXJlIHVzZWQgZm9yIGdldHRpbmcgMXN0IGNvbnRyb2wgcG9pbnQgaWYgdGhlIHNlZ21lbnQgaXMgdGhlIHZlcnkgXHJcbiAgLy8gZmlyc3Qgb25lIGluIHRoZSBjb25uZWN0aW9uLiBNYWcgZmFjdG9yIGlzIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgc2VnbWVudHMgXHJcbiAgLy8gZCBhbmQgYW5nbGUgaXMgZnJvbSB0aGUgb3ZlcmFsbCBjb25uZWN0aW9uIG1haW4gdmVjdG9yLiBJbiB0aGUgZW5kIGl0IFxyXG4gIC8vIGxvb2tlZCBiZXN0IGp1c3QgZml4ZWQgYXQgdGhlc2UgdmFsdWVzIEkgdGhpbmsuXHJcbiAgc3RhdGljICNSQU5EX1ZFQ1RfTElNUyA9IHsgXHJcbiAgICBtaW5BbmdsZURpZmY6IDI1ICogKE1hdGguUEkgLyAxODApLFxyXG4gICAgbWF4QW5nbGVEaWZmOiAyNSAqIChNYXRoLlBJIC8gMTgwKSxcclxuICAgIG1pbk1hZ0ZhY3Q6IDAuMyxcclxuICAgIG1heE1hZ0ZhY3Q6IDAuM1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3RybFB0cyhpZHgsIHNlZ1ZlY3RNYWcsIHNlZ1N0YXJ0LCBzZWdFbmQsIHNlZ1VuaXRWZWN0LCBwcmV2U2VnKSB7XHJcbiAgICB0aGlzLmN0cmxQdDEgPSB0aGlzLiNnZXRDdHJsUHQxKGlkeCwgc2VnVmVjdE1hZywgc2VnU3RhcnQsIHNlZ1VuaXRWZWN0LCBwcmV2U2VnKTtcclxuICAgIHRoaXMuY3RybFB0MiA9IHRoaXMuI2dldEN0cmxQdDIoc2VnRW5kLCBzZWdVbml0VmVjdCwgc2VnVmVjdE1hZyk7XHJcbiAgfVxyXG5cclxuICAvLyBHZXRzIHRoZSBmaXJzdCBjb250cm9sIHBvaW50IGZvciB0aGlzIGNvcmUgcGF0aCBjdWJpYyBiZXppZXIgY3VydmUuXHJcbiAgI2dldEN0cmxQdDEoaWR4LCBzZWdWZWN0TWFnLCBzZWdTdGFydCwgc2VnVW5pdFZlY3QsIHByZXZTZWcpIHtcclxuICAgIGxldCBjdHJsUHQxO1xyXG5cclxuICAgIGNvbnN0IGlzRmlyc3RTZWcgPSBpZHggPT09IDA7XHJcblxyXG4gICAgLy8gSWYgdmVyeSBmaXJzdCBzZWdtZW50IGluIHRoZSBjb25uZWN0aW9uLCBjaG9vc2UgcmFuZG9tIGRpcmVjdGlvbiBsZWZ0IG9yIFxyXG4gICAgLy8gcmlnaHQgb2YgdG90YWwgbWFpbiB2ZWN0b3IuXHJcbiAgICBpZiAoaXNGaXJzdFNlZykge1xyXG4gICAgICB0aGlzLnJvdERpclRvU2VnVmVjdCA9IHRlc3RSYW5kb20oMC41KSA/IDEgOiAtMTtcclxuICAgICAgY29uc3QgcmFuZExpbXMgPSBDb3JlUGF0aC4jUkFORF9WRUNUX0xJTVM7XHJcblxyXG4gICAgICBjb25zdCB0cmFuc2xhdGVWZWN0ID0gdGhpcy5fZ2V0UmFuZFZlY3QodGhpcy5yb3REaXJUb1NlZ1ZlY3QsIHNlZ1VuaXRWZWN0LCBcclxuICAgICAgICBzZWdWZWN0TWFnLCByYW5kTGltcyk7XHJcblxyXG4gICAgICBjdHJsUHQxID0gc2VnU3RhcnQuYWRkVmVjdG9yKHRyYW5zbGF0ZVZlY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE90aGVyd2lzZSwgY3RybFB0MSBzaG91bGQgYmUgcHJldmlvdXMgc2VnbWVudCdzIGNvcmUgcGF0aCdzIGN0cmxQdDIsIFxyXG4gICAgLy8gcm90YXRlZCAxODAgZGVncmVlcyBhYm91dCB0aGlzIHNlZyBzdGFydC5cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnJvdERpclRvU2VnVmVjdCA9IC1wcmV2U2VnLmNvcmVQYXRoLnJvdERpclRvU2VnVmVjdDtcclxuICAgICAgY29uc3QgcHJldkNvcmVDdHJsUHQyID0gcHJldlNlZy5jb3JlUGF0aC5jdHJsUHQyO1xyXG4gICAgICBjdHJsUHQxID0gdGhpcy5fZ2V0Q29udGludWluZ0N0cmxQdDEocHJldkNvcmVDdHJsUHQyLCBzZWdTdGFydCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBjdHJsUHQxO1xyXG4gIH1cclxuXHJcbiAgLy8gR2VuZXJhdGUgYSByYW5kb20gdmVjdG9yIGJhY2sgZnJvbSB0aGUgc2VnIGVuZCwgb24gdGhlIHNhbWUgc2lkZSByZWxhdGl2ZSBcclxuICAvLyB0byBzZWcgbWFpbiB2ZWN0b3IuXHJcbiAgI2dldEN0cmxQdDIoc2VnRW5kLCBzZWdVbml0VmVjdCwgc2VnVmVjdE1hZykge1xyXG4gICAgY29uc3QgcmFuZExpbXMgPSBDb3JlUGF0aC4jUkFORF9WRUNUX0xJTVM7XHJcbiAgICBjb25zdCByZXZlcnNlU2VnVmVjdCA9IHNlZ1VuaXRWZWN0LmdldFJldmVyc2UoKTtcclxuXHJcbiAgICBjb25zdCB0cmFuc2xhdGVWZWN0ID0gdGhpcy5fZ2V0UmFuZFZlY3QoLXRoaXMucm90RGlyVG9TZWdWZWN0LCByZXZlcnNlU2VnVmVjdCwgXHJcbiAgICAgIHNlZ1ZlY3RNYWcsIHJhbmRMaW1zKTtcclxuXHJcbiAgICBjb25zdCBjdHJsUHQyID0gc2VnRW5kLmFkZFZlY3Rvcih0cmFuc2xhdGVWZWN0KTtcclxuICAgIHJldHVybiBjdHJsUHQyO1xyXG4gIH1cclxufSIsImltcG9ydCB7IHRlc3RSYW5kb20gfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkSnMvdXRpbHMubWpzXCI7XHJcbmltcG9ydCB7IENvbm5lY3RTdWJQYXRoIH0gZnJvbSBcIi4uL2Nvbm5lY3RTdWJQYXRoLm1qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgRXh0cmFQYXRoIGV4dGVuZHMgQ29ubmVjdFN1YlBhdGh7XHJcbiAgI2V4dHJhUGF0aElkO1xyXG4gIHJvdERpclRvQ29yZVBhdGg7XHJcbiAgaW5zaWRlQ29yZTtcclxuXHJcbiAgLy8gRm9yIHRoZSBleHRyYSBwYXRoIHRoYXQgcnVucyBvdXRzaWRlIG9mIHRoZSBjb3JlIHBhdGguXHJcbiAgc3RhdGljICNSQU5EX09VVFNJREVfVkVDVF9MSU1TID0geyBcclxuICAgIG1pbkFuZ2xlRGlmZjogMTAgKiAoTWF0aC5QSSAvIDE4MCksXHJcbiAgICBtYXhBbmdsZURpZmY6IDIwICogKE1hdGguUEkgLyAxODApLFxyXG4gICAgbWluTWFnRmFjdDogMC4zLFxyXG4gICAgbWF4TWFnRmFjdDogMC40XHJcbiAgfVxyXG5cclxuICAvLyBTTGlnaHRseSBhZGp1c3RlZCBsaW1pdHMgZm9yIGlmIGN1dHRpbmcgaW5zaWRlIHRoZSBjb3JlIHBhdGggYXMgY29yZSBwYXRoIGN1cnZlcyBcclxuICAvLyBvdXR3YXJkcywgbWFrZSBjb250cm9sIHBvaW50cyBtb3JlIHByb21pbmVudCBzbyBsaW5lIGlzbid0IHRvbyBjbG9zZSB0byBjb3JlIHBhdGguXHJcbiAgc3RhdGljICNSQU5EX0lOU0lERV9WRUNUX0xJTVMgPSB7XHJcbiAgICBtaW5BbmdsZURpZmY6IDUgKiAoTWF0aC5QSSAvIDE4MCksXHJcbiAgICBtYXhBbmdsZURpZmY6IDMwICogKE1hdGguUEkgLyAxODApLFxyXG4gICAgbWluTWFnRmFjdDogMC4yLFxyXG4gICAgbWF4TWFnRmFjdDogMC42XHJcbiAgfVxyXG4gIC8vIFByb2JhYmlsaXR5IHRoZSBleHRyYSBwYXRoIGluc2lkZSB0aGUgY29yZSBwYXRoIHJlam9pbnMgcGVycCwgZ2l2ZW4gdGhhdCBcclxuICAvLyBib3RoIGV4dHJhIHBhdGhzIGRvbid0IHJlam9pbiBwZXJwLlxyXG4gIHN0YXRpYyAjUFJPQl9JTlNJREVfUEVSUF9SRUpPSU4gPSAxO1xyXG5cclxuICBzdGF0aWMgI1JBTkRfUEVSUF9WRUNUX0xJTVMgPSB7XHJcbiAgICBtaW5BbmdsZURpZmY6IDcwICogKE1hdGguUEkgLyAxODApLFxyXG4gICAgbWF4QW5nbGVEaWZmOiA5MCAqIChNYXRoLlBJIC8gMTgwKSxcclxuICAgIG1pbk1hZ0ZhY3Q6IDAuMjUsXHJcbiAgICBtYXhNYWdGYWN0OiAwLjM2XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2VnU3RhcnQsIHNlZ0VuZCwgc2VnSWR4LCBleHRyYVBhdGhJZCkge1xyXG4gICAgc3VwZXIoc2VnU3RhcnQsIHNlZ0VuZCwgc2VnSWR4KTtcclxuICAgIHRoaXMuI2V4dHJhUGF0aElkID0gZXh0cmFQYXRoSWQ7XHJcbiAgfVxyXG5cclxuICBnZXRDdHJsUHRzKHNlZ1ZlY3RNYWcsIHNlZ1N0YXJ0LCBzZWdFbmQsIHByZXZTZWcsIG5leHRTZWcsIHNlZ0NvcmVQYXRoLCBib3RoRXh0cmFQYXRoc0VuZFBlcnApIHtcclxuICAgIHRoaXMuY3RybFB0MSA9IHRoaXMuI2dldEN0cmxQdDEoc2VnVmVjdE1hZywgcHJldlNlZywgc2VnU3RhcnQsIHNlZ0NvcmVQYXRoKTtcclxuICAgIHRoaXMuY3RybFB0MiA9IHRoaXMuI2dldEN0cmxQdDIoc2VnRW5kLCBuZXh0U2VnLCBzZWdWZWN0TWFnLCBzZWdDb3JlUGF0aCwgYm90aEV4dHJhUGF0aHNFbmRQZXJwKTtcclxuICB9XHJcblxyXG4gIC8vIEdlbmVyYXRlIGEgcmFuZG9tIHZlY3RvciB0byBlYWNoIHNpZGUgb2YgdGhlIGNvcmUgcGF0aCBmb3IgZWFjaCBleHRyYSBwYXRoLCBcclxuICAvLyBvciBjb250aW51ZSB0aGUgcHJldmlvdXMgZXh0cmEgcGF0aHMgaWYgdGhlcmUgd2VyZSBhbnkuXHJcbiAgI2dldEN0cmxQdDEoc2VnVmVjdE1hZywgcHJldlNlZywgc2VnU3RhcnQsIHNlZ0NvcmVQYXRoKSB7XHJcbiAgICBsZXQgY3RybFB0MTtcclxuXHJcbiAgICAvLyBJcyBhIGZvbGxvd2luZyBleHRyYSBwYXRoLCBuZWVkIGZpcnN0IGN0cmxQdCB0byBiZSBvcHBvc2l0ZSBvZiBsYXN0IFxyXG4gICAgLy8gc2VnJ3MgZXh0cmEgcGF0aHMnIDJuZCBjdHJsUHRzLlxyXG4gICAgaWYgKHByZXZTZWc/Lmhhc1BhdHRlcm4pIHtcclxuICAgICAgY29uc3QgZm9sbG93aW5nUGF0aCA9IHByZXZTZWcuZXh0cmFQYXRoc1t0aGlzLiNleHRyYVBhdGhJZF07XHJcbiAgICAgIHRoaXMuaW5zaWRlQ29yZSA9IGZvbGxvd2luZ1BhdGguaW5zaWRlQ29yZTtcclxuXHJcbiAgICAgIC8vIEV4dHJhIHBhdGggd2lsbCBoYXZlIGNyb3NzZWQgb3ZlciB0aGUgY29yZSBwYXRoIGRvIHJvdCBkaXIgaXMgbm93IG9wcG9zaXRlLlxyXG4gICAgICB0aGlzLnJvdERpclRvQ29yZVBhdGggPSAtZm9sbG93aW5nUGF0aC5yb3REaXJUb0NvcmVQYXRoO1xyXG4gICAgICBjb25zdCBwcmV2Q3RybFB0MiA9IGZvbGxvd2luZ1BhdGguY3RybFB0MjtcclxuICAgICAgY3RybFB0MSA9IHRoaXMuX2dldENvbnRpbnVpbmdDdHJsUHQxKHByZXZDdHJsUHQyLCBzZWdTdGFydCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3RoZXJ3aXNlLCBzdGFydCBuZXcgZXh0cmEgcGF0aHMsIHNsaWdodGx5IGVpdGhlciBzaWRlIG9mIGNvcmUgcGF0aC5cclxuICAgIGVsc2Uge1xyXG4gICAgICAvLyBFeHRyYVBhdGhJZCAwIGFsd2F5cyBnb2VzIGFudGljbG9ja3dpc2Ugb2YgY29yZSBwYXRoLCBFeHRyYVBhdGhJZCAxIFxyXG4gICAgICAvLyBhbHdheXMgc3RhcnRzIGNsb2Nrd2lzZS5cclxuICAgICAgdGhpcy5yb3REaXJUb0NvcmVQYXRoID0gKHRoaXMuI2V4dHJhUGF0aElkID09PSAxKSA/IDEgOiAtMTtcclxuXHJcbiAgICAgIC8vIFRydWUgaWYgdGhpcyBleHRyYSBwYXRoIGlzIGN1dHRpbmcgaW5zaWRlIHRoZSBjb3JlIHBhdGggYXMgdGhlIGNvcmUgXHJcbiAgICAgIC8vIHBhdGggY3VydmVzIG91dC5cclxuICAgICAgY29uc3QgaW5zaWRlQ29yZSA9IHNlZ0NvcmVQYXRoLnJvdERpclRvU2VnVmVjdCAhPT0gdGhpcy5yb3REaXJUb0NvcmVQYXRoO1xyXG4gICAgICB0aGlzLmluc2lkZUNvcmUgPSBpbnNpZGVDb3JlO1xyXG5cclxuICAgICAgY29uc3QgcmFuZExpbXMgPSBpbnNpZGVDb3JlID8gRXh0cmFQYXRoLiNSQU5EX0lOU0lERV9WRUNUX0xJTVMgOiBFeHRyYVBhdGguI1JBTkRfT1VUU0lERV9WRUNUX0xJTVM7XHJcbiAgICAgIGNvbnN0IHRoaXNDb3JlU3RhcnRWZWN0ID0gc2VnU3RhcnQudmVjdG9yVG8oc2VnQ29yZVBhdGguY3RybFB0MSkuZ2V0VW5pdFZlY3RvcigpO1xyXG5cclxuICAgICAgY29uc3QgdHJhbnNsYXRlVmVjdCA9IHRoaXMuX2dldFJhbmRWZWN0KHRoaXMucm90RGlyVG9Db3JlUGF0aCwgXHJcbiAgICAgICAgdGhpc0NvcmVTdGFydFZlY3QsIHNlZ1ZlY3RNYWcsIHJhbmRMaW1zKTtcclxuXHJcbiAgICAgIGN0cmxQdDEgPSBzZWdTdGFydC5hZGRWZWN0b3IodHJhbnNsYXRlVmVjdCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBjdHJsUHQxO1xyXG4gIH1cclxuXHJcbiAgLy8gR2VuZXJhdGUgYSByYW5kb20gdmVjdG9yIGJhY2sgZnJvbSB0aGUgc2VnIGVuZCwgb24gdGhlIHNhbWUgc2lkZSByZWxhdGl2ZSBcclxuICAvLyB0byB0aGUgY29yZSBwYXRoLiBJZiB0aGUgbmV4dCBzZWdtZW50IGhhcyBleHRyYSBwYXRocyB0aGVuIGdpdmUgaXQgYSBnb29kIFxyXG4gIC8vIGNoYW5jZSBvZiByZWpvaW5pbmcgdGhlIGNvcmUgcGF0aCBhdCBhIHJvdWdobHkgcGVycGVuZGljdWxhciBhbmdsZSBzbyB0aGlzIFxyXG4gIC8vIGxpbmUgY2FuIGJlIGNvbnRpbnVlZCBvbiBpbiB0aGUgbmV4dCBzZWdtZW50IGZvciBhbiBpbnRlcmVzdGluZyBwYXR0ZXJOLlxyXG4gICNnZXRDdHJsUHQyKHNlZ0VuZCwgbmV4dFNlZywgc2VnVmVjdE1hZywgc2VnQ29yZVBhdGgsIGJvdGhFeHRyYVBhdGhzRW5kUGVycCkge1xyXG4gICAgbGV0IGN0cmxQdDI7XHJcblxyXG4gICAgY29uc3QgdGhpc0NvcmVFbmRWZWN0ID0gc2VnRW5kLnZlY3RvclRvKHNlZ0NvcmVQYXRoLmN0cmxQdDIpLmdldFVuaXRWZWN0b3IoKTtcclxuXHJcbiAgICBsZXQgcmFuZExpbXMgPSB0aGlzLmluc2lkZUNvcmUgPyBFeHRyYVBhdGguI1JBTkRfSU5TSURFX1ZFQ1RfTElNUyA6IEV4dHJhUGF0aC4jUkFORF9PVVRTSURFX1ZFQ1RfTElNUztcclxuXHJcbiAgICBjb25zdCBwZXJwUmVqb2luID0gdGhpcy4jZ2V0SXNQZXJwUmVqb2luKG5leHRTZWcsIGJvdGhFeHRyYVBhdGhzRW5kUGVycCk7XHJcblxyXG4gICAgaWYgKHBlcnBSZWpvaW4pIHtcclxuICAgICAgcmFuZExpbXMgPSBFeHRyYVBhdGguI1JBTkRfUEVSUF9WRUNUX0xJTVM7XHJcbiAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgY29uc3QgdHJhbnNsYXRlVmVjdCA9IHRoaXMuX2dldFJhbmRWZWN0KC10aGlzLnJvdERpclRvQ29yZVBhdGgsIFxyXG4gICAgICB0aGlzQ29yZUVuZFZlY3QsIHNlZ1ZlY3RNYWcsIHJhbmRMaW1zKTtcclxuXHJcbiAgICBjdHJsUHQyID0gc2VnRW5kLmFkZFZlY3Rvcih0cmFuc2xhdGVWZWN0KTtcclxuICAgIHJldHVybiBjdHJsUHQyO1xyXG4gIH1cclxuXHJcbiAgLy8gRm9yIGdldHRpbmcgdGhlIDJuZCBjb250cm9sIHBvaW50LCB3b3JrcyBvdXQgaWYgdGhpcyBleHRyYSBwYXRoIHNob3VsZCBcclxuICAvLyByZWpvaW4gYXQgcGVycGVuZGljdWxhciB0byBjb3JlIHBhdGguXHJcbiAgI2dldElzUGVycFJlam9pbihuZXh0U2VnLCBib3RoRXh0cmFQYXRoc0VuZFBlcnApIHtcclxuICAgIGxldCBwcm9iUGVycFJlam9pbiA9IDA7XHJcbiAgICAvLyBEb24ndCByZWpvaW4gYXQgcGVycCBpZiBuZXh0IHNlZyBoYXMgbm8gcGF0dGVybi5cclxuICAgIGlmIChuZXh0U2VnPy5oYXNQYXR0ZXJuKSB7XHJcbiAgICAgIC8vIElmIHNlZ21lbnQgZGVjaWRlZCAoUk5HKSB0aGF0IGJvdGggZXh0cmEgcGF0aHMgc2hvdWxkIHJlam9pbiBwZXJwIChmb3IgXHJcbiAgICAgIC8vIGxlYWYgc2hhcGUpIHRoZW4gbWFrZSBjZXJ0YWluLlxyXG4gICAgICBpZiAoYm90aEV4dHJhUGF0aHNFbmRQZXJwKSB7XHJcbiAgICAgICAgcHJvYlBlcnBSZWpvaW4gPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIE90aGVyd2lzZSBnaXZlIGhpZ2ggcHJvYmFiaWxpdHkgdG8gaW5zaWRlIGNvcmUgcGF0aCBhbmQgbG93IChjdXJyZW50bHkgXHJcbiAgICAgIC8vIG5vKSBwcm9iYWJpbGl0eSB0byBvdXRzaWRlIGNvcmUgcGF0aCkuXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIFRoaXMgcHJvYmFiaWxpdHkgY3VycmVudGx5IHNldCB0byAxIGJ1dCBtaWdodCBkZWNyZWFzZSBzbGlnaHRseSBsYXRlciwgXHJcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgb2RkcyBvZiBpbnNpZGUgcGF0aCByZWpvaW5pbmcgcGVycGVuZGljdWxhciB0byBjb3JlLCBpZiBcclxuICAgICAgICAvLyBpdCdzIGdpdmVuIHRoYXQgYm90aCBleHRyYSBwYXRocyBkb250IHJlam9pbiBwZXJwLlxyXG4gICAgICAgIGlmICh0aGlzLmluc2lkZUNvcmUpIHtcclxuICAgICAgICAgIHByb2JQZXJwUmVqb2luID0gRXh0cmFQYXRoLiNQUk9CX0lOU0lERV9QRVJQX1JFSk9JTjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRXh0cmEgcGF0aCB0aGF0IGlzIG91dHNpZGUgb2YgdGhlIGNvcmUgaXMgbmV2ZXIgcGVycGVuZGljdWxhciBhbG9uZSwgbG9va3Mgd2VpcmQuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBwcm9iUGVycFJlam9pbiA9IDA7XHJcbiAgICAgICAgfTtcclxuICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRlc3RSYW5kb20ocHJvYlBlcnBSZWpvaW4pO1xyXG4gIH1cclxufSIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiLi4vLi4vdmVjdG9yMi5tanNcIjtcclxuaW1wb3J0IHsgU2luZ2xlQ29ubmVjdGlvbiB9IGZyb20gXCIuL3NpbmdsZUNvbm5lY3Rpb24ubWpzXCI7XHJcblxyXG5cclxuXHJcbi8vIFNWRyBpbWFnZSBvZiBjb25uZWN0aW9ucyBiZXR3ZWVuIERPTSBub2RlcyBpbiBhcnRpc3RpYyBjdXJ2ZSBzdHlsZSwgaW5jbHVkZXMgXHJcbi8vIGRyYXdpbmcgYW5pbWF0aW9uLlxyXG4vLyBkYXRhLWNvbm5lY3RzLXRvIHNob3VsZCBhbHdheXMgYmUgd3JpdHRlbiBvbiB0aGUgZWxlbWVudCB0aGF0IHRoZSBjb25uZWN0aW9uIFxyXG4vLyBzaG91bGQgc3RhcnQgZnJvbSAoZm9yIGFuaW1hdGVkIGRyYXdpbmcgcHVycG9zZXMpLlxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvbnNTdmcge1xyXG4gICNlbGVtc1RvSm9pbjtcclxuICAjY29ubmVjdGlvbnMgPSBbXTtcclxuICAjZHJhd09yaWdpbklkO1xyXG5cclxuICBjb25zdHJ1Y3RvcihlbGVtc1RvSm9pbikge1xyXG4gICAgdGhpcy4jZWxlbXNUb0pvaW4gPSBlbGVtc1RvSm9pbjtcclxuICB9XHJcblxyXG4gIC8vIENyZWF0ZSB0aGUgU1ZHIGFuZCBhbmltYXRlIGRyYXdpbmcgdGhlIGxpbmVzIGluLlxyXG4gIGNyZWF0ZUFuZERyYXcoKSB7XHJcbiAgICB0aGlzLiNjcmVhdGVTdmcodGhpcy4jZWxlbXNUb0pvaW4pO1xyXG4gICAgdGhpcy4jc3RhcnREcmF3aW5nKCk7XHJcbiAgfVxyXG5cclxuICAvLyBIaWRlIGFsbCB0aGUgcGF0aHMsIGFkZCBldmVudCBsaXN0ZW5lcnMgZm9yIHdoZW4gYSBjb25uZWN0aW9uIGhhcyBmaW5pc2hlZCBcclxuICAvLyBkcmF3aW5nIHRvIHN0YXJ0IGRyYXdpbmcgc3Vic2VxdWVudCBvbmVzIGFuZCBzdGFydCBkcmF3aW5nIGZyb20gdGhlIG9yaWdpbiBlbGVtZW50LlxyXG4gICNzdGFydERyYXdpbmcoKSB7XHJcbiAgICB0aGlzLiNjb25uZWN0aW9ucy5mb3JFYWNoKGNvbm5lY3Rpb24gPT4ge1xyXG4gICAgICBjb25uZWN0aW9uLmhpZGVQYXRocygpO1xyXG4gICAgICBjb25uZWN0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjb25uZWN0aW9uRHJhd25cIiwgZXZ0ID0+IHtcclxuICAgICAgICB0aGlzLiNkcmF3KGV2dC5kZXRhaWwuZW5kSWQpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuI2RyYXcodGhpcy4jZHJhd09yaWdpbklkKTtcclxuICB9XHJcblxyXG4gIC8vIERyYXdzIGFsbCB0aGUgY29ubmVjdGlvbnMgdGhhdCBzdGFydCBmcm9tIGEgZ2l2ZW4gZWxlbWVuZCBpZC5cclxuICAvLyBqdXN0Q29ubmVjdGVkSWQgaXMgdGhlIGVsZW1lbnQgSWQgKGZyb20gdGhlIGRhdGEgYXR0cmlidXRlKSBvZiB0aGUgZWxlbWVudCBcclxuICAvLyB0aGF0IGhhcyBqdXN0IGZpbmlzaGVkIGhhdmluZyBhIGNvbm5lY3Rpb24gZHJhd24gdG8gaXQuXHJcbiAgI2RyYXcoanVzdENvbm5lY3RlZElkKSB7XHJcbiAgICB0aGlzLiNjb25uZWN0aW9ucy5mb3JFYWNoKGNvbm5lY3Rpb24gPT4ge1xyXG4gICAgICBpZiAoY29ubmVjdGlvbi5zdGFydElkID09PSBqdXN0Q29ubmVjdGVkSWQpIHtcclxuICAgICAgICBjb25uZWN0aW9uLmRyYXcoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gQ3JlYXRlIHRoZSBTVkcgZG9tIGVsZW1lbnQgd2l0aCBhbGwgY29ubmVjdGlvbnMsIHNlZ21lbnRzIGFuZCBwYXRocy5cclxuICAjY3JlYXRlU3ZnKGVsZW1zKSB7XHJcbiAgICBjb25zdCBwYXJlbnRFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdmctY29ubmVjdHMtd3JhcHBlclwiKTtcclxuICAgIGNvbnN0IHBhcmVudEVsZW1SZWN0ID0gcGFyZW50RWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBjb25zdCBvcmlnaW5FbGVtID0gcGFyZW50RWxlbS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1kcmF3LW9yaWdpbj1cInRydWVcIicpO1xyXG4gICAgdGhpcy4jZHJhd09yaWdpbklkID0gb3JpZ2luRWxlbS5kYXRhc2V0LmNvbm5lY3RJZDtcclxuICAgIFxyXG4gICAgY29uc3QgcGFyZW50T2Zmc2V0ID0gbmV3IFZlY3RvcjIocGFyZW50RWxlbVJlY3QubGVmdCwgcGFyZW50RWxlbVJlY3QudG9wKTtcclxuICBcclxuICAgIGNvbnN0IHZpZXdCb3hXaWR0aCA9IHBhcmVudEVsZW1SZWN0LndpZHRoO1xyXG4gICAgY29uc3Qgdmlld0JveEhlaWdodCA9IHBhcmVudEVsZW1SZWN0LmhlaWdodDtcclxuICBcclxuICAgIGNvbnN0IGNvbm5lY3RFbGVtRGV0YWlscyA9IHRoaXMuI2dldENvbm5lY3RFbGVtRGV0YWlscyhlbGVtcywgcGFyZW50T2Zmc2V0KTtcclxuICAgIGNvbnN0IGNvbm5lY3Rpb25JbmZvcyA9IHRoaXMuI2dldENvbm5lY3Rpb25JbmZvcyhjb25uZWN0RWxlbURldGFpbHMpO1xyXG4gIFxyXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIik7XHJcbiAgXHJcbiAgICBzdmcuY2xhc3NMaXN0LmFkZChcImNvbm5lY3Rpb25zLXN2Z1wiKTtcclxuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIGAwIDAgJHt2aWV3Qm94V2lkdGh9ICR7dmlld0JveEhlaWdodH1gKTtcclxuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ4bWxuc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpO1xyXG4gICAgc3ZnLnNldEF0dHJpYnV0ZShcInByZXNlcnZlQXNwZWN0UmF0aW9cIiwgXCJub25lXCIpO1xyXG4gICAgc3ZnLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcIlwiKTtcclxuICAgIFxyXG4gICAgdGhpcy4jY3JlYXRlQ29ubmVjdGlvbnMoY29ubmVjdGlvbkluZm9zKTtcclxuICAgIHRoaXMuI2NyZWF0ZVN2Z1BhdGhzKHN2Zyk7XHJcblxyXG4gICAgcGFyZW50RWxlbS5hcHBlbmRDaGlsZChzdmcpO1xyXG4gICAgcmV0dXJuIHN2ZztcclxuICB9XHJcblxyXG4gIC8vIEdldCBhbGwgdGhlIHBhdGhzIGZyb20gZWFjaCBjb25uZWN0aW9uIG9mIHRoZSBTVkcuXHJcbiAgI2NyZWF0ZVN2Z1BhdGhzKHN2Zykge1xyXG4gICAgdGhpcy4jY29ubmVjdGlvbnMuZm9yRWFjaChjb25uZWN0aW9uID0+IHtcclxuICAgICAgc3ZnLmFwcGVuZCguLi5jb25uZWN0aW9uLnBhdGhFbGVtcyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIENyZWF0ZSBhIGNvbm5lY3Rpb25zIG9iamVjdCBmb3IgZWFjaCBjb29yZHMgcGFpciBhbmQgYWRkIHNldCB0aGUgcGF0aHMgZm9yIFxyXG4gIC8vIGVhY2ggY29ubmVjdGlvbi5cclxuICAjY3JlYXRlQ29ubmVjdGlvbnMoY29ubmVjdGlvbkluZm9zKSB7XHJcbiAgICBjb25uZWN0aW9uSW5mb3MuZm9yRWFjaChjb25uZWN0aW9uSW5mbyA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgU2luZ2xlQ29ubmVjdGlvbihjb25uZWN0aW9uSW5mbyk7XHJcbiAgICAgIGNvbm5lY3Rpb24uY3JlYXRlUGF0aHMoKTtcclxuICAgICAgdGhpcy4jY29ubmVjdGlvbnMucHVzaChjb25uZWN0aW9uKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IGRldGFpbHMgb24gZWFjaCBjb25uZWN0aW9uIHRvIGJlIGRyYXduLlxyXG4gICNnZXRDb25uZWN0aW9uSW5mb3MoZWxlbXNDb25uZWN0SW5mb3MpIHtcclxuICAgIGNvbnN0IGNvbm5lY3Rpb25JbmZvcyA9IFtdO1xyXG5cclxuICAgIGVsZW1zQ29ubmVjdEluZm9zLmZvckVhY2goZWxlbSA9PiB7XHJcbiAgICAgIGVsZW0/LmNvbm5lY3RzVG8/LmZvckVhY2goY29ubmVjdGlvbiA9PiB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRDb29yZHMgPSBlbGVtLnBvc247XHJcbiAgICAgICAgY29uc3QgZW5kQ29ubmVjdEVsZW0gPSBlbGVtc0Nvbm5lY3RJbmZvcy5maW5kKGVsZW0gPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGVsZW0uZWxlbUlkID09PSBjb25uZWN0aW9uO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBlbmRDb29yZHMgPSBlbmRDb25uZWN0RWxlbS5wb3NuO1xyXG4gICAgICAgIGNvbnN0IGNvbm5lY3RDb29yZHMgPSBbc3RhcnRDb29yZHMsIGVuZENvb3Jkc107XHJcbiAgICAgICAgY29uc3QgZWxlbUlkcyA9IFtlbGVtLmVsZW1JZCwgY29ubmVjdGlvbl07XHJcbiAgICAgICAgY29uc3QgY29ubmVjdGlvbkluZm8gPSB7Y29vcmRzOiBjb25uZWN0Q29vcmRzLCBlbGVtSWRzOiBlbGVtSWRzfTtcclxuXHJcbiAgICAgICAgY29ubmVjdGlvbkluZm9zLnB1c2goY29ubmVjdGlvbkluZm8pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBjb25uZWN0aW9uSW5mb3M7XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgY29ubmVjdGlvbiBkZXRhaWxzIGZvciBlYWNoIGVsZW1lbnQgdG8gYmUgY29ubmVjdGVkLlxyXG4gICNnZXRDb25uZWN0RWxlbURldGFpbHMoZWxlbXMsIHBhcmVudE9mZnNldCkge1xyXG4gICAgY29uc3QgZWxlbXNDb25uZWN0SW5mb3MgPSBbXTtcclxuICAgIFxyXG4gICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcclxuICAgICAgY29uc3QgY29ubmVjdEluZm8gPSB7fTtcclxuXHJcbiAgICAgIGNvbnN0IHRoaXNFbGVtUmVjdCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGNvbnN0IGFmdGVyRWxlbVN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW0sICc6YWZ0ZXInKTtcclxuICAgICAgY29uc3QgY29ubmVjdFBzbiA9IHRoaXMuI2dldENvbm5lY3RQc24odGhpc0VsZW1SZWN0LCBhZnRlckVsZW1TdHlsZXMsIHBhcmVudE9mZnNldCk7XHJcblxyXG4gICAgICBjb25zdCBlbGVtQ29ubmVjdElkID0gZWxlbS5kYXRhc2V0LmNvbm5lY3RJZDtcclxuICAgICAgY29ubmVjdEluZm8uZWxlbUlkID0gZWxlbUNvbm5lY3RJZDtcclxuICAgICAgY29ubmVjdEluZm8ucG9zbiA9IGNvbm5lY3RQc247XHJcbiAgICAgIGNvbm5lY3RJbmZvLmNvbm5lY3RzVG8gPSBlbGVtLmRhdGFzZXQ/LmNvbm5lY3RzVG8/LnNwbGl0KFwiLFwiKTtcclxuICBcclxuICAgICAgZWxlbXNDb25uZWN0SW5mb3MucHVzaChjb25uZWN0SW5mbyk7XHJcbiAgICB9KTtcclxuICBcclxuICAgIHJldHVybiBlbGVtc0Nvbm5lY3RJbmZvcztcclxuICB9XHJcblxyXG4gIC8vIEdldCBjb25uZWN0IHBvc2l0aW9uIGNvb3JkaW5hdGVzIGZvciBhbiBlbGVtZW50LlxyXG4gICNnZXRDb25uZWN0UHNuKGVsZW1SZWN0LCBhZnRlckVsZW1TdHlsZXMsIHBhcmVudE9mZnNldCkge1xyXG4gICAgY29uc3QgeENvb3JkID0gZWxlbVJlY3QubGVmdCAtIHBhcmVudE9mZnNldC54ICsgcGFyc2VJbnQoYWZ0ZXJFbGVtU3R5bGVzLmxlZnQsIDEwKTtcclxuICAgIGNvbnN0IHlDb29yZCA9IGVsZW1SZWN0LnRvcCAtIHBhcmVudE9mZnNldC55ICsgcGFyc2VJbnQoYWZ0ZXJFbGVtU3R5bGVzLnRvcCwgMTApO1xyXG4gICAgY29uc3QgY29ubmVjdENvb3JkcyA9IG5ldyBWZWN0b3IyKHhDb29yZCwgeUNvb3JkKTtcclxuICBcclxuICAgIHJldHVybiBjb25uZWN0Q29vcmRzO1xyXG4gIH1cclxufSIsImltcG9ydCB7IHRlc3RSYW5kb20gfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2hhcmVkSnMvdXRpbHMubWpzXCI7XHJcbmltcG9ydCB7IENvcmVQYXRoIH0gZnJvbSBcIi4vY29ubmVjdFN1YlBhdGgvc3ViQ2xhc3Nlcy9jb3JlUGF0aC5tanNcIjtcclxuaW1wb3J0IHsgRXh0cmFQYXRoIH0gZnJvbSBcIi4vY29ubmVjdFN1YlBhdGgvc3ViQ2xhc3Nlcy9leHRyYVBhdGgubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWdtZW50IHtcclxuICAjaWR4O1xyXG4gICNzdGFydDtcclxuICAjZW5kO1xyXG4gICNtYWluVmVjdDtcclxuICAjbWFpblVuaXRWZWN0O1xyXG4gICN2ZWN0TWFnO1xyXG4gIGV4dHJhUGF0aHNCb3RoRW5kc1BlcnAgPSBmYWxzZTtcclxuICBoYXNQYXR0ZXJuO1xyXG4gIGNvcmVQYXRoO1xyXG4gIGV4dHJhUGF0aHMgPSBbXTtcclxuICBhbGxQYXRocyA9IFtdO1xyXG5cclxuICBzdGF0aWMgI1BST0JfQk9USF9FWFRSQV9FTkRfUEVSUCA9IDAuNDtcclxuXHJcbiAgY29uc3RydWN0b3IoaWR4LCBoYXNQYXR0ZXJuLCBzdGFydCwgZW5kKSB7XHJcbiAgICB0aGlzLiNpZHggPSBpZHg7XHJcbiAgICB0aGlzLmhhc1BhdHRlcm4gPSBoYXNQYXR0ZXJuO1xyXG4gICAgdGhpcy4jc3RhcnQgPSBzdGFydDtcclxuICAgIHRoaXMuI2VuZCA9IGVuZDtcclxuICAgIHRoaXMuI21haW5WZWN0ID0gdGhpcy4jc3RhcnQudmVjdG9yVG8odGhpcy4jZW5kKTtcclxuICAgIHRoaXMuI21haW5Vbml0VmVjdCA9IHRoaXMuI21haW5WZWN0LmdldFVuaXRWZWN0b3IoKTtcclxuICAgIHRoaXMuI3ZlY3RNYWcgPSB0aGlzLiNtYWluVmVjdC5nZXRNYWcoKTtcclxuICB9XHJcblxyXG4gIC8vIFBvcHVsYXRlIHRoZSBjb3JlUGF0aEN0cmxQdHMgZm9yIHRoaXMgc2VnbWVudC5cclxuICBzZXRDb3JlUGF0aChwcmV2U2VnKSB7XHJcbiAgICB0aGlzLmNvcmVQYXRoID0gbmV3IENvcmVQYXRoKHRoaXMuI3N0YXJ0LCB0aGlzLiNlbmQsIHRoaXMuI2lkeCk7XHJcblxyXG4gICAgdGhpcy5jb3JlUGF0aC5nZXRDdHJsUHRzKHRoaXMuI2lkeCwgdGhpcy4jdmVjdE1hZywgdGhpcy4jc3RhcnQsIHRoaXMuI2VuZCwgXHJcbiAgICAgIHRoaXMuI21haW5Vbml0VmVjdCwgcHJldlNlZyk7XHJcbiAgfVxyXG5cclxuICAvLyBQb3B1bGF0ZSB0aGUgY3RybFB0cyBmb3IgdGhlIGV4dHJhIHBhdGhzIGZvciB0aGlzIHNlZ21lbnQsIGlmIGl0IGhhcyBhbnkuXHJcbiAgc2V0RXh0cmFQYXRocyhwcmV2U2VnLCBuZXh0U2VnKSB7XHJcbiAgICBpZiAoIXRoaXMuaGFzUGF0dGVybikgcmV0dXJuO1xyXG5cclxuICAgIC8vIERvbnQgYWxsb3cgYSBzZWdtZW50IHRvIGhhdmUgYm90aCBlbmRzIGJlIHBlcnBlbmRpY3VsYXIgZm9yIGJvdGggZXh0cmEgXHJcbiAgICAvLyBwYXRocyBvciBsb29rcyBsaWtlIGZhdCBidWJibGUuXHJcbiAgICBjb25zdCBwcmV2U2VnQm90aEVuZHNQZXJwID0gcHJldlNlZz8uZXh0cmFQYXRoc0JvdGhFbmRzUGVycDtcclxuICAgIHRoaXMuZXh0cmFQYXRoc0JvdGhFbmRzUGVycCA9IHByZXZTZWdCb3RoRW5kc1BlcnAgPyBmYWxzZSBcclxuICAgICAgOiB0ZXN0UmFuZG9tKFNlZ21lbnQuI1BST0JfQk9USF9FWFRSQV9FTkRfUEVSUCk7XHJcblxyXG4gICAgZm9yIChsZXQgZXh0cmFQYXRoTnVtID0gMDsgZXh0cmFQYXRoTnVtIDwgMjsgZXh0cmFQYXRoTnVtKyspIHtcclxuXHJcbiAgICAgIHRoaXMuZXh0cmFQYXRoc1tleHRyYVBhdGhOdW1dID0gbmV3IEV4dHJhUGF0aCh0aGlzLiNzdGFydCwgdGhpcy4jZW5kLCBcclxuICAgICAgICB0aGlzLiNpZHgsIGV4dHJhUGF0aE51bSk7XHJcblxyXG4gICAgICB0aGlzLmV4dHJhUGF0aHNbZXh0cmFQYXRoTnVtXS5nZXRDdHJsUHRzKHRoaXMuI3ZlY3RNYWcsIHRoaXMuI3N0YXJ0LCBcclxuICAgICAgICB0aGlzLiNlbmQsIHByZXZTZWcsIG5leHRTZWcsIHRoaXMuY29yZVBhdGgsIHRoaXMuZXh0cmFQYXRoc0JvdGhFbmRzUGVycCk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHRoaXMgYWxsUGF0aHMgbm93IGFsbCB0aGUgcGF0aHMgYXJlIGtub3duLlxyXG4gIHNldEFsbFBhdGhzKCkge1xyXG4gICAgdGhpcy5hbGxQYXRocy5wdXNoKHRoaXMuY29yZVBhdGgpO1xyXG4gICAgdGhpcy5hbGxQYXRocy5wdXNoKC4uLnRoaXMuZXh0cmFQYXRocyk7XHJcbiAgfVxyXG5cclxuICBzZXRQYXRoRFZhbHMoKSB7XHJcbiAgICB0aGlzLmFsbFBhdGhzLmZvckVhY2gocGF0aCA9PiB7XHJcbiAgICAgIHBhdGguc2V0RFZhbCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQYXRoRWxlbXMoKSB7XHJcbiAgICBjb25zdCBzZWdQYXRocyA9IFtdO1xyXG5cclxuICAgIHRoaXMuYWxsUGF0aHMuZm9yRWFjaChwYXRoID0+IHtcclxuICAgICAgc2VnUGF0aHMucHVzaChwYXRoLmNyZWF0ZVBhdGhFbGVtKCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHNlZ1BhdGhzO1xyXG4gIH1cclxufSIsImltcG9ydCB7IHJhbmRCZXR3ZWVuLCB0ZXN0UmFuZG9tIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NoYXJlZEpzL3V0aWxzLm1qc1wiO1xyXG5pbXBvcnQgeyBkcmF3U2ltdWxQYXRocyB9IGZyb20gXCIuLi9kcmF3QW5pbVN2Z3MuanNcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuLi8uLi92ZWN0b3IyLm1qc1wiO1xyXG5pbXBvcnQgeyBTZWdtZW50IH0gZnJvbSBcIi4vc2VnbWVudC5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNpbmdsZUNvbm5lY3Rpb24gZXh0ZW5kcyBFdmVudFRhcmdldCB7XHJcbiAgc3RhcnRJZDtcclxuICAjZW5kSWQ7XHJcbiAgcGF0aEVsZW1zID0gW107XHJcbiAgI3N0YXJ0Q29vcmRzO1xyXG4gICNlbmRDb29yZHM7XHJcbiAgI21haW5WZWN0O1xyXG4gICN0b3RhbEQ7XHJcbiAgI2F2Z1NlZ1ZlY3Q7XHJcbiAgI3BlcnBVbml0VmVjdDtcclxuICAjbnVtU2VnbWVudHM7XHJcbiAgI3Byb2JTZWdQYXR0ZXJuO1xyXG4gICNibG9ja3NpemVEZWNyZWFzZVByb2I7XHJcbiAgI3N0YW5kYXJkU2VnTGVuO1xyXG4gICNzZWdtZW50cztcclxuICAjc3RhcnRlZERyYXdpbmcgPSBmYWxzZTtcclxuXHJcbiAgLy8gU3RhbmRhcmQgc2l6ZSBvZiBzZWdtZW50IChiZWZvcmUgcmFuZG9taXNpbmcpIGFzIHBlcmNlbnRhZ2Ugb2Ygdmlld3BvcnQgd2lkdGgpLlxyXG4gIHN0YXRpYyAjU1RBTkRBUkRfU0VHX0xFTl9SQVRJTyA9IDk7XHJcbiAgc3RhdGljICNDT01NT05fUFRTX01BSU5fUkFORCA9IDAuMDI7XHJcbiAgc3RhdGljICNDT01NT05fUFRTX1BFUlBfUkFORCA9IDAuMDE7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNvbm5lY3Rpb25JbmZvKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuc3RhcnRJZCA9IGNvbm5lY3Rpb25JbmZvLmVsZW1JZHNbMF07XHJcbiAgICB0aGlzLiNlbmRJZCA9IGNvbm5lY3Rpb25JbmZvLmVsZW1JZHNbMV07XHJcbiAgICB0aGlzLiNzdGFydENvb3JkcyA9IGNvbm5lY3Rpb25JbmZvLmNvb3Jkc1swXTtcclxuICAgIHRoaXMuI2VuZENvb3JkcyA9IGNvbm5lY3Rpb25JbmZvLmNvb3Jkc1sxXTtcclxuXHJcbiAgICB0aGlzLiNtYWluVmVjdCA9IHRoaXMuI3N0YXJ0Q29vcmRzLnZlY3RvclRvKHRoaXMuI2VuZENvb3Jkcyk7XHJcbiAgICB0aGlzLiN0b3RhbEQgPSB0aGlzLiNtYWluVmVjdC5nZXRNYWcoKTtcclxuXHJcbiAgICBjb25zdCBhdmdXaW5kb3dTaWRlTGVuID0gKHdpbmRvdy5pbm5lcldpZHRoICsgd2luZG93LmlubmVySGVpZ2h0KSAvIDI7XHJcbiAgICB0aGlzLiNzdGFuZGFyZFNlZ0xlbiA9IChTaW5nbGVDb25uZWN0aW9uLiNTVEFOREFSRF9TRUdfTEVOX1JBVElPIC8gMTAwKSBcclxuICAgICAgKiBhdmdXaW5kb3dTaWRlTGVuO1xyXG5cclxuICAgIHRoaXMuI251bVNlZ21lbnRzID0gTWF0aC5yb3VuZCh0aGlzLiN0b3RhbEQgLyB0aGlzLiNzdGFuZGFyZFNlZ0xlbik7XHJcbiAgICB0aGlzLiNwcm9iU2VnUGF0dGVybiA9IDAuNDtcclxuICAgIHRoaXMuI2Jsb2Nrc2l6ZURlY3JlYXNlUHJvYiA9IDAuOTtcclxuXHJcbiAgICBjb25zdCBhdmdTZWdWZWN0WCA9IHRoaXMuI21haW5WZWN0LnggLyB0aGlzLiNudW1TZWdtZW50cztcclxuICAgIGNvbnN0IGF2Z1NlZ1ZlY3RZID0gdGhpcy4jbWFpblZlY3QueSAvIHRoaXMuI251bVNlZ21lbnRzO1xyXG4gICAgdGhpcy4jYXZnU2VnVmVjdCA9IG5ldyBWZWN0b3IyKGF2Z1NlZ1ZlY3RYLCBhdmdTZWdWZWN0WSk7XHJcblxyXG4gICAgY29uc3QgcGVycFZlY3QgPSB0aGlzLiNtYWluVmVjdC5nZXRSb3RhdGVkVmVjdG9yKE1hdGguUEkgLyAyKTtcclxuICAgIHRoaXMuI3BlcnBVbml0VmVjdCA9IHBlcnBWZWN0LmdldFVuaXRWZWN0b3IoKTtcclxuICB9XHJcblxyXG4gIC8vIERyYXdzIGFsbCB0aGUgcGF0aHMgb2YgZWFjaCBzZWdtZW50LCBpbiBvcmRlciBhbmQgZW1pdHMgZXZlbnQgd2hlbiBhbGwgXHJcbiAgLy8gcGF0aHMgb2YgYWxsIHNlZ21lbnRzIGhhdmUgYmVlbiBkcmF3bi5cclxuICBhc3luYyBkcmF3KCkge1xyXG4gICAgaWYgKHRoaXMuI3N0YXJ0ZWREcmF3aW5nKSByZXR1cm47XHJcbiAgICB0aGlzLiNzdGFydGVkRHJhd2luZyA9IHRydWU7XHJcblxyXG4gICAgZm9yIChsZXQgc2VnIG9mIHRoaXMuI3NlZ21lbnRzKSB7XHJcbiAgICAgIGNvbnN0IHNlZ1BhdGhzID0gc2VnLmFsbFBhdGhzLm1hcChwYXRoT2JqID0+IHBhdGhPYmoucGF0aEVsZW0pO1xyXG4gICAgICBhd2FpdCBkcmF3U2ltdWxQYXRocyhzZWdQYXRocyk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoXHJcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImNvbm5lY3Rpb25EcmF3blwiLCB7ZGV0YWlsOiB7ZW5kSWQ6IHRoaXMuI2VuZElkfX0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gSGlkZSBhbGwgcGF0aHMsIHVzZWQgYXQgc3RhcnQgb2YgZHJhd2luZyBhbmltYXRpb24gZm9yIHN2Zy5cclxuICBoaWRlUGF0aHMoKSB7XHJcbiAgICB0aGlzLnBhdGhFbGVtcy5mb3JFYWNoKHBhdGggPT4ge1xyXG4gICAgICBwYXRoLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFByb2NlZHVyYWxseSBidWlsZHMgY29ubmVjdGlvbiBvZiBzdmcgcGF0aCBjdXJ2ZXMgYmV0d2VlbiB0d28gcG9pbnRzLlxyXG4gIGNyZWF0ZVBhdGhzKCkge1xyXG4gICAgY29uc3QgY29tbW9uUHRzID0gdGhpcy4jZ2V0Q29tbW9uUHRzKCk7XHJcbiAgICBjb25zdCBzZWdQYXR0ZXJuTWFwID0gdGhpcy4jYnVpbGRTZWdQYXR0ZXJuTWFwKCk7XHJcbiAgICB0aGlzLiNzZWdtZW50cyA9IHRoaXMuI2dldFNlZ0RldGFpbHMoc2VnUGF0dGVybk1hcCwgY29tbW9uUHRzKTtcclxuICAgIHRoaXMuI3NldFBhdGhzQW5kRFZhbHModGhpcy4jc2VnbWVudHMpO1xyXG4gICAgdGhpcy4jY3JlYXRlUGF0aEVsZW1zKHRoaXMuI3NlZ21lbnRzKTtcclxuICB9XHJcblxyXG4gIC8vIENyZWF0ZXMgYWxsIHRoZSBwYXRoIGRvbSBlbGVtZW50cyBmb3IgZWFjaCBwYXRoIG9mIGVhY2ggc2VnbWVudCBpbiB0aGUgXHJcbiAgLy8gY29ubmVjdGlvbi5cclxuICAjY3JlYXRlUGF0aEVsZW1zKHNlZ0xpc3QpIHtcclxuICAgIHNlZ0xpc3QuZm9yRWFjaChzZWcgPT4ge1xyXG4gICAgICB0aGlzLnBhdGhFbGVtcy5wdXNoKC4uLnNlZy5jcmVhdGVQYXRoRWxlbXMoKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFNldHMgdGhlIGNvcmUgYW5kIGV4dHJhIHBhdGhzIGFuZCB0aGUgZCB2YWx1ZXMgZm9yIGFsbCBzZWdtZW50cy5cclxuICAjc2V0UGF0aHNBbmREVmFscyhzZWdMaXN0KSB7XHJcbiAgICBjb25zdCBzZXRDb3JlUGF0aCA9IChzZWcsIHByZXZTZWcpID0+IHNlZy5zZXRDb3JlUGF0aChwcmV2U2VnKTtcclxuICAgIGNvbnN0IHNldEV4dHJhUGF0aHMgPSAoc2VnLCBwcmV2U2VnLCBuZXh0U2VnKSA9PiBzZWcuc2V0RXh0cmFQYXRocyhwcmV2U2VnLCBuZXh0U2VnKTtcclxuICAgIGNvbnN0IHNldEFsbFBhdGhzID0gc2VnID0+IHNlZy5zZXRBbGxQYXRocygpO1xyXG4gICAgY29uc3Qgc2V0UGF0aERWYWxzID0gc2VnID0+IHNlZy5zZXRQYXRoRFZhbHMoKTtcclxuXHJcbiAgICBjb25zdCBwYXRoUHJvY2Vzc0Z1bmNzID0gW3NldENvcmVQYXRoLCBzZXRFeHRyYVBhdGhzLCBzZXRBbGxQYXRocywgc2V0UGF0aERWYWxzXTtcclxuXHJcbiAgICBwYXRoUHJvY2Vzc0Z1bmNzLmZvckVhY2gocGF0aFByb2Nlc3NGdW5jID0+IHtcclxuICAgICAgdGhpcy4jc2VnTGlzdFByb2Nlc3NvcihzZWdMaXN0LCBwYXRoUHJvY2Vzc0Z1bmMpXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFVzZWQgdG8gYXBwbHkgdGhlIHNldCBjb3JlIHBhdGgsIHNldCBleHRyYSBwYXRoIGFuZCBzZXQgcGF0aCBkIHZhbCBcclxuICAvLyBmdW5jdGlvbnMgdG8gYWxsIHNlZ21lbnRzLlxyXG4gICNzZWdMaXN0UHJvY2Vzc29yKHNlZ0xpc3QsIHByb2Nlc3NGdW5jKSB7XHJcbiAgICBzZWdMaXN0LmZvckVhY2goKHNlZywgaWR4KSA9PiB7XHJcbiAgICAgIGNvbnN0IHByZXZTZWcgPSBzZWdMaXN0W2lkeCAtIDFdO1xyXG4gICAgICBjb25zdCBuZXh0U2VnID0gc2VnTGlzdFtpZHggKyAxXTtcclxuICAgICAgcHJvY2Vzc0Z1bmMoc2VnLCBwcmV2U2VnLCBuZXh0U2VnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gQ3JlYXRlcyBhIHNlZ21lbnQgb2JqZWN0IGZvciBlYWNoIHNlZ21lbnQgdXNpbmcgdGhlIHNlZ21lbnQgbWFwIGFuZCBjb21tb24gXHJcbiAgLy8gcG9pbnRzIGFuZCBjcmVhdGVzIGFuIGFycmF5IG9mIHRoZXNlIHNlZ21lbnQgb2JqZWN0cy5cclxuICAjZ2V0U2VnRGV0YWlscyhzZWdNYXAsIGNvbW1vblB0cykge1xyXG4gICAgY29uc3Qgc2VnRGV0YWlscyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IHNlZ051bSA9IDA7IHNlZ051bSA8IHNlZ01hcC5sZW5ndGg7IHNlZ051bSsrKSB7XHJcbiAgICAgIGNvbnN0IGhhc1BhdHRlcm4gPSBzZWdNYXBbc2VnTnVtXSA9PT0gMSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgY29uc3Qgc3RhcnQgPSBjb21tb25QdHNbc2VnTnVtXTtcclxuICAgICAgY29uc3QgZW5kID0gY29tbW9uUHRzW3NlZ051bSArIDFdO1xyXG5cclxuICAgICAgY29uc3QgdGhpc1NlZ0RldGFpbHMgPSBuZXcgU2VnbWVudChzZWdOdW0sIGhhc1BhdHRlcm4sIHN0YXJ0LCBlbmQpO1xyXG5cclxuICAgICAgc2VnRGV0YWlscy5wdXNoKHRoaXNTZWdEZXRhaWxzKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlZ0RldGFpbHM7XHJcbiAgfVxyXG5cclxuICAvLyBCdWlsZHMgYXJyYXkgb2Ygd2hpY2ggc2VnbWVudHMgYXJlIGdhcHMgKFwiZ1wiKSBhbmQgd2hpY2ggaGF2ZSBhIHBhdHRlcm4gKDEpLlxyXG4gICNidWlsZFNlZ1BhdHRlcm5NYXAoKSB7XHJcbiAgICBjb25zdCBzZWdNYXAgPSBBcnJheS5mcm9tKFwiZ1wiLnJlcGVhdCh0aGlzLiNudW1TZWdtZW50cykpO1xyXG5cclxuICAgIGZvciAobGV0IHNlZ051bSA9IDA7IHNlZ051bSA8IHRoaXMuI251bVNlZ21lbnRzOyBzZWdOdW0rKykge1xyXG4gICAgICBsZXQgcHJvYklzUGF0dGVybiA9IHRoaXMuI3Byb2JTZWdQYXR0ZXJuO1xyXG5cclxuICAgICAgY29uc3QgW3ByZXZTZWcsIHByZXZTZWcyXSA9IFtzZWdNYXBbc2VnTnVtIC0gMV0sIHNlZ01hcFtzZWdOdW0gLSAyXV07XHJcbiAgICAgIGNvbnN0IHByZXZTZWdIYXNQYXR0ZXJuID0gcHJldlNlZyA/IHByZXZTZWcgIT09IFwiZ1wiIDogZmFsc2U7XHJcbiAgICAgIGNvbnN0IHByZXZTZWcySGFzUGF0dGVybiA9IHByZXZTZWcyID8gcHJldlNlZzIgIT09IFwiZ1wiIDogZmFsc2U7XHJcblxyXG4gICAgICAvLyBSZWR1Y2Ugb2RkcyBvZiBsb25nIHBhdHRlcm5lZCBzZWN0aW9ucywgbWFrZSBpbXBvc3NpYmxlIHRvIGdldCBqdXN0IG9uZSBcclxuICAgICAgLy8gcGF0dGVybmVkIHNlY3Rpb24gYWxvbmUgdGhvdWdoLlxyXG4gICAgICBpZiAocHJldlNlZ0hhc1BhdHRlcm4pIHtcclxuICAgICAgICBpZiAocHJldlNlZzJIYXNQYXR0ZXJuKSB7XHJcbiAgICAgICAgICBjb25zdCBjdXJyQmxvY2tTaXplID0gZ2V0Q3VyckJsb2NrU2l6ZShzZWdOdW0sIHNlZ01hcCk7XHJcbiAgICAgICAgICBwcm9iSXNQYXR0ZXJuICo9IE1hdGgucG93KHRoaXMuI2Jsb2Nrc2l6ZURlY3JlYXNlUHJvYiwgY3VyckJsb2NrU2l6ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcHJvYklzUGF0dGVybiA9IDE7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICAvLyBJZiBsYXN0IHNlZ21lbnQsIHRoZW4gbWFrZSBzdXJlIGl0IGNhbid0IGhhdmUgcGF0dGVybiwgdG8gcHJldmVudCBcclxuICAgICAgLy8gaXNvbGF0ZWQgcGF0dGVybiBibG9jay5cclxuICAgICAgZWxzZSBpZiAoc2VnTnVtID09PSB0aGlzLiNudW1TZWdtZW50cyAtIDEpIHtcclxuICAgICAgICBwcm9iSXNQYXR0ZXJuID0gMDtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHRoaXNTZWcgPSB0ZXN0UmFuZG9tKHByb2JJc1BhdHRlcm4pID8gMSA6IFwiZ1wiO1xyXG4gICAgICBzZWdNYXBbc2VnTnVtXSA9IHRoaXNTZWc7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBzZWdNYXA7XHJcblxyXG4gICAgLy8gR2V0IHRvdGFsIG51bWJlciBvZiBwYXR0ZXJuZWQgc2VnbWVudHMgaW4gYSByb3cgdW50aWwgY3VycmVudCBzZWdOdW0uXHJcbiAgICBmdW5jdGlvbiBnZXRDdXJyQmxvY2tTaXplKHNlZ051bSwgc2VnTWFwKSB7XHJcbiAgICAgIGxldCBibG9ja1NpemUgPSAxO1xyXG4gICAgICBsZXQgaWR4ID0gc2VnTnVtIC0gMjtcclxuXHJcbiAgICAgIHdoaWxlIChpZHggPj0gMCkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJTZWcgPSBzZWdNYXBbaWR4XTtcclxuICAgICAgICBpZiAoY3VyclNlZyA9PT0gXCJnXCIpIGJyZWFrO1xyXG4gICAgICAgIGJsb2NrU2l6ZSArKztcclxuICAgICAgICBpZHgtLTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBibG9ja1NpemU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgdGhlIGNvbW1vbiBwb2ludHMgdG8gYmUgdXNlZCBmb3Igc3RhcnQgYW5kIGVuZCBvZiBlYWNoIHNlZ21lbnQuXHJcbiAgI2dldENvbW1vblB0cygpIHtcclxuICAgIGxldCBjb21tb25QdHMgPSB0aGlzLiNnZXRQcmVsaW1Db21tb25QdHMoKTtcclxuICAgIGNvbW1vblB0cyA9IHRoaXMuI3JhbmRDb21tb25QdHMoY29tbW9uUHRzKTtcclxuICAgIGNvbW1vblB0cy5zcGxpY2UoMCwgMCwgdGhpcy4jc3RhcnRDb29yZHMpO1xyXG4gICAgY29tbW9uUHRzLnB1c2godGhpcy4jZW5kQ29vcmRzKTtcclxuXHJcbiAgICByZXR1cm4gY29tbW9uUHRzO1xyXG4gIH1cclxuXHJcbiAgLy8gTGVycHMgYmV0d2VlbiBzdGFydCBhbmQgZW5kIGNvb3JkcyB0byBjcmVhdGUgc3BlY2lmaWVkIG51bWJlciBvZiBzZWdtZW50cy5cclxuICAjZ2V0UHJlbGltQ29tbW9uUHRzKCkge1xyXG4gICAgY29uc3QgcHRzID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLiNudW1TZWdtZW50czsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHhDb29yZCA9IHRoaXMuI3N0YXJ0Q29vcmRzLnggKyB0aGlzLiNhdmdTZWdWZWN0LnggKiBpO1xyXG4gICAgICBjb25zdCB5Q29vcmQgPSB0aGlzLiNzdGFydENvb3Jkcy55ICsgdGhpcy4jYXZnU2VnVmVjdC55ICogaTtcclxuICAgICAgcHRzLnB1c2gobmV3IFZlY3RvcjIoeENvb3JkLCB5Q29vcmQpKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHB0cztcclxuICB9XHJcblxyXG4gIC8vIFJhbmRvbWlzZSBlYWNoIHByZWxpbWluYXJ5IGNvbW1vbiBwb2ludCB3aXRoIHNvbWUgYWp1c3RtZW50IGluIHRoZSBkaXJlY3Rpb24gb2YgXHJcbiAgLy8gdGhlIG1haW4gdmVjdG9yIGFuZCBwZXJwZW5kaWN1bGFyIHRvIGl0LlxyXG4gICNyYW5kQ29tbW9uUHRzKGNvbW1vblB0cykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21tb25QdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgY29tbW9uUHQgPSBjb21tb25QdHNbaV07XHJcblxyXG4gICAgICBjb25zdCByYW5kQWRqRmFjdG9yTWFpbiA9IHJhbmRCZXR3ZWVuKC1TaW5nbGVDb25uZWN0aW9uLiNDT01NT05fUFRTX01BSU5fUkFORCwgXHJcbiAgICAgICAgU2luZ2xlQ29ubmVjdGlvbi4jQ09NTU9OX1BUU19NQUlOX1JBTkQpO1xyXG5cclxuICAgICAgY29uc3QgcmFuZEFkakZhY3RvclBlcnAgPSByYW5kQmV0d2VlbigtU2luZ2xlQ29ubmVjdGlvbi4jQ09NTU9OX1BUU19QRVJQX1JBTkQsIFxyXG4gICAgICAgIFNpbmdsZUNvbm5lY3Rpb24uI0NPTU1PTl9QVFNfUEVSUF9SQU5EKTtcclxuXHJcbiAgICAgIGNvbnN0IGFkalZlY3RNYWluID0gdGhpcy4jYXZnU2VnVmVjdC5nZXRTY2FsZWRWZWN0b3IocmFuZEFkakZhY3Rvck1haW4pO1xyXG4gICAgICBjb25zdCBhZGpWZWN0UGVycCA9IHRoaXMuI3BlcnBVbml0VmVjdC5nZXRTY2FsZWRWZWN0b3IodGhpcy4jdG90YWxEICogcmFuZEFkakZhY3RvclBlcnApO1xyXG5cclxuICAgICAgY29uc3QgYWRqQ29tbW9uUHQgPSBjb21tb25QdC5hZGRWZWN0b3IoYWRqVmVjdE1haW4pLmFkZFZlY3RvcihhZGpWZWN0UGVycCk7XHJcblxyXG4gICAgICBjb21tb25QdHNbaV0gPSBhZGpDb21tb25QdDtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGNvbW1vblB0cztcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBhd2FpdFRyYW5zaXRpb24gfSBmcm9tIFwiLi4vLi4vLi4vc2hhcmVkSnMvdXRpbHMubWpzXCI7XHJcblxyXG5cclxuXHJcbi8vIGNvbnN0IHN2Z3NUb0RyYXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRyYXctc3ZnXCIpO1xyXG4vLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gZHJhd0FuaW1TdmdzKHN2Z3NUb0RyYXcpKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkcmF3QW5pbVN2Z3Moc3Zncykge1xyXG4gIHN2Z3MuZm9yRWFjaChzdmcgPT4gZHJhd0FuaW1Tdmcoc3ZnKSk7XHJcbn1cclxuXHJcbi8vIEFuaW1hdGUgZHJhd2luZyBvZiBhbiBTVkcgdXNpbmcgaXQncyBwYXRocy5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdBbmltU3ZnKHN2Zykge1xyXG4gIGNvbnN0IHN2Z1BhdGhzID0gc3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoXCJwYXRoXCIpO1xyXG5cclxuICBmb3IgKGxldCBwYXRoIG9mIHN2Z1BhdGhzKSB7XHJcbiAgICBkcmF3QW5pbVBhdGgocGF0aCk7XHJcbiAgfTtcclxufVxyXG5cclxuLy8gQW5pbWF0ZWQgZHJhdyBvZiBhIHNpbmdsZSBwYXRoIG9mIGFuIFNWRy5cclxuZnVuY3Rpb24gZHJhd0FuaW1QYXRoKHBhdGgpIHtcclxuICBjb25zdCBwYXRoTGVuZ3RoID0gcGF0aC5nZXRUb3RhbExlbmd0aCgpO1xyXG5cclxuICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZS1kYXNoYXJyYXlcIiwgcGF0aExlbmd0aCk7XHJcbiAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2UtZGFzaG9mZnNldFwiLCBwYXRoTGVuZ3RoKTtcclxuXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBwYXRoLmNsYXNzTGlzdC5hZGQoXCJkcmF3LXN2Zy1wYXRoXCIpO1xyXG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2UtZGFzaG9mZnNldFwiLCAwKTtcclxuICB9LCAwKTtcclxufVxyXG5cclxuLy8gRHJhd3MgYW4gYXJyYXkgb2YgcGF0aHMgc2ltdWx0YW5lb3VzbHkgYW5kIHJldHVybnMgcHJvbWlzZSB0aGF0IHJlc29sdmVzIFxyXG4vLyB3aGVuIGFsbCBkcmF3bi5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRyYXdTaW11bFBhdGhzKHBhdGhzKSB7XHJcbiAgbGV0IHBhdGhzRHJhd24gPSBuZXcgUHJvbWlzZShyZXMgPT4gcmVzKCkpO1xyXG5cclxuICBmb3IgKGxldCBwYXRoIG9mIHBhdGhzKSB7XHJcbiAgICBwYXRoLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICBkcmF3QW5pbVBhdGgocGF0aCk7XHJcbiAgICBwYXRoc0RyYXduID0gYXdhaXRUcmFuc2l0aW9uKHBhdGgsIFwic3Ryb2tlLWRhc2hvZmZzZXRcIik7XHJcbiAgfTtcclxuXHJcbiAgYXdhaXQgcGF0aHNEcmF3bjtcclxuICByZXR1cm47XHJcbn1cclxuXHJcbi8vIFRoaXMgYW5kIGJlbG93IHR3byBmdW5jdGlvbnMgbm90IHVzZWQgY3VycmVudGx5IGFzIGRlY2lkZWQgdG8gdXNlIGEgc3R5bGUgb2YgXHJcbi8vIGRyYXdpbmcgd2hlcmUgZWFjaCBjb25uZWN0aW9uIGlzIGRyYXduIG9uY2UgYSBjb25uZWN0aW9uIGlzIGRyYXduIHRvIHRoYXQgXHJcbi8vIGVsZW1lbnQsIHRoaXMgaXMgZG9uZSBpbiB0aGUgQ29ubmVjdGlvbnNTdmcgY2xhc3MuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkcmF3SW5PcmRlcihzdmcpIHtcclxuICBjb25zdCBzdmdQYXRocyA9IEFycmF5LmZyb20oc3ZnLmNoaWxkcmVuKTtcclxuICBzdmdQYXRocy5mb3JFYWNoKHBhdGhFbGVtID0+IHBhdGhFbGVtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIikpO1xyXG4gIFxyXG4gIGNvbnN0IHBhdGhJZHhFbGVtcyA9IGdldFBhdGhJZHhFbGVtcyhzdmdQYXRocyk7XHJcblxyXG4gIGZvciAobGV0IGRyYXdJZHggPSAwOyBkcmF3SWR4IDw9IHBhdGhJZHhFbGVtcy5tYXhQYXRoSWR4OyBkcmF3SWR4KyspIHtcclxuICAgIGNvbnN0IHBhdGhJZHhPYmogPSBwYXRoSWR4RWxlbXNbZHJhd0lkeF07XHJcblxyXG4gICAgZm9yIChsZXQgc3ViRHJhd0lkeCA9IDA7IHN1YkRyYXdJZHggPD0gcGF0aElkeE9iai5tYXhTdWJQYXRoSWR4OyBzdWJEcmF3SWR4KyspIHtcclxuICAgICAgY29uc3Qgc3ViUGF0aHMgPSBwYXRoSWR4T2JqW3N1YkRyYXdJZHhdO1xyXG5cclxuICAgICAgYXdhaXQgZHJhd1N1YlBhdGhzKHN1YlBhdGhzLCBkcmF3SWR4LCBzdWJEcmF3SWR4KTtcclxuICAgIH07XHJcbiAgfTtcclxufVxyXG5cclxuLy8gRHJhd3MgdGhlIHJlbGV2YW50IHN1YiBwYXRocyB3aXRoIHRoZSBnaXZlbiBkcmF3SWR4IGFuZCBzdWJEcmF3SWR4IGFuZCBcclxuLy8gcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZXNlIHN1YlBhdGhzIGhhdmUgZmluaXNoZWQgYmVpbmcgZHJhd24uXHJcbmFzeW5jIGZ1bmN0aW9uIGRyYXdTdWJQYXRocyhwYXRocykge1xyXG4gIGxldCBwYXRoc0RyYXduID0gbmV3IFByb21pc2UocmVzID0+IHJlcygpKTtcclxuXHJcbiAgZm9yIChsZXQgcGF0aCBvZiBwYXRocykge1xyXG4gICAgcGF0aC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgZHJhd0FuaW1QYXRoKHBhdGgpO1xyXG4gICAgcGF0aHNEcmF3biA9IGF3YWl0VHJhbnNpdGlvbihwYXRoLCBcInN0cm9rZS1kYXNob2Zmc2V0XCIpO1xyXG4gIH07XHJcblxyXG4gIGF3YWl0IHBhdGhzRHJhd247XHJcbiAgcmV0dXJuO1xyXG59XHJcblxyXG4vLyBCdWlsZHMgYW4gb2JqZWN0IHdpdGgga2V5cyBvZiBkcmF3SWR4cyBhbmQgc3ViIGtleXMgb2Ygc3ViRHJhd0lkeHMgYW5kIFxyXG4vLyBwcm9wZXJ0aWVzIHdoaWNoIGFyZSBhcnJheXMgb2YgcGF0aHMgd2l0aCB0aGVzZSBkcmF3IGFuZCBzdWJEcmF3IGlkeHMuXHJcbmZ1bmN0aW9uIGdldFBhdGhJZHhFbGVtcyhwYXRoRWxlbXMpIHtcclxuICBjb25zdCBwYXRoSWR4RWxlbXMgPSB7bWF4UGF0aElkeDogMH07XHJcblxyXG4gIGZvciAobGV0IHBhdGhFbGVtIG9mIHBhdGhFbGVtcykge1xyXG4gICAgY29uc3QgcGF0aERyYXdJZHggPSBOdW1iZXIocGF0aEVsZW0uZGF0YXNldC5kcmF3SWR4KTtcclxuICAgIGNvbnN0IHBhdGhTdWJEcmF3SWR4ID0gTnVtYmVyKHBhdGhFbGVtLmRhdGFzZXQuc3ViRHJhd0lkeCk7XHJcblxyXG4gICAgY29uc3QgcGF0aElkeEV4aXN0cyA9IE9iamVjdC5oYXNPd24ocGF0aElkeEVsZW1zLCBwYXRoRHJhd0lkeCk7XHJcblxyXG4gICAgaWYgKHBhdGhJZHhFeGlzdHMpIHtcclxuICAgICAgY29uc3Qgc3ViUGF0aElkeEV4aXN0cyA9IE9iamVjdC5oYXNPd24ocGF0aElkeEVsZW1zW3BhdGhEcmF3SWR4XSwgcGF0aFN1YkRyYXdJZHgpO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBwYXRoRWxlbS5cclxuICAgICAgaWYgKHN1YlBhdGhJZHhFeGlzdHMpIHtcclxuICAgICAgICBwYXRoSWR4RWxlbXNbcGF0aERyYXdJZHhdW3BhdGhTdWJEcmF3SWR4XS5wdXNoKHBhdGhFbGVtKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBJbmNyZWFzZSBtYXhTdWJQYXRoSWR4IGlmIG5lY2Vzc2FyeSBhbmQgYWRkIHRoZSBwYXRoRWxlbS5cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbmV3TWF4U3ViSWR4ID0gcGF0aFN1YkRyYXdJZHggPiBwYXRoSWR4RWxlbXNbcGF0aERyYXdJZHhdLm1heFN1YlBhdGhJZHg7XHJcblxyXG4gICAgICAgIGlmIChuZXdNYXhTdWJJZHgpIHtcclxuICAgICAgICAgIHBhdGhJZHhFbGVtc1twYXRoRHJhd0lkeF0ubWF4U3ViUGF0aElkeCA9IHBhdGhTdWJEcmF3SWR4O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHBhdGhJZHhFbGVtc1twYXRoRHJhd0lkeF1bcGF0aFN1YkRyYXdJZHhdID0gW3BhdGhFbGVtXTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJbmNyZWFzZSB0aGUgbWF4UGF0aElkeCBpZiBuZWNlc3NhcnkgYW5kIGFkZCB0aGUgcGF0aCBhbmQgc3ViUGF0aEVsZW0uXHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc3QgbmV3TWF4UGF0aElkeCA9IHBhdGhEcmF3SWR4ID4gcGF0aElkeEVsZW1zLm1heFBhdGhJZHg7XHJcblxyXG4gICAgICBpZiAobmV3TWF4UGF0aElkeCkge1xyXG4gICAgICAgIHBhdGhJZHhFbGVtcy5tYXhQYXRoSWR4ID0gcGF0aERyYXdJZHg7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBwYXRoSWR4RWxlbXNbcGF0aERyYXdJZHhdID0ge1xyXG4gICAgICAgIG1heFN1YlBhdGhJZHg6IHBhdGhTdWJEcmF3SWR4LFxyXG4gICAgICAgIFtwYXRoU3ViRHJhd0lkeF06IFtwYXRoRWxlbV1cclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHBhdGhJZHhFbGVtcztcclxufSIsIi8vIEhlbHBlciBmdW5jdGlvbnMgdG8gYXNzaXN0IHdpdGggZmFkaW5nIGluIC8gb3V0IERPTSBlbGVtZW50cy5cclxuaW1wb3J0IHsgYXdhaXRUcmFuc2l0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZEpzL3V0aWxzLm1qc1wiO1xyXG5cclxuXHJcblxyXG4vLyBGYWRlIHRyYW5zaXRpb24gaGVscGVyIGZ1bmN0aW9ucywgdXNlZCB3aXRoIHRyYW5zcGFyZW50LCBmdWxseS1oaWRkZW4gYW5kIFxyXG4vLyBmYWRlLXRyYW5zIGNzcyBjbGFzc2VzLlxyXG4vLyBNYWtlcyBkaXNwbGF5IHByb3BlcnR5IHZpc2libGUgYW5kIHRoZW4gcmVtb3ZlcyB0cmFuc3BhcmVuY3kuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlSW4oZWxlbSkge1xyXG4gIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImZ1bGx5LWhpZGRlblwiKTtcclxuICBzZXRUaW1lb3V0KCgpID0+IGVsZW0uY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zcGFyZW50XCIpLCAxMCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5pc2hGYWRlSW4oZWxlbSkge1xyXG4gIGF3YWl0IGF3YWl0VHJhbnNpdGlvbihlbGVtLCBcIm9wYWNpdHlcIik7XHJcbn1cclxuXHJcbi8vIEZpbmlzaGVzIHdoZW4gZmFkZSBpbiBpcyBjb21wbGV0ZWQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmdWxseUZhZGVJbihlbGVtKSB7XHJcbiAgZmFkZUluKGVsZW0pO1xyXG4gIGF3YWl0IGZpbmlzaEZhZGVJbihlbGVtKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVPdXQoZWxlbSkge1xyXG4gIGVsZW0uY2xhc3NMaXN0LmFkZChcInRyYW5zcGFyZW50XCIpO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBvcGFjaXR5IHRyYW5zaXRpb24gb24gdGhlIFxyXG4vLyBnaXZlbiBlbGVtZW50IGlzIGNvbXBsZXRlZC4gQWxzbyBmdWxseSBoaWRlcyB0aGUgZWxlbWVudC5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmlzaEZhZGVPdXQoZWxlbSkge1xyXG4gIGF3YWl0IGF3YWl0VHJhbnNpdGlvbihlbGVtLCBcIm9wYWNpdHlcIik7XHJcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKFwiZnVsbHktaGlkZGVuXCIpO1xyXG59XHJcblxyXG4vLyBGYWRlIG91dCBhbmQgZnVsbHkgaGlkZSB0aGUgZ2l2ZW4gZWxlbWVudC5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZ1bGx5RmFkZU91dChlbGVtKSB7XHJcbiAgZmFkZU91dChlbGVtKTtcclxuICBhd2FpdCBmaW5pc2hGYWRlT3V0KGVsZW0pO1xyXG59XHJcblxyXG4vLyBGYWRlcyBvdXQgZWxlbTEgYW5kIGZhZGVzIGluIGVsZW0yIG9uY2UgdHJhbnNpdGlvbiBjb21wbGV0ZWQsIGRvZXNuJ3QgZmluaXNoIFxyXG4vLyB1bnRpbCBlbGVtMiBmdWxseSBmYWRlZCBpbi4gUmV0dXJucyBwcm9taXNlLlxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZUZyb21UbyhlbGVtMSwgZWxlbTIpIHtcclxuICBjb25zdCBmYWRlQ29tcGxldGVQcm9taXNlID0gbmV3IFByb21pc2UoYXN5bmMgcmVzb2x2ZSA9PiB7XHJcbiAgICBhd2FpdCBmdWxseUZhZGVPdXQoZWxlbTEpO1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlSW4oZWxlbTIpO1xyXG4gICAgcmVzb2x2ZSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZmFkZUNvbXBsZXRlUHJvbWlzZTtcclxufSIsImltcG9ydCB7IGZ1bGx5RmFkZUluLCBmdWxseUZhZGVPdXQgfSBmcm9tIFwiLi9mYWRlVHJhbnNpdGlvbnMubWpzXCI7XHJcblxyXG5cclxuXHJcbi8vIEJ0biB3aXRoIGFzc29jaWF0ZWQgY29udGVudC4gQ29udGVudCBmYWRlcyBpbiB3aGVuIGJ1dHRvbiBpcyBjbGlja2VkIGFuZCBcclxuLy8gZmFkZXMgb3V0IHdoZW4gYW55dGhpbmcgaXMgY2xpY2tlZC4gVXNlZCBieSBpbmZvIGJ1dHRvbnMgYW5kIG5hdiBkcm9wZG93bi5cclxuY2xhc3MgUG9wQnRuIHtcclxuICAjYnRuO1xyXG4gICNjb250ZW50O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwb3BCdG5Db250YWluZXIpIHtcclxuICAgIHRoaXMuI2J0biA9IHBvcEJ0bkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnBvcC1idG5cIik7XHJcbiAgICB0aGlzLiNjb250ZW50ID0gcG9wQnRuQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIucG9wLWJ0bi1jb250ZW50XCIpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMuI3NldHVwSW5mb0J0bkNsaWNrKHRoaXMuI2J0biwgdGhpcy4jY29udGVudCk7XHJcbiAgfVxyXG5cclxuICAjc2V0dXBJbmZvQnRuQ2xpY2soYnRuLCBjb250ZW50KSB7XHJcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgdGhpcy4jaGFuZGxlSW5mb0J0bkNsaWNrKGJ0biwgY29udGVudCk7XHJcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgI2hhbmRsZUluZm9CdG5DbGljayhidG4sIGNvbnRlbnQpIHtcclxuICAgIGF3YWl0IGZ1bGx5RmFkZUluKGNvbnRlbnQpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGF3YWl0IGZ1bGx5RmFkZU91dChjb250ZW50KTtcclxuICAgICAgdGhpcy4jc2V0dXBJbmZvQnRuQ2xpY2soYnRuLCBjb250ZW50KTtcclxuICAgIH0sIHtvbmNlOiB0cnVlfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBJbml0cyBhbGwgcG9wIGJ0bnMgb24gYSBwYWdlLlxyXG5mdW5jdGlvbiBzZXR1cFBvcEJ0bnMoKSB7XHJcbiAgY29uc3QgcG9wQnRuQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wLWJ0bi1jb250YWluZXJcIik7XHJcbiAgXHJcbiAgcG9wQnRuQ29udGFpbmVycy5mb3JFYWNoKHBvcEJ0bkNvbnRhaW5lciA9PiB7XHJcbiAgICBjb25zdCBwb3BCdG4gPSBuZXcgUG9wQnRuKHBvcEJ0bkNvbnRhaW5lcik7XHJcbiAgICBwb3BCdG4uaW5pdCgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5zZXR1cFBvcEJ0bnMoKTsiLCJcclxuZXhwb3J0IGNsYXNzIFZlY3RvcjIge1xyXG4gIHg7XHJcbiAgeTtcclxuICBcclxuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICB9XHJcblxyXG4gIGdldFR4dCgpIHtcclxuICAgIHJldHVybiBgJHt0aGlzLnh9LCAke3RoaXMueX1gO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmV2ZXJzZSgpIHtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yMigtdGhpcy54LCAtdGhpcy55KTtcclxuICB9XHJcblxyXG4gIHZlY3RvclRvKHJlbFZlY3QpIHtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yMihyZWxWZWN0LnggLSB0aGlzLngsIHJlbFZlY3QueSAtIHRoaXMueSk7XHJcbiAgfVxyXG5cclxuICB2ZWN0b3JGcm9tKHJlbFZlY3QpIHtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggLSByZWxWZWN0LngsIHRoaXMueSAtIHJlbFZlY3QueSk7XHJcbiAgfVxyXG5cclxuICBhZGRWZWN0b3IodmVjdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgdmVjdG9yLngsIHRoaXMueSArIHZlY3Rvci55KTtcclxuICB9XHJcblxyXG4gIGdldFNjYWxlZFZlY3RvcihzY2FsZUZhY3Rvcikge1xyXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAqIHNjYWxlRmFjdG9yLCB0aGlzLnkgKiBzY2FsZUZhY3Rvcik7XHJcbiAgfVxyXG5cclxuICBnZXRVbml0VmVjdG9yKCkge1xyXG4gICAgY29uc3QgbWFnID0gdGhpcy5nZXRNYWcoKTtcclxuICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggLyBtYWcsIHRoaXMueSAvIG1hZyk7XHJcbiAgfVxyXG5cclxuICBnZXRNYWcoKSB7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwgMikgKyBNYXRoLnBvdyh0aGlzLnksIDIpKTtcclxuICB9XHJcblxyXG4gIC8vIFBvc2l0aXZlIGFuZ2xlIG1lYW5zIGNsb2Nrd2lzZSwgbmVnYXRpdmUgYW50aWNsb2Nrd2lzZS5cclxuICBnZXRSb3RhdGVkVmVjdG9yKGFuZ2xlLCByb3RPcmlnaW4gPSBuZXcgVmVjdG9yMigwLCAwKSkge1xyXG4gICAgY29uc3Qgcm90VmVjID0gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG5cclxuICAgIGNvbnN0IHNpbkEgPSBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICBjb25zdCBjb3NBID0gTWF0aC5jb3MoYW5nbGUpO1xyXG5cclxuICAgIC8vIFRyYW5zbGF0ZSBwb2ludCBiYWNrIHRvIG9yaWdpbi5cclxuICAgIHJvdFZlYy54IC09IHJvdE9yaWdpbi54O1xyXG4gICAgcm90VmVjLnkgLT0gcm90T3JpZ2luLnk7XHJcblxyXG4gICAgLy8gUm90YXRlIHBvaW50LlxyXG4gICAgY29uc3QgeE5ldyA9IHJvdFZlYy55ICogc2luQSArIHJvdFZlYy54ICogY29zQTtcclxuICAgIGNvbnN0IHlOZXcgPSByb3RWZWMueSAqIGNvc0EgLSByb3RWZWMueCAqIHNpbkE7XHJcblxyXG4gICAgLy8gVHJhbnNsYXRlIHBvaW50IGJhY2suXHJcbiAgICByb3RWZWMueCA9IHhOZXcgKyByb3RPcmlnaW4ueDtcclxuICAgIHJvdFZlYy55ID0geU5ldyArIHJvdE9yaWdpbi55O1xyXG4gICAgcmV0dXJuIHJvdFZlYztcclxuICB9XHJcbn0iLCIvLyBDbGFtcCBudW1iZXIgYmV0d2VlbiB0d28gdmFsdWVzLlxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAobnVtLCBtaW4sIG1heCkge1xyXG4gIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChudW0sIG1pbiksIG1heCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIHBycHJ0biA9IDAuNSkge1xyXG4gIHJldHVybiBzdGFydCArICgoZW5kIC0gc3RhcnQpICogcHJwcnRuKTtcclxufVxyXG5cclxuLy8gRm9yIGludHMsIGl0IGlzIGluY2x1c2l2ZSBvZiBzdGFydCBhbmQgbm90IGluY2x1c2l2ZSBvZiBlbmQuXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kQmV0d2VlbihzdGFydCA9IDAsIGVuZCA9IDEsIGludHMgPSBmYWxzZSkge1xyXG4gIGNvbnN0IHJhbmdlID0gZW5kIC0gc3RhcnQ7XHJcbiAgY29uc3QgcmFuZEZsb2F0ID0gKE1hdGgucmFuZG9tKCkgKiByYW5nZSkgKyBzdGFydDtcclxuICByZXR1cm4gaW50cyA/IE1hdGguZmxvb3IocmFuZEZsb2F0KSA6IHJhbmRGbG9hdDtcclxufVxyXG5cclxuLy8gUHJvYmFiaWxpdHkgc2hvdWxkIGJlIGEgZGVjaW1hbCwgcmV0dXJucyB0cnVlIG9yIGZhbHNlLlxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdFJhbmRvbShwcm9iYWJpbGl0eSkge1xyXG4gIHJldHVybiAoTWF0aC5yYW5kb20oKSA8PSBwcm9iYWJpbGl0eSkgPyB0cnVlIDogZmFsc2U7XHJcbn1cclxuXHJcbi8vIFRha2VzIGEgbGlzdCBvZiBwcm9iIG9iamVjdHMgYXMgaW5wdXQgaW4gZm9ybWF0IHtuYW1lOiBuYW1lLCBwcm9iOiBwcm9ifSBhbmQgXHJcbi8vIHJldHVybnMgbmFtZSBvZiBjaG9zZW4gcHJvYk9iaiwgb3IgZmFsc2UgaWYgbm9uZSBjaG9zZW4gKGluIGNhc2UgdGhhdCBwcm9iT2JqcyBcclxuLy8gcHJvYnMgZG9udCBzdW0gdG8gMSkuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0UmFuZE11bHQoLi4ucHJvYnMpIHtcclxuICBjb25zdCBwcm9ic09ianMgPSBbXTtcclxuICBsZXQgY3VyclByb2JTdGFydCA9IDA7XHJcblxyXG4gIHByb2JzLmZvckVhY2gocHJvYiA9PiB7XHJcbiAgICBjb25zdCB0aGlzUHJvYiA9IHtcclxuICAgICAgbmFtZTogcHJvYi5uYW1lLFxyXG4gICAgICBzdGFydDogY3VyclByb2JTdGFydCxcclxuICAgICAgZW5kOiBjdXJyUHJvYlN0YXJ0ICsgcHJvYi5wcm9iXHJcbiAgICB9O1xyXG5cclxuICAgIHByb2JzT2Jqcy5wdXNoKHRoaXNQcm9iKTtcclxuXHJcbiAgICBjdXJyUHJvYlN0YXJ0ICs9IHByb2I7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGNob3NlblZhbCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgbGV0IHJldHVyblZhbCA9IGZhbHNlO1xyXG5cclxuICBwcm9ic09ianMuZm9yRWFjaChwcm9iID0+IHtcclxuICAgIGNvbnN0IGNob3NlblRoaXNQcm9iID0gcHJvYi5zdGFydCA8PSBjaG9zZW5WYWwgJiYgcHJvYi5lbmQgPiBjaG9zZW5WYWw7XHJcbiAgICBpZiAoY2hvc2VuVGhpc1Byb2IpIHtcclxuICAgICAgcmV0dXJuVmFsID0gcHJvYi5uYW1lO1xyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHJldHVyblZhbDtcclxufVxyXG5cclxuLy8gU2VhcmNoZXMgZm9yIGEgbmV3SXRlbSBpbiBhbiBhcnJheSBnaXZlbiBhbiBlbGVtQ29tcEZ1bmMgdGhhdCBkZXRlcm1pbmVzIFxyXG4vLyB3aGV0aGVyIGl0IGlzIHByZXNlbnQgb3Igbm90IChlZy4gdG8gZmluZCBiYXNlZCBvbiBxdWVzdGlvbiBJRCkuIElmIHByZXNlbnQsIFxyXG4vLyBlbGVtZW50IGluIGFycmF5IGlzIG92ZXJ3cml0dGVuIHdpdGggbmV3SXRlbSwgb3RoZXJ3aXNlIG5ld0l0ZW0gaXMgcHVzaGVkIHRvIFxyXG4vLyBlbmQgb2YgYXJyYXkuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQW5kT3ZlcndyaXRlRWxzZVB1c2goYXJyYXksIG5ld0l0ZW0sIGVsZW1Db21wRnVuYykge1xyXG4gIGNvbnN0IGZvdW5kSW5kZXggPSBhcnJheS5maW5kSW5kZXgoYXJySXRlbSA9PiBlbGVtQ29tcEZ1bmMoYXJySXRlbSwgbmV3SXRlbSkpO1xyXG5cclxuICAvLyBJZiBmb3VuZCwgb3ZlcndyaXRlLlxyXG4gIGlmIChmb3VuZEluZGV4ID4gLTEpIHtcclxuICAgIGFycmF5LnNwbGljZShmb3VuZEluZGV4LCAxLCBuZXdJdGVtKTtcclxuICB9XHJcbiAgLy8gT3RoZXJ3aXNlIGFkZC5cclxuICBlbHNlIHtcclxuICAgIGFycmF5LnB1c2gobmV3SXRlbSk7XHJcbiAgfTtcclxufVxyXG5cclxuLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRyYW5zaXRpb24gb24gZ2l2ZW4gZWxlbWVudCBlbmRzLCBcclxuLy8gb3B0aW9uYWwgdHJhbnNpdGlvbiBwcm9wZXJ0eSBuYW1lIGNoZWNrLlxyXG5leHBvcnQgZnVuY3Rpb24gYXdhaXRUcmFuc2l0aW9uKGVsZW0sIHByb3BOYW1lID0gbnVsbCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgYXN5bmMgZXZ0ID0+IHtcclxuXHJcbiAgICAgIGlmIChwcm9wTmFtZSkge1xyXG4gICAgICAgIGlmIChldnQucHJvcGVydHlOYW1lID09PSBwcm9wTmFtZSkge1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xyXG4gIH0pXHJcbn1cclxuXHJcbi8vIEZvciB0ZXN0aW5nIGxvbmcgcnVubmluZyBmdW5jdGlvbnMuXHJcbi8vIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7IC8vLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IENvbm5lY3Rpb25zU3ZnIH0gZnJvbSBcIi4uL21vZHVsZXMvZHJhd1N2Z3MvY29ubmVjdGlvbnNTdmcvY29ubmVjdGlvbnNTdmcubWpzXCI7XHJcbmltcG9ydCBcIi4vbG9nZ2VkSW5QYWdlLmpzXCI7XHJcblxyXG5cclxuXHJcbmNvbnN0IGVsZW1zVG9Kb2luID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jb25uZWN0LWVsZW1cIik7XHJcbmNvbnN0IGNvbm5lY3Rpb25zU3ZnID0gbmV3IENvbm5lY3Rpb25zU3ZnKGVsZW1zVG9Kb2luKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgY29ubmVjdGlvbnNTdmcuY3JlYXRlQW5kRHJhdygpO1xyXG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=