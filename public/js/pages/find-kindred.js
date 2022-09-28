import { FindKindredList } from "../modules/findKindred/findKindredList.mjs";
import { InfoBtns } from "../modules/infoBtns.mjs";



const mainKindredDiv = document.querySelector(".kindred-list");
const thisKindredList = new FindKindredList(mainKindredDiv);
thisKindredList.init();

const infoBtns = new InfoBtns();
infoBtns.init();