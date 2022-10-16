import { FindKindredList } from "../modules/findKindred/findKindredList.mjs";
import "./loggedInPage.js";



const mainKindredDiv = document.querySelector(".kindred-list");
const thisKindredList = new FindKindredList(mainKindredDiv);
thisKindredList.init();