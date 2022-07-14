import * as questionsQueue from "./modules/questions/questionsQueue.mjs";
import { QuestionsUiPanel } from "./modules/questions/QuestionsUiPanel.mjs";


// Questions panel elements.
const panelElems = {
  panelDiv: document.querySelector(".rate-panel"),
  rateBtn: document.querySelector(".rate-btn"),
  skipBtn:document.querySelector(".skip-btn"),
  changeScoreBtns: document.querySelectorAll(".change-score-btn"),
  currQuestionText: document.querySelector(".curr-question"),
  ratingScore: document.querySelector(".rating-score"),
  prevAnsDiv: document.querySelector(".prev-ans-info"),
  prevAnsVal: document.querySelector(".prev-ans-val")
};

// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// New auto questions and search questions queue objects.
const autoQueue = new questionsQueue.AutoQuestionsQueue(categoryTypeName, 
  categoryName);
const searchQueue = new questionsQueue.SearchQuestionsQueue(categoryTypeName, 
  categoryName);

// Input panels for each questions mode.
const autoQueuePanel = document.querySelector(".auto-queue-panel");
const searchQueuePanel = document.querySelector(".search-queue-panel");

// New UI panel object.
const questionsPanel = new QuestionsUiPanel(panelElems, categoryTypeName, 
  categoryName);

// Add event listeners to the panel buttons.
questionsPanel.init();

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPanel.changeQueue(autoQueue, true);
};




// tidy up later...
document.querySelector(".auto-queue").addEventListener("click", async () => {
  await questionsPanel.changeQueue(autoQueue);
})

document.querySelector(".search").addEventListener("click", async () => {
  await questionsPanel.changeQueue(searchQueue);
})




document.querySelector(".search-btn").addEventListener("click", async () => {
  const currSearchTerm = document.querySelector(".search-term").value;
  await questionsPanel.newSearch(currSearchTerm);
})