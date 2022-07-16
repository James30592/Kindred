import { QuestionsPage } from "./modules/questions/questionsPage.mjs";
import { AutoMode } from "./modules/questions/questionsMode.mjs";
import { SearchMode } from "./modules/questions/questionsMode.mjs";



// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// Create the search modes.
const autoQModeDiv = document.querySelector(".auto-mode");
const searchQModeDiv = document.querySelector(".search-mode");
const autoQMode = new AutoMode(autoQModeDiv, categoryTypeName, categoryName);
const searchQMode = new SearchMode(searchQModeDiv, categoryTypeName, categoryName);
const allQModes = [autoQMode, searchQMode];

// Create the search page.
const questionsPage = new QuestionsPage(allQModes, categoryTypeName, categoryName);
questionsPage.init();

// Event listeners for mode change buttons, maybe put this inside QuestionsPage 
// init method later.
document.querySelector(".auto-queue-mode-btn").addEventListener("click", async () => {
  await questionsPage.switchQMode(autoQMode);
});
document.querySelector(".search-mode-btn").addEventListener("click", async () => {
  await questionsPage.switchQMode(searchQMode);
});

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPage.setQMode(autoQMode);
};





// ------------------------------------------------------------------------------------------------






// import * as questionsQueue from "./modules/questions/questionsQueue.mjs";
// import { QuestionsUiPanel } from "./modules/questions/QuestionsUiPanel.mjs";


// // Questions panel elements.
// const panelElems = {
//   panelDiv: document.querySelector(".rate-panel"),
//   rateBtn: document.querySelector(".rate-btn"),
//   skipBtn:document.querySelector(".skip-btn"),
//   changeScoreBtns: document.querySelectorAll(".change-score-btn"),
//   currQuestionText: document.querySelector(".curr-question"),
//   ratingScore: document.querySelector(".rating-score"),
//   prevAnsDiv: document.querySelector(".prev-ans-info"),
//   prevAnsVal: document.querySelector(".prev-ans-val")
// };

// // Current category info.
// // const mainHeader = document.querySelector(".main-header");
// // const categoryTypeName = mainHeader.dataset.catType;
// // const categoryName = mainHeader.dataset.cat;

// // New auto questions and search questions queue objects.
// const autoQueue = new questionsQueue.AutoQuestionsQueue(categoryTypeName, 
//   categoryName);
// const searchQueue = new questionsQueue.SearchQuestionsQueue(categoryTypeName, 
//   categoryName);

// // Input panels for each questions mode.
// const autoQueuePanel = document.querySelector(".auto-queue-panel");
// const searchQueuePanel = document.querySelector(".search-queue-panel");

// // New UI panel object.
// const questionsPanel = new QuestionsUiPanel(panelElems, categoryTypeName, 
//   categoryName);

// // Add event listeners to the panel buttons.
// questionsPanel.init();

// // On page load, update the questions queue and show the first question.
// window.onload = async () => {
//   searchQueuePanel.style.display = "none";
//   await questionsPanel.changeMode(autoQueue, autoQueuePanel, true);
// };




// // tidy up later...
// document.querySelector(".auto-queue").addEventListener("click", async () => {
//   await questionsPanel.changeMode(autoQueue, autoQueuePanel);
// })

// document.querySelector(".search").addEventListener("click", async () => {
//   await questionsPanel.changeMode(searchQueue, searchQueuePanel);
// })




// document.querySelector(".search-btn").addEventListener("click", async () => {
//   const currSearchTerm = document.querySelector(".search-term").value;
//   await questionsPanel.newSearch(currSearchTerm);
// })