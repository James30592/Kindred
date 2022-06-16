const nextQuestionBtn = document.querySelector(".next-question-btn");
const prevQuestionBtn = document.querySelector(".prev-question-btn");
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

nextQuestionBtn.addEventListener("click", getNewQuestion());

const questionsQueue = [];

async function getNewQuestion() {

  let filterInfo = {
    fromDate
    toDate
    genres
  };


  const fetchResponse = await fetch(`/questions/${categoryTypeName}/${categoryName}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(allCategoryInfo)
  });
  const newQuestion = await fetchResponse.json();
}



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
