import { getSelectedCategoryInfo } from "../sharedJs/categories.mjs";

const getRecommendationsBtn = document.querySelector(".get-recommendations");
const recommendationsForDiv = document.querySelector(".recommendations-for");
const basedOnDiv = document.querySelector(".based-on");
const recommendationsForCheckboxes = recommendationsForDiv.querySelectorAll(".category-checkbox");
const basedOnCheckboxes = basedOnDiv.querySelectorAll(".category-checkbox");

getRecommendationsBtn.addEventListener("click", getRecommendations);


async function getRecommendations() {
  const recommendationsForCategoryInfo = getSelectedCategoryInfo(recommendationsForCheckboxes);
  const basedOnCategoryInfo = getSelectedCategoryInfo(basedOnCheckboxes);
  const allCategoryInfo = {
    recommendationsFor: recommendationsForCategoryInfo,
    basedOn: basedOnCategoryInfo
  };

  const fetchResponse = await fetch("/recommendations", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(allCategoryInfo)
  });
  const recommendationsList = await fetchResponse.json();

  const element = document.querySelector(".recommendations-list");
  element.textContent = "Estimated liking - Item   -    Category   -   Category Type  - No. of recommends";
  element.appendChild(document.createElement("hr"));

  recommendationsList.recommendList.forEach(recommendation => {
    const para = document.createElement("p");
    const thisText = `${recommendation.rating.strength.toFixed(1)}   -   ${recommendation.qText}    -   ${recommendation.category}  -   ${recommendation.categoryType}  -   ${recommendation.rating.numUsersAnswered}`;
    const node = document.createTextNode(thisText);
    para.appendChild(node);

    element.appendChild(para);
  });
}
