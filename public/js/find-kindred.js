import { CategoryCheckboxes } from "./modules/categoryCheckboxes.mjs";



const findKindredBtn = document.querySelector(".find-kindred");
const categoryCheckboxesArr = document.querySelectorAll(".category-checkbox");

findKindredBtn.addEventListener("click", findKindred);


async function findKindred(){
  const categoryCheckboxes = new CategoryCheckboxes(categoryCheckboxesArr);
  const selectedCategoryInfo = categoryCheckboxes.getSelectedCategoryInfo();

  const fetchResponse = await fetch("/find-kindred", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(selectedCategoryInfo)
  });
  const kindredList = await fetchResponse.json();


  const element = document.querySelector(".kindred-list");
  element.textContent = "Profile name - Location - Similarity score - Common answers - Perc Diff";
  element.appendChild(document.createElement("hr"));

  kindredList.simRatingList.forEach(function(simRating){
    const para = document.createElement("p");
    const thisText = `${simRating.profileName} - ${simRating.location} - ${simRating.simInfo.simScore.toFixed(1)} - ${simRating.simInfo.numCommonAnswers} - ${simRating.simInfo.percDiff.toFixed(1)}`;
    const node = document.createTextNode(thisText);
    para.appendChild(node);

    element.appendChild(para);
  });
}
