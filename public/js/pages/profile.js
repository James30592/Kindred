import { ConnectionsSvg } from "../modules/drawSvgs/connectionsSvg/connectionsSvg.mjs";



const elemsToJoin = document.querySelectorAll(".connect-elem");
const connectionsSvg = new ConnectionsSvg(elemsToJoin);

window.addEventListener("load", () => {
  connectionsSvg.createAndDraw();
});