// const NUM_SEGMENTS = 10;
// const LENGTH_WIDTH_RATIO = 0.2;
// const PRELIM_COMMON_PTS_RAND = 0.2;
// const MIN_PATTERN_SEGS = 4;
// const MAX_PATTERN_SEGS = 7;
// const GROUP_3_PROB = 0.4;



// function makePaths(startCoords, endCoords) {

//   const mainVector = vector between start and end coords
// 	const perpVector = perpendicular to mainVector
// 	const widthLim = distance between start and end coords * LENGTH_WIDTH_RATIO (maybe set this for each commonPoint indivually later, wider in the middle than at the ends)

// 	const prelimCommonPts1 = [lerp NUM_SEGMENTS number of times between start and end coords]
// 	const prelimCommonPts2 = prelimCommonPts1 randomised to be +/- PRELIM_COMMON_PTS_RAND * segment length

// 	const commonPts = [choose one point on perpVector from each prelimCommonPts2 somewhere up between -widthLim and widthLim]

// 	// these commonPts will be the points the all bonus paths must start / end at

// 	const numPatternSegs = get random number between MIN_PATTERN_SEGS and MAX_PATTERN_SEGS;
// 	const patternGroupSizes = getPatternGroupSizes(numPatternSegs, []);
// 	const patternGroupSizes = randPatternOrders(patternGroupSizes);
	

//   let segMap = getInitSegMap(patternGroupSizes);
//   segMap = insertExtraGaps(segMap, NUM_SEGMENTS);

//   // By this point segMap is final and will have NUM_SEGMENTS number of elements 
//   // with either pattern Ids or gaps.
//   // eg. ["g", 1, 1, "g", "g", 2, 2, "g", "3", "3"]


//   const allSegDetails = create array of objects like this from segMap and commonPts
//   // Like this...
//   // [
//   //   {
//   //     idx: 0,
//   //     patternId: "g",
//   //     start: {
//   //        x:
//   //        y:
//   //     },
//   //     end: {
//   //        x:
//   //        y:
//   //     },
//      //  absLen: absoluteLength seg start to end,
//       // coreCtrlPts: [
//       //     {
//       //         x:
//       //         y:
//       //     },
//       //     {
//       //         x:
//       //         y:
//       //     }
//       // ]
//       // extraPathCtrlPts: [
//       //   [
//       //     {
//       //         x:
//       //         y:
//       //     },
//       //     {
//       //         x:
//       //         y:
//       //     }
//       //   ],
//       //   .....
//       // ]
//   //   },
//   //   ...
//   // ]

//   getCoreControlPts(allSegDetails, mainVector, perpVector);
//   getExtraPathCtrlPts(allSegDetails, mainVector, perpVector);
	
//   create proper path elements from all the info in allSegDetails...

// }




// function getExtraPathCtrlPts(allSegDetails, mainVector, perpVector) {
//   for (let seg of allSegDetails) {
//     if (seg.patternId === "g") continue;

//     const numExtraPaths = 2;

//     const basisVector = vector from seg.start to seg.coreCtrlPts[0];
//     const segVector = seg.end - seg.start;
//     const corePathDir = segVector angle - basisVector angle (positive or negative, direction of core path from main direction);

//     for (let extraPathIdx = 0; extraPathIdx < numExtraPaths; extraPathIdx++) {
//       seg.extraPathCtrlPts[extraPathIdx][0] = get1stCPt(seg, extraPathIdx, corePathDir)
//       seg.extraPathCtrlPts[extraPathIdx][1] = get2ndCPt(seg, extraPathIdx, corePathDir)
//     };
//   };

//   function get1stCPt(seg, extraPathIdx, corePathDir) {
//     const isFollowingPath = allSegDetails[seg.index - 1].patternId === seg.patternId;

//     if (isFollowingPath) {
//       get perfect mirror vector to respective 2nd ctrl pt from last seg (extraPathIdx)
//     }
//     else {
//       // The similar extra path.
//       if (extraPathIdx === 0) {
//         const 1stCPVector = use corePathDir to work out a similar vector that is 20-45 degrees MORE extreme than this but in same direction (+ive / -ive angle), randomised
//       }
//       // The different extra path.
//       else {
//         const 1stCPVector = use corePathDir to work out a similar vector that is 20-45 degrees the other way, randomised
//       };

//       const 1stCPt = work out based on 1stCPVector and randomised strength (0.2 - 0.7 of seg abs d?)
//       return 1stCPt;
//     };
//   }

