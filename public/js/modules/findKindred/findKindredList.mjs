import { fadeContentMixin } from "../../fadeContentMixin.mjs";
import { CategoryCheckboxes } from "../categoryCheckboxes.mjs";



export class FindKindredList {
  _mainDiv;
  _contentDiv;
  #findKindredBtn;
  #categoryCheckboxesArr;
  _loader;

  constructor(mainDiv) {
    this._mainDiv = mainDiv;
    this._contentDiv = mainDiv.querySelector(".content");
    this.#findKindredBtn = document.querySelector(".find-kindred-btn");
    this.#categoryCheckboxesArr = document.querySelectorAll(".category-checkbox");
    this._loader = mainDiv.querySelector(".loader");
  }
  
  init() {
    this.#findKindredBtn.addEventListener("click", () => {
      this.handleUpdateBtnClick()
    });
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
    const categoryCheckboxes = new CategoryCheckboxes(this.#categoryCheckboxesArr);
    const selectedCategoryInfo = categoryCheckboxes.getSelectedCategoryInfo();
  
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

Object.assign(FindKindredList.prototype, fadeContentMixin);