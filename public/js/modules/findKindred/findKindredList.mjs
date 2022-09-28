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

  // Clears content for just headings and hr elem.
  _clearContentDiv() {
    const headings = document.createElement("p");
    headings.textContent = "Profile name - Location - Similarity score - Common answers - Score Diff";
    const hr = document.createElement("hr");
    this._contentDiv.replaceChildren(headings);
    this._contentDiv.appendChild(hr);
  }

  _buildContentDiv(kindredArr) {
    for (let kindred of kindredArr.simRatingList) {
      const kindredRow = this._createRow(kindred);
      this._contentDiv.appendChild(kindredRow);
    };
  }

  _createRow(kindred) {
    const kindredRow = document.createElement("p");
    const loc = kindred.location;

    kindredRow.innerText = `${kindred.profileName} - ${loc.placeName}, \
      ${loc.country.long} - ${kindred.simInfo.simScore.toFixed(1)} - \
      ${kindred.simInfo.numCommonAnswers} - ${kindred.simInfo.scoreDiff.toFixed(1)}`;

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