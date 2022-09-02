import { fadeIn, finishFadeIn, fullyFadeOut } from "../sharedJs/utils.mjs";
import { CategoryCheckboxes } from "./modules/categoryCheckboxes.mjs";





class FindKindredList {
  mainDiv;
  contentDiv;
  findKindredBtn;
  categoryCheckboxesArr;
  loader;

  constructor(mainDiv) {
    this.mainDiv = mainDiv;
    this.contentDiv = mainDiv.querySelector(".content");
    this.findKindredBtn = document.querySelector(".find-kindred-btn");
    this.categoryCheckboxesArr = document.querySelectorAll(".category-checkbox");
    this.loader = mainDiv.querySelector(".loader");
  }
  
  init() {
    this.findKindredBtn.addEventListener("click", () => {
      this.handleFindKindredClick()
    });
  }

  async handleFindKindredClick() {
    const loaderShown = new Promise(async resolve => {
      await this.showLoader();
      resolve();
    });
    
    const kindredUpdated = new Promise(async resolve => {
      const kindred = await this.findKindred();
      // Only rebuild content div once new kindred have been received AND loader 
      // has finished fading in / content div has finished fading out (otherwise 
      //   this content appears immediately before content div has faded out).
      loaderShown.then(() => {
        this.rebuildContentDiv(kindred);
        resolve();
      });
    });

    // Don't hide the loader / show the content until both the loader has 
    // finished faded in AND the recommendations have been updated.
    Promise.all([loaderShown, kindredUpdated]).then(() => {
      this.hideLoader();
    });
  }

  rebuildContentDiv(kindred) {
    this.clearContentDiv();
    this.buildContentDiv(kindred);
  }

  // Clears content for just headings and hr elem.
  clearContentDiv() {
    const headings = document.createElement("p");
    headings.textContent = "Profile name - Location - Similarity score - Common answers - Perc Diff";
    const hr = document.createElement("hr");
    this.contentDiv.replaceChildren(headings);
    this.contentDiv.appendChild(hr);
  }

  buildContentDiv(kindredArr) {
    for (let kindred of kindredArr.simRatingList) {
      const kindredRow = this.createRow(kindred);
      this.contentDiv.appendChild(kindredRow);
    };
  }

  createRow(kindred) {
    const kindredRow = document.createElement("p");
    const loc = kindred.location;

    kindredRow.innerText = `${kindred.profileName} - ${loc.placeName}, \
      ${loc.country.long} - ${kindred.simInfo.simScore.toFixed(1)} - \
      ${kindred.simInfo.numCommonAnswers} - ${kindred.simInfo.percDiff.toFixed(1)}`;

    return kindredRow;
  }

  async findKindred() {
    const categoryCheckboxes = new CategoryCheckboxes(this.categoryCheckboxesArr);
    const selectedCategoryInfo = categoryCheckboxes.getSelectedCategoryInfo();
  
    const fetchResponse = await fetch("/find-kindred", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(selectedCategoryInfo)
    });
  
    const kindredList = await fetchResponse.json();
  
    return kindredList;  
  }

  async showLoader() {
    await fullyFadeOut(this.contentDiv);
    fadeIn(this.loader);
    await finishFadeIn(this.loader);
  }

  async hideLoader() {
    await fullyFadeOut(this.loader);
    fadeIn(this.contentDiv);
  }
}







const mainKindredDiv = document.querySelector(".kindred-list");
const thisKindredList = new FindKindredList(mainKindredDiv);
thisKindredList.init();