import { ConnectionsSvg } from "../modules/drawSvgs/connectionsSvg/connectionsSvg.mjs";
import "./loggedInPage.js";



const elemsToJoin = document.querySelectorAll(".connect-elem");
const connectionsSvg = new ConnectionsSvg(elemsToJoin);

window.addEventListener("load", () => {
  connectionsSvg.createAndDraw();
});