import { FullQuestionsPage } from "../modules/questions/questionsPage/sub-classes/fullQuestionsPage.mjs";
import { AutoMode } from "../modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/autoMode.mjs";
import { SearchMode } from "../modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/searchMode.mjs";
import { PrevAnswerMode } from "../modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/prevAnswerMode.mjs";
import { PreviousAnswers } from "../modules/questions/components/qSource/sub-classes/previousAnswers.mjs";
import "./loggedInPage.js";



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

  // Question mode buttons.
const autoModeBtn = document.querySelector(".auto-queue-mode-btn");
const searchModeBtn = document.querySelector(".search-mode-btn");
const prevAnswersModeBtn = document.querySelector(".prev-answers-mode-btn");

// Create the question modes.
const autoQMode = new AutoMode(autoQModeDiv, categoryTypeName, categoryName, autoModeBtn);
const searchQMode = new SearchMode(searchQModeDiv, categoryTypeName, categoryName, searchModeBtn);
const prevAnswerQMode = new PrevAnswerMode(singleAnswerQModeDiv, 
  prevAnswersList, categoryTypeName, categoryName, prevAnswersModeBtn);

const allQModes = [autoQMode, searchQMode, prevAnswerQMode];

// Create the questions mode switcher.
const qModeSwitcher = [
  {mode: autoQMode, btn: autoModeBtn},
  {mode: searchQMode, btn: searchModeBtn},
  {mode: prevAnswerQMode, btn: prevAnswersModeBtn}
];

// Create the questions page.
const questionsPage = new FullQuestionsPage(allQModes, qModeSwitcher, 
  categoryTypeName, categoryName);

questionsPage.init();

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPage.setQMode(autoQMode);
}