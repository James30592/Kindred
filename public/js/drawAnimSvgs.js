const svgsToDraw = document.querySelectorAll(".draw-svg");

// window.addEventListener("load", () => drawAnimSvgs(svgsToDraw));

export function drawAnimSvgs(svgs) {
  svgs.forEach(svg => drawAnimSvg(svg));
}

// Animate drawing of an SVG using it's paths.
export function drawAnimSvg(svg) {
  const svgPaths = svg.querySelectorAll("path");

  for (let path of svgPaths) {
    const pathLength = path.getTotalLength();

    path.setAttribute("stroke-dasharray", pathLength);
    path.setAttribute("stroke-dashoffset", pathLength);

    setTimeout(() => {
      path.classList.add("draw-svg-path");
      path.setAttribute("stroke-dashoffset", 0);
    }, 0);
  };
}