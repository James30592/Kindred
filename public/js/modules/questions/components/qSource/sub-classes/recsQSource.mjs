import { SingleModeQSource } from "../singleModeQSource.mjs";
import { CategoryCheckboxes } from "../../../../categoryCheckboxes.mjs";
import { fadeIn, fadeOut, finishFadeOut, fullyFadeOut, getQInfo } from "../../../../../../sharedJs/utils.mjs";



export class RecsQSource extends SingleModeQSource {
  // Stores the DOM row for the question that is currently being answered.
  #currQRow = null;
  #recForCategoryCheckboxes;
  #basedOnCategoryCheckboxes;
  #loader;

  constructor(listDiv) {
    super(listDiv);

    this.#loader = listDiv.querySelector(".loader");

    const recsForDiv = document.querySelector(".recommendations-for");
    const basedOnDiv = document.querySelector(".based-on");
    const recForCheckboxesArr = recsForDiv.querySelectorAll(".category-checkbox");
    const basedOnCheckboxesArr = basedOnDiv.querySelectorAll(".category-checkbox");
    
    this.#recForCategoryCheckboxes = new CategoryCheckboxes(recForCheckboxesArr);
    this.#basedOnCategoryCheckboxes = new CategoryCheckboxes(basedOnCheckboxesArr);
  }

  // Clear the recommendations list and rebuild with latest recommendations.
  async refreshRecs() {
    const recs = await this._getRecs();
    this.#clearContentDiv();
    this._buildContentDiv(recs.recommendList);
  }

  // Clear the content in the list div.
  #clearContentDiv() {
    this._contentDiv.replaceChildren();
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
    const thisQText = getQInfo(prevAns?.questionDetails, "qSourceDisplayText", 
      this._categoryTypeName, this._categoryName);
    
    return `${rec.rating.strength.toFixed(0)} - ${thisQText} - ${rec.category} - ${rec.categoryType} - ${rec.rating.numUsersAnswered}`;
  }

  _getRateBtnText() {
    return "Rate it!";
  }

  // Set the currQRow to the question that is now being rated, so it can be 
  // easily removed once answered.
  _handleRateBtnClick(evt, question) {
    this.#currQRow  = evt.currentTarget;
    super._handleRateBtnClick(evt, question);
  }

  // Remove the newly answered question from the recommendations list.
  removeAnsweredQ() {
    this._contentDiv.removeChild(this.#currQRow);
  }

  _getScoreText(rec) {
    return rec.rating.strength.toFixed(0);
  }

  async showLoader() {
    await fullyFadeOut(this._contentDiv);
    fadeIn(this.#loader);
  }

  async hideLoader() {
    await fullyFadeOut(this.#loader);
    fadeIn(this._contentDiv);
  }
}