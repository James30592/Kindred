import { Vector2 } from "../../vector2.mjs";
import { SingleConnection } from "./singleConnection.mjs";



// SVG image of connections between DOM nodes in artistic curve style, includes 
// drawing animation.
// data-connects-to should always be written on the element that the connection 
// should start from (for animated drawing purposes).
export class ConnectionsSvg {
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
    
    const parentOffset = new Vector2(parentElemRect.left, parentElemRect.top);
  
    const viewBoxWidth = parentElemRect.width;
    const viewBoxHeight = parentElemRect.height;
  
    const connectElemDetails = this.#getConnectElemDetails(elems, parentOffset);
    const connectionInfos = this.#getConnectionInfos(connectElemDetails);
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
    svg.classList.add("connections-svg");
    svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("preserveAspectRatio", "none");
    
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
      const connection = new SingleConnection(connectionInfo);
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
    const connectCoords = new Vector2(xCoord, yCoord);
  
    return connectCoords;
  }
}