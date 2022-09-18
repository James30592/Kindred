import { drawAnimSvg } from "../../drawAnimSvgs.js";
import { Vector2 } from "../vector2.mjs";
import { SingleConnection } from "./singleConnection.mjs";



export class ConnectionsSvg {
  elemsToJoin;
  connectPts;

  constructor(elemsToJoin) {
    this.elemsToJoin = elemsToJoin;
  }

  // 
  createAndDraw() {
    const svgConnects = this.createSvg(this.elemsToJoin);
    // drawAnimSvg(svgConnects);
  }
 
  // 
  createSvg(elems) {
    const parentElem = document.querySelector(".svg-connects-wrapper");
    const parentElemRect = parentElem.getBoundingClientRect();
    
    const parentOffset = new Vector2(parentElemRect.left, parentElemRect.top);
  
    const viewBoxWidth = parentElemRect.width;
    const viewBoxHeight = parentElemRect.height;
  
    const elemsConnectInfos = this.getElemConnectInfos(elems, parentOffset);
  
    // Do this later, use the data attribute for ids of which other elements each should connect to.............
    // const connectPaths = getConnectPaths()
    const connectPathsIds = [
      ["0", "1"],
      ["0", "2"],
      ["1", "2"]
    ];
  
    const connectCoords = this.getConnectCoords(connectPathsIds, elemsConnectInfos);
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
    svg.classList.add("connections-svg");
    svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("preserveAspectRatio", "none");
  
    this.createSvgPaths(svg, connectCoords);
  
    parentElem.appendChild(svg);
    return svg;
  }

  // 
  createSvgPaths(svg, connectCoords) {
    connectCoords.forEach(connectCoordsPair => {
      const connection = new SingleConnection(connectCoordsPair);
      const connectionPaths = connection.createPaths();
      svg.append(...connectionPaths);



      // const thisPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
      // const dValInfo = getDVal(connectCoordsPair);
  
      // thisPath.setAttribute("d", getDVal(connectCoordsPair));
      // svg.appendChild(thisPath);
  
      
  
      // const thisPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
      // thisPath2.setAttribute("d", `M 200,200 v 500`);
      // svg.appendChild(thisPath2);
    });
  }

  // 
  getConnectCoords(connectPathsIds, elemsConnectInfos) {
    const connectPathsCoords = connectPathsIds.map(connectPathIds => {
  
      const connectPathCoords = connectPathIds.map(thisElemId => {
        const elemConnectInfo = elemsConnectInfos.find(elem => {
          return elem.elemId === thisElemId;
        });
  
        return elemConnectInfo.posn;
      });
  
      return connectPathCoords;
    });
  
    return connectPathsCoords;
  }

  // 
  getElemConnectInfos(elems, parentOffset) {
    const elemsConnectInfos = [];
    
    elems.forEach(elem => {
      const connectInfo = {};
    
      const thisElemRect = elem.getBoundingClientRect();
      const connectPsn = this.getConnectPsn(thisElemRect, parentOffset);
      
      const elemConnectId = elem.dataset.connectId;
      connectInfo.elemId = elemConnectId;
      connectInfo.posn = connectPsn;
  
      elemsConnectInfos.push(connectInfo);
    });
  
    return elemsConnectInfos;
  }

  // 
  getConnectPsn(elemRect, parentOffset) {
    const xCoord = ((elemRect.left + elemRect.right) / 2) - parentOffset.x;
    const yCoord = ((elemRect.top + elemRect.bottom) / 2) - parentOffset.y;
    const connectCoords = new Vector2(xCoord, yCoord);
  
    return connectCoords;
  }
}