import { awaitTransition } from "../../../sharedJs/utils.mjs";



// const svgsToDraw = document.querySelectorAll(".draw-svg");
// window.addEventListener("load", () => drawAnimSvgs(svgsToDraw));

export function drawAnimSvgs(svgs) {
  svgs.forEach(svg => drawAnimSvg(svg));
}

// Animate drawing of an SVG using it's paths.
export function drawAnimSvg(svg) {
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
export async function drawSimulPaths(paths) {
  let pathsDrawn = new Promise(res => res());

  for (let path of paths) {
    path.classList.remove("hidden");
    drawAnimPath(path);
    pathsDrawn = awaitTransition(path, "stroke-dashoffset");
  };

  await pathsDrawn;
  return;
}

// This and below two functions not used currently as decided to use a style of 
// drawing where each connection is drawn once a connection is drawn to that 
// element, this is done in the ConnectionsSvg class.
export async function drawInOrder(svg) {
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
    pathsDrawn = awaitTransition(path, "stroke-dashoffset");
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