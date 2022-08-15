import { CategoryCheckboxes } from "./modules/categoryCheckboxes.mjs";

import { SingleAnswerMode } from "./modules/questions/components/questionsMode/\
sub-classes/singleAnswerMode/singleAnswerMode.mjs";

import { SingleModeQSource } from "./modules/questions/components/qSource/\
singleModeQSource/singleModeQSource.mjs";

import { QuestionsPage } from "./modules/questions/questionsPage/\
questionsPage.mjs";



const getRecommendationsBtn = document.querySelector(".get-recommendations");
const recommendationsForDiv = document.querySelector(".recommendations-for");
const basedOnDiv = document.querySelector(".based-on");
const recForCheckboxesArr = recommendationsForDiv.querySelectorAll(".category-checkbox");
const basedOnCheckboxesArr = basedOnDiv.querySelectorAll(".category-checkbox");

getRecommendationsBtn.addEventListener("click", getRecommendations);






const singleAnswerQModeDiv = document.querySelector(".single-answer-mode");

const recommendationsListDiv = document.querySelector(".recommendations-list");
const recommendationsList = new SingleModeQSource(recommendationsListDiv);

const singleAnswerQMode = new SingleAnswerMode(singleAnswerQModeDiv, 
  recommendationsList);

// Create the questions page.
const questionsPage = new QuestionsPage(allQModes, categoryTypeName, 
  categoryName);

questionsPage.init();

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPage.setQMode(singleAnswerQMode);
}






async function getRecommendations() {  
  const recForCategoryCheckboxes = new CategoryCheckboxes(recForCheckboxesArr);
  const basedOnCategoryCheckboxes = new CategoryCheckboxes(basedOnCheckboxesArr);
  const recForCategoryInfo = recForCategoryCheckboxes.getSelectedCategoryInfo();
  const basedOnCategoryInfo = basedOnCategoryCheckboxes.getSelectedCategoryInfo();

  const allCategoryInfo = {
    recommendationsFor: recForCategoryInfo,
    basedOn: basedOnCategoryInfo
  };

  const fetchResponse = await fetch("/recommendations", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(allCategoryInfo)
  });
  const recommendationsList = await fetchResponse.json();

  const element = document.querySelector(".recommendations-list");
  element.textContent = "Estimated liking - Item - Category - Category Type - No. of recommends";
  element.appendChild(document.createElement("hr"));

  recommendationsList.recommendList.forEach(recommendation => {
    const para = document.createElement("p");
    const thisText = `${recommendation.rating.strength.toFixed(1)} - ${recommendation.qDetails.title} - ${recommendation.category} - ${recommendation.categoryType} - ${recommendation.rating.numUsersAnswered}`;
    const node = document.createTextNode(thisText);
    para.appendChild(node);

    element.appendChild(para);
  });
}