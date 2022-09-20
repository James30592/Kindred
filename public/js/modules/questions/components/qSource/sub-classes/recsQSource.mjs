import { SingleModeQSource } from "../singleModeQSource.mjs";
import { CategoryCheckboxes } from "../../../../categoryCheckboxes.mjs";
import { getQInfo } from "../../../questionsHelpers.mjs";
import { fadeContentMixin } from "../../../../fadeContentMixin.mjs";



export class RecsQSource extends SingleModeQSource {
  // Stores the DOM row for the question that is currently being answered.
  #currQRow = null;
  #recForCategoryCheckboxes;
  #basedOnCategoryCheckboxes;
  _loader;
  #getRecsBtn;
  _qDivClass = "rec-item";

  constructor(listDiv) {
    super(listDiv);

    this._loader = listDiv.querySelector(".loader");

    const recsForDiv = document.querySelector(".recommendations-for");
    const basedOnDiv = document.querySelector(".based-on");
    const recForCheckboxesArr = recsForDiv.querySelectorAll(".category-checkbox");
    const basedOnCheckboxesArr = basedOnDiv.querySelectorAll(".category-checkbox");
    
    this.#recForCategoryCheckboxes = new CategoryCheckboxes(recForCheckboxesArr);
    this.#basedOnCategoryCheckboxes = new CategoryCheckboxes(basedOnCheckboxesArr);

    this.#getRecsBtn = document.querySelector(".get-recommendations");

    this.#getRecsBtn.addEventListener("click", async () => {
      this.handleUpdateBtnClick();
    });
  }

  _addToQDiv(qInfo) {
    qInfo.qSourceItem.appendChild(qInfo.qText);
    qInfo.qSourceItem.insertBefore(qInfo.qScore, qInfo.qSourceItem.children[0]);

    const catTypeText = document.createElement("span");
    const catText = document.createElement("span");

    [catTypeText.innerText, catText.innerText] = [qInfo.catTypeName, qInfo.catName];

    qInfo.qSourceItem.appendChild(catTypeText);
    qInfo.qSourceItem.appendChild(catText);

    return qInfo.qSourceItem;
  }

  // Clear the content in the list div.
  _clearContentDiv() {
    this._contentDiv.replaceChildren();
  }

  // Get the latest recommendations from the back end.
  async getRecs() {
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
    
    const recsInfo = await fetchResponse.json();
    return recsInfo.recommendList;
  }

  _getQText(rec) {
    const thisQText = getQInfo(prevAns?.questionDetails, "qSourceDisplayText", 
      this._categoryTypeName, this._categoryName);
    
    return `${rec.rating.strength.toFixed(0)} - ${thisQText} - ${rec.category} - ${rec.categoryType} - ${rec.rating.numUsersAnswered}`;
  }

  // Set the currQRow to the question that is now being rated, so it can be 
  // easily removed once answered.
  _handleRateBtnClick(evt, question) {
    this.#currQRow  = evt.currentTarget.parentNode;
    super._handleRateBtnClick(evt, question);
  }

  // Remove the newly answered question from the recommendations list.
  removeAnsweredQ() {
    this._contentDiv.removeChild(this.#currQRow);
  }

  _getScoreText(rec) {
    return rec.rating.strength.toFixed(1);
  }
  
  // POSTS any new answers then gets the latest recommendations.
  async #getLatestRecs() {
    this.dispatchEvent(new CustomEvent(`getRecsClick`));

    // Wait for post answers to complete before refreshing recommendations.
    await new Promise(resolve => {
      this.addEventListener('postAnswersComplete', resolve(), {once: true});
    });

    const latestRecs = await this.getRecs();
    return latestRecs;
  }

  // Used by the mixin to get latest recommendations.
  async _getUpdatedSourceData() {
    return await this.#getLatestRecs();
  }
}

Object.assign(RecsQSource.prototype, fadeContentMixin);