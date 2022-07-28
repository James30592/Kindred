import { FullQuestionsPage } from "./modules/questions/questionsPage.mjs";
import { AutoMode } from "./modules/questions/components/questionsMode.mjs";
import { SearchMode } from "./modules/questions/components/questionsMode.mjs";
import { SingleAnswerMode } from "./modules/questions/components/questionsMode.mjs";
import { PreviousAnswers } from "./modules/questions/components/previousAnswers.mjs";



// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// Question mode divs.
const autoQModeDiv = document.querySelector(".auto-mode");
const searchQModeDiv = document.querySelector(".search-mode");
const singleAnswerQModeDiv = document.querySelector(".single-answer-mode");

// Create the question modes.
const autoQMode = new AutoMode(autoQModeDiv, categoryTypeName, categoryName);
const searchQMode = new SearchMode(searchQModeDiv, categoryTypeName, categoryName);
const singleAnswerQMode = new SingleAnswerMode(singleAnswerQModeDiv, 
  categoryTypeName, categoryName);

const allQModes = [autoQMode, searchQMode, singleAnswerQMode];

// Previous answers.
const prevAnswersListDiv = document.querySelector(".prev-answers-list");
const prevAnswersList = new PreviousAnswers(prevAnswersListDiv, 
  categoryTypeName, categoryName);

// Create the questions page.
const questionsPage = new FullQuestionsPage(allQModes, prevAnswersList, 
  categoryTypeName, categoryName);

questionsPage.init();

// Event listeners for mode change buttons, maybe put this inside QuestionsPage 
// init method later.
document.querySelector(".auto-queue-mode-btn").addEventListener("click", 
  async () => {
    await questionsPage.switchQMode(autoQMode);
    questionsPage.deactivatePrevAnsList();
  }
);

document.querySelector(".search-mode-btn").addEventListener("click", 
  async () => {
    await questionsPage.switchQMode(searchQMode);
    questionsPage.deactivatePrevAnsList();
  }
);

document.querySelector(".prev-answers-mode-btn").addEventListener("click", 
  async () => {
    await questionsPage.switchQMode(singleAnswerQMode);
    await questionsPage.activatePrevAnsList();
  }
);

// On page load, update the questions queue and show the first question.
window.onload = async () => await questionsPage.setQMode(autoQMode);