import { Vector2 } from "../vector2.mjs";
import { SingleConnection } from "./singleConnection.mjs";


// 
// data-connects-to should always be written on the element that the connection 
// should start from (for animated drawing purposes).
export class ConnectionsSvg {
  elemsToJoin;
  connectPts;
  connections = [];
  svg;
  #drawOriginId;

  constructor(elemsToJoin) {
    this.elemsToJoin = elemsToJoin;
  }

  // 
  createAndDraw() {
    this.svg = this.createSvg(this.elemsToJoin);
    this.startDrawing();
  }

  // Hide all the paths, add event listeners for when a connection has finished 
  // drawing to start drawing subsequent ones and start drawing from the origin element.
  startDrawing() {
    this.connections.forEach(connection => {
      connection.hidePaths();
      connection.addEventListener("connectionDrawn", evt => {
        this.draw(evt.detail.endId);
      });
    });

    this.draw(this.#drawOriginId);
  }

  // Draws all the connections that start from a given elemend id.
  // justConnectedId is the element Id (from the data attribute) of the element 
  // that has just finished having a connection drawn to it.
  draw(justConnectedId) {
    this.connections.forEach(connection => {
      if (connection.startId === justConnectedId) {
        connection.draw();
      };
    });
  }

  // 
  createSvg(elems) {
    const parentElem = document.querySelector(".svg-connects-wrapper");
    const parentElemRect = parentElem.getBoundingClientRect();

    const originElem = parentElem.querySelector('[data-draw-origin="true"');
    this.#drawOriginId = originElem.dataset.connectId;
    
    const parentOffset = new Vector2(parentElemRect.left, parentElemRect.top);
  
    const viewBoxWidth = parentElemRect.width;
    const viewBoxHeight = parentElemRect.height;
  
    const elemsConnectInfos = this.getElemConnectInfos(elems, parentOffset);
    const connectionInfos = this.getConnectionInfos(elemsConnectInfos);
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
    svg.classList.add("connections-svg");
    svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("preserveAspectRatio", "none");
    
    this.createConnections(connectionInfos);
    this.createSvgPaths(svg);

    parentElem.appendChild(svg);
    return svg;
  }

  // 
  createSvgPaths(svg) {
    this.connections.forEach(connection => {
      svg.append(...connection.pathElems);
    });
  }

  // Create a connections object for each coords pair and add set the paths for 
  // each connection.
  createConnections(connectionInfos) {
    connectionInfos.forEach(connectionInfo => {
      const connection = new SingleConnection(connectionInfo);
      connection.createPaths();
      this.connections.push(connection);
    });
  }

  // 
  getConnectionInfos(elemsConnectInfos) {
    const connectionInfos = [];

    elemsConnectInfos.forEach(elem => {
      elem?.connectsTo?.forEach((connection, idx) => {
        const startCoords = elem.posn;
        const endConnectElem = elemsConnectInfos.find(elem => {
          return elem.elemId === connection;
        });

        const endCoords = endConnectElem.posn;
        const connectCoords = [startCoords, endCoords];
        // const connectPriority = Number(elem?.connectsPriorities[idx]);
        const elemIds = [elem.elemId, connection];
        const connectionInfo = {coords: connectCoords, elemIds: elemIds};
        // const connectionInfo = {coords: connectCoords, priorities: connectPriority};

        connectionInfos.push(connectionInfo);
      });
    });

    return connectionInfos;
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
      connectInfo.connectsTo = elem.dataset?.connectsTo?.split(",");
      // connectInfo.connectsPriorities = elem.dataset?.connectsPriorities?.split(",");
  
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