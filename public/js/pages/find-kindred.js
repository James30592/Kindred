import { FindKindredList } from "../modules/findKindred/findKindredList.mjs";



const mainKindredDiv = document.querySelector(".kindred-list");
const thisKindredList = new FindKindredList(mainKindredDiv);
thisKindredList.init();