import { SingleModeQSource } from "../singleModeQSource.mjs";

import { CategoryCheckboxes } from "../../../../categoryCheckboxes.mjs";



export class RecsQSource extends SingleModeQSource {
  // Stores the DOM row for the question that is currently being answered.
  #currQRow = null;
  #getRecsBtn;
  #recForCategoryCheckboxes;
  #basedOnCategoryCheckboxes;

  constructor(listDiv) {
    super(listDiv);
    this.#getRecsBtn = document.querySelector(".get-recommendations");

    const recsForDiv = document.querySelector(".recommendations-for");
    const basedOnDiv = document.querySelector(".based-on");
    const recForCheckboxesArr = recsForDiv.querySelectorAll(".category-checkbox");
    const basedOnCheckboxesArr = basedOnDiv.querySelectorAll(".category-checkbox");
    
    this.#recForCategoryCheckboxes = new CategoryCheckboxes(recForCheckboxesArr);
    this.#basedOnCategoryCheckboxes = new CategoryCheckboxes(basedOnCheckboxesArr);
  }

  init() {
    this.#getRecsBtn.addEventListener("click", () => {
      this.#refreshRecs();
    });
  }

  // Clear the recommendations list and rebuild with latest recommendations.
  async #refreshRecs() {
    const recs = await this._getRecs();
    this.#clearListDiv();
    this._buildListDiv(recs.recommendList);
  }

  // Clear the content in the list div.
  #clearListDiv() {
    this._listDiv.textContent = "Estimated liking - Item - Category - Category Type - No. of recommends";
    this._listDiv.appendChild(document.createElement("hr"));
  }

  // Get the latest recommendations from the back end.
  async _getRecs() {
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
    
    return await fetchResponse.json();
  }

  _getQText(rec) {
    const thisQText = this._getAnswerDisplayText(rec?.questionDetails, 
      rec.categoryType, rec.category);
    
    return `${rec.rating.strength.toFixed(0)} - ${thisQText} - ${rec.category} - ${rec.categoryType} - ${rec.rating.numUsersAnswered}`;
  }

  _getRateBtnText() {
    return "Rate it!";
  }

  // Set the currQRow to the question that is now being rated, so it can be 
  // easily removed once answered.
  _handleRateBtnClick(evt, question) {
    this.#currQRow  = evt.currentTarget.parentNode;
    super._handleRateBtnClick(evt, question);
  }

  // Remove the newly answered question from the recommendations list.
  removeAnsweredQ() {
    this._listDiv.removeChild(this.#currQRow);
  }
}