//   function get2ndCPt(seg, extraPathIdx, corePathDir) {
//     // The similar extra path.
//     if (extraPathIdx === 0) {
//       const 2ndCPt = use corePathDir to make sure it is on same side of core path, eg. if anticlockwise at the top compared to core path then should be clockwise at the bottom. get similar by 20-45 degrees stuff again.
//     }
//     // The different extra path.
//     else {
//       use corePathDir again to make sure same side no matter how extreme the vector.GROUP_3_PROB

//       if next seg is also same pattern Id {
//         const 2ndCPt = give 80% chance to hit end coords at 90% ish extreme vector
//       }
//       else {
//         const 2ndCPt = use more gentle angle, 20 - 45 degrees again
//       }
//     };

//     return 2ndCPt;    
//   }

//   function getSimilarVector(ogVector) {
//     get vector angle between 20 and 45 degrees either side of ogVector;
//     get strength of 0.2 to 0.7 * abs seg distance;
//     return this vector;
//   }
// }






// function getCoreControlPts(allSegDetails, mainVector, perpVector) {
//   for (let seg of allSegDetails) {
//     seg.coreCtrlPts[0] = get1stCPt(seg, mainVector);
//     seg.coreCtrlPts[1] = get2ndCPt(seg, mainVector, perpVector);
//   };

//   function get1stCPt(seg) {
//     const isFirstSeg = seg.idx === 0;

//     if (isFirstSeg) {
//       choose direction +ive or negative (left or right) from mainVector;
//       choose random vector angle between 20 to 50 degrees
//       choose random strength between 0.2 and 0.4 of direct length of this segment
//       create this vector using above 3 factors and pick the coordinates at this point from startCoords;

//       return this point;
//     }
//     else {
//       return reflection of allSegDetails[seg.idx - 1].coreCtrlPts[1] from seg.start;
//     };
//   };

//   function get2ndCPt(seg, mainVector, perpVector) {
//     const simVector = getSimilarVector(vector from seg.start to seg.coreCtrlPts[0]);
//     const 2ndCPtVector = reflect simVector in perpVector;
//     const 2ndCPt = apply 2ndCPtVector from seg.end;
//     return 2ndCPt;
//   }

//   function getSimilarVector(ogVector) {
//     get vector angle within 30 degrees either side of ogVector;
//     get strength within 25% of that of ogVector;
//     return this vector;
//   }
// }






// function insertExtraGaps(segMap, desiredSize) {
//   while(segMap.length > desiredSize) {
//     if (segMap[0] !== "g") {
//       insertGapSegmap(0);
//     }
//     else if (segMap.at(-1) !== "g") {
//       insertGapSegmap(segMap.length);
//     }
//     else {
//       const currGapPsns = segMap.map((seg, idx) => {
//         if (seg === "g") {
//           return idx;
//         };
//       });

//       const currGapPsnsFiltered = currGapPsns.filter(gapPsn => {
//         return Number.isInteger(gapPsn);
//       });

//       choose random integer between 0 and currGapPsnsFiltered.length - 1;
//       pick this element from currGapPsnsFiltered;
//       insertGapSegmap(value of this element);
//     };
//   };

//   function insertGapSegmap(idx) {
//     segMap.splice(idx, 0, "g");
//   };

// }

// function getInitSegMap(patternGroupSizes) {
// 	const segMap = [];

// 	let patternId = 0;

// 	patternGroupSizes.forEach(groupSize => {
// 		const needGapBetweenPatterns = Number.isInteger(segMap.at(-1);
// 		if (needGapBetweenPatterns) {
// 			segMap.push("g");
// 		};

// 		for (let numSegs = 0; numSegs > groupSize; numSegs++) {
// 			segMap.push(patternId);
// 		};

// 		patternId++;
// 	});

//   return segMap;
// }

// function randPatternOrders(patternGroupSizes) {
// 	... use array.sort and rand number funtion...
// }

// function getPatternGroupSizes(numPatternSegs, patternGroupSizes) {
// 	if (numPatternSegs === 0) return patternGroupSizes;
	
// 	let thisGroupSize = 1;

// 	if (numPatternSegs >= 3) {
// 		const make3Group = generate rand number and if less than GROUP_3_PROB then true;
// 		if (make3Group) {
// 			thisGroupSize = 3;
// 		};
// 	}
// 	else if (numPatternSegs >= 2) {
// 		thisGroupSize = 2;
// 	};
	
// 	patternGroupSizes.push(thisGroupSize);
// 	numPatternSegs -= thisGroupSize;
// 	return getPatternGroupSizes(numPatternSegs, patternGroupSizes);
// }