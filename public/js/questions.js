import { FullQuestionsPage } from "./modules/questions/questionsPage/\
sub-classes/fullQuestionsPage.mjs";

import { AutoMode } from "./modules/questions/components/questionsMode/\
sub-classes/qModeWithQueueInput/sub-classes/autoMode.mjs";

import { SearchMode } from "./modules/questions/components/questionsMode/\
sub-classes/qModeWithQueueInput/sub-classes/searchMode.mjs";

import { PrevAnswerMode } from "./modules/questions/components/questionsMode/\
sub-classes/singleAnswerMode/sub-classes/prevAnswerMode.mjs";

import { PreviousAnswers } from "./modules/questions/components/qSource/\
sub-classes/previousAnswers.mjs";



// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// Question mode divs.
const autoQModeDiv = document.querySelector(".auto-mode");
const searchQModeDiv = document.querySelector(".search-mode");
const singleAnswerQModeDiv = document.querySelector(".single-answer-mode");

// Previous answers.
const prevAnswersListDiv = document.querySelector(".prev-answers-list");
const prevAnswersList = new PreviousAnswers(prevAnswersListDiv, 
  categoryTypeName, categoryName);

// Create the question modes.
const autoQMode = new AutoMode(autoQModeDiv, categoryTypeName, categoryName);
const searchQMode = new SearchMode(searchQModeDiv, categoryTypeName, categoryName);
const prevAnswerQMode = new PrevAnswerMode(singleAnswerQModeDiv, 
  prevAnswersList, categoryTypeName, categoryName);

const allQModes = [autoQMode, searchQMode, prevAnswerQMode];

// Create the questions page.
const questionsPage = new FullQuestionsPage(allQModes, categoryTypeName, 
  categoryName);

questionsPage.init();



// Think put these addEventListeners inside a qModeSwitcher object (with the 3 
// buttons at the top) later.

// Event listeners for mode change buttons, maybe put this inside QuestionsPage 
// init method later.
document.querySelector(".auto-queue-mode-btn").addEventListener("click", 
  async () => {
    await questionsPage.switchQMode(autoQMode);
  }
);

document.querySelector(".search-mode-btn").addEventListener("click", 
  async () => {
    await questionsPage.switchQMode(searchQMode);
  }
);

document.querySelector(".prev-answers-mode-btn").addEventListener("click", 
  async () => {
    await questionsPage.switchQMode(prevAnswerQMode);
  }
);



// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPage.setQMode(autoQMode);
}