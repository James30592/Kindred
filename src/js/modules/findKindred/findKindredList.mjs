import { kindredRecsMixin } from "../kindredRecsMixin.mjs";
import { CategoryCheckboxes } from "../categoryCheckboxes.mjs";



export class FindKindredList {
  _mainDiv;
  _contentDiv;
  #findKindredBtn;
  #categoryCheckboxes;
  _loader;

  static #INVALID_SELECTS_MSG = `At least one category must be selected.`;

  constructor(mainDiv) {
    this._mainDiv = mainDiv;
    this._contentDiv = mainDiv.querySelector(".content");
    this.#findKindredBtn = document.querySelector(".find-kindred-btn");

    const domCatCheckboxes = document.querySelectorAll(".category-checkbox");
    this.#categoryCheckboxes = new CategoryCheckboxes(domCatCheckboxes);

    this._loader = mainDiv.querySelector(".loader");
  }
  
  init() {
    this.#findKindredBtn.addEventListener("click", () => {
      this.validateHandleUpdate(this._contentDiv, 
        FindKindredList.#INVALID_SELECTS_MSG);
    });
  }

  // Ensure at least one checkbox is selected for Rec for and Based on Groups.
  _validateSelections() {
    const numCats = this.#categoryCheckboxes.getNumSelected();
    return (numCats > 0);
  }

  _buildContentDiv(simRatingList) {
    for (let kindred of simRatingList) {
      const kindredRow = this._createRow(kindred);
      this._contentDiv.appendChild(kindredRow);
    };
  }

  _createRow(kindred) {   
    const kindredRow = document.createElement("div");
    kindredRow.classList.add("kindred-item");

    const simScore = document.createElement("p");
    const username = document.createElement("p");
    const loc = document.createElement("p");
    const posDiff = document.createElement("p");

    simScore.innerText = kindred.simInfo.simScore.toFixed(1);
    username.innerText = kindred.profileName;
    loc.innerText = `${kindred.location.placeName}, ${kindred.location.country.long}`;
    posDiff.innerText = kindred.simInfo.scoreDiff.toFixed(1);

    simScore.classList.add("sim-score");

    kindredRow.append(simScore, username, loc, posDiff);

    return kindredRow;
  }

  async _findKindred() {
    const selectedCategoryInfo = this.#categoryCheckboxes.getSelectedCategoryInfo();
  
    const fetchResponse = await fetch("/find-kindred", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(selectedCategoryInfo)
    });
  
    const kindredList = await fetchResponse.json();
  
    return kindredList;  
  }

  // Used by the mixin to get latest kindred.
  async _getUpdatedSourceData() {
    return await this._findKindred();  
  }
}

Object.assign(FindKindredList.prototype, kindredRecsMixin);