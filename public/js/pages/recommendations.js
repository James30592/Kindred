import { RecommendationsMode } from "../modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/recommendationsMode.mjs";
import { RecsQSource } from "../modules/questions/components/qSource/sub-classes/recsQSource.mjs";
import { RecsQuestionsPage } from "../modules/questions/questionsPage/sub-classes/recsQuestionsPage.mjs";
import { InfoBtns } from "../modules/infoBtns.mjs";



const singleAnswerQModeDiv = document.querySelector(".single-answer-mode");

const recommendationsListDiv = document.querySelector(".recommendations-list");
const recommendationsList = new RecsQSource(recommendationsListDiv);

const recommendationsMode = new RecommendationsMode(singleAnswerQModeDiv, 
  recommendationsList);

// Create the questions page.
const questionsPage = new RecsQuestionsPage([recommendationsMode]);

questionsPage.init();

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPage.setQMode(recommendationsMode);
}

const infoBtns = new InfoBtns();
infoBtns.init();