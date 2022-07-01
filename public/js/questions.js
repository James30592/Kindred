import * as questionsHelper from "./modules/questionsHelper.mjs";

// Questions panel elements.
const panelElems = {
  panelDiv: document.querySelector(".rate-panel"),
  rateBtn: document.querySelector(".rate-btn"),
  skipBtn:document.querySelector(".skip-btn"),
  changeScoreBtns: document.querySelectorAll(".change-score-btn"),
  currQuestionText: document.querySelector(".curr-question"),
  ratingScore: document.querySelector(".rating-score")
};

// Filter info.
const fromDateInput = document.querySelector(".filter-date-from");
const toDateInput = document.querySelector(".filter-date-to");

// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// New questions queue object.
const thisQueue = new questionsHelper.QuestionsQueue(categoryTypeName, 
  categoryName);

// New UI panel object.
const questionsPanel = new questionsHelper.QuestionsUiPanel(panelElems, 
  thisQueue, categoryTypeName, categoryName);

// Add event listeners to the panel buttons.
questionsPanel.init();

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await thisQueue.update(true);
  questionsPanel.displayCurrQ();
};