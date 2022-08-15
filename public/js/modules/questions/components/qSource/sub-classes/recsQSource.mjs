import { SingleModeQSource } from "../singleModeQSource.mjs";

import { CategoryCheckboxes } from "../../../../categoryCheckboxes.mjs";



export class RecsQSource extends SingleModeQSource {
  // Stores the DOM row for the question that is currently being answered.
  #currQRow = null;
  #getRecsBtn;
  #recForDiv;
  #basedOnDiv;
  #recForCategoryCheckboxes;
  #basedOnCategoryCheckboxes;

  constructor() {
    super();
    this.#getRecsBtn = document.querySelector(".get-recommendations");
    this.#recommendationsForDiv = document.querySelector(".recommendations-for");
    this.#basedOnDiv = document.querySelector(".based-on");

    const recForCheckboxesArr = recommendationsForDiv.querySelectorAll(".category-checkbox");
    const basedOnCheckboxesArr = basedOnDiv.querySelectorAll(".category-checkbox");
    this.#recForCategoryCheckboxes = new CategoryCheckboxes(recForCheckboxesArr);
    this.#basedOnCategoryCheckboxes = new CategoryCheckboxes(basedOnCheckboxesArr);
  }

  init() {
    this.#getRecsBtn.addEventListener("click", this._getRecs);
  }

  // 
  async _getRecs() {
    this.#buildListDiv();

    // ............


    
    const recForCategoryInfo = this.#recForCategoryCheckboxes.getSelectedCategoryInfo();
    const basedOnCategoryInfo = this.#basedOnCategoryCheckboxes.getSelectedCategoryInfo();

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

    this._listDiv.textContent = "Estimated liking - Item - Category - Category Type - No. of recommends";
    this._listDiv.appendChild(document.createElement("hr"));

    recommendationsList.recommendList.forEach(recommendation => {
      const para = document.createElement("p");
      const thisText = `${recommendation.rating.strength.toFixed(1)} - ${recommendation.qDetails.title} - ${recommendation.category} - ${recommendation.categoryType} - ${recommendation.rating.numUsersAnswered}`;
      const node = document.createTextNode(thisText);
      para.appendChild(node);

      this._listDiv.appendChild(para);
    });
  }

  _getQText(rec) {
    const thisQText = this._getAnswerDisplayText(rec?.questionDetails, 
      rec.categoryType, rec.category);
    
    return `${rec.rating.strength.toFixed(1)} - ${thisQText} - ${rec.category} - ${rec.categoryType} - ${rec.rating.numUsersAnswered}`;
  }

  _getRateBtnText() {
    return "Rate it!";
  }

  // Set the currQRow to the question that is now being rated, so it can be 
  // easily removed once answered.
  _handleRateBtnClick(evt) {
    this.currQuestion = evt.currentTarget.parentNode;
    super._handleRateBtnClick(evt);
  }

  // Remove the newly answered question from the recommendations list.
  removeAnsweredQ() {
    this._listDiv.removeChild(this.#currQRow);
  }
}