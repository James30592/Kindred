import { SingleModeQSource } from "../singleModeQSource.mjs";
import { CategoryCheckboxes } from "../../../../categoryCheckboxes.mjs";
import { kindredRecsMixin } from "../../../../kindredRecsMixin.mjs";



export class RecsQSource extends SingleModeQSource {
  // Stores the DOM row for the question that is currently being answered.
  #currQRow = null;
  #recForCategoryCheckboxes;
  #basedOnCategoryCheckboxes;
  #getRecsBtn;
  _loader;
  _qDivClass = "rec-item";

  static #INVALID_SELECTS_MSG = `At least one category must be selected from each of the "Recommend for" and "Based on" groups.`;
  static #NO_KINDRED_MSG = ["You're one of a kind!", "We couldn't find anyone similar enough to you for the selected categories. Try a different selection or answer more questions."];
  static #KINDRED_NO_RECS_MSG = ["No recommendations!", "Your Kindred spirits for the categories selected have nothing to recommend you that you haven't rated already! Try a different selection."];

  constructor(listDiv) {
    super(listDiv);

    this._loader = listDiv.querySelector(".loader");

    const recsForDiv = document.querySelector(".recommendations-for");
    const basedOnDiv = document.querySelector(".based-on");
    const recForCheckboxesArr = recsForDiv.querySelectorAll(".category-checkbox");
    const basedOnCheckboxesArr = basedOnDiv.querySelectorAll(".category-checkbox");
    
    this.#recForCategoryCheckboxes = new CategoryCheckboxes(recForCheckboxesArr);
    this.#basedOnCategoryCheckboxes = new CategoryCheckboxes(basedOnCheckboxesArr);

    this.#getRecsBtn = document.querySelector(".get-recs-btn");

    this.#getRecsBtn.addEventListener("click", () => {
      this.validateHandleUpdate(this._listDiv, RecsQSource.#INVALID_SELECTS_MSG);
    });
  }

  // Builds the content div with all the questions.
  _buildContentDiv(recsInfo) {
    if (recsInfo.numKindred > 0) {
      if (recsInfo.recommendList.length > 0) {
        super._buildContentDiv(recsInfo.recommendList);
      }
      else {
        this.#setNoRecsMsg(RecsQSource.#KINDRED_NO_RECS_MSG);
      };
    }
    else {
      this.#setNoRecsMsg(RecsQSource.#NO_KINDRED_MSG);
    };
  }

  // Sets a message in the recommendations list for why no recommendations were found.
  #setNoRecsMsg(msgInfo) {
    const noRecsMsgDiv = document.createElement("div");
    const noRecsHeader = document.createElement("h5");
    const noRecsTxt = document.createElement("p");

    noRecsHeader.innerText = msgInfo[0];
    noRecsTxt.innerText = msgInfo[1];
    
    noRecsMsgDiv.appendChild(noRecsHeader);
    noRecsMsgDiv.appendChild(noRecsTxt);

    noRecsMsgDiv.classList.add("no-recs-msg");
    this._contentDiv.appendChild(noRecsMsgDiv);
  }

  // Ensure at least one checkbox is selected for Rec for and Based on Groups.
  _validateSelections() {
    const numBasedOnCats = this.#recForCategoryCheckboxes.getNumSelected();
    const numRecCats = this.#basedOnCategoryCheckboxes.getNumSelected();
    const isValidSelections = (numBasedOnCats > 0) && (numRecCats > 0);
    return isValidSelections;
  }

  _addToQDiv(qInfo) {
    qInfo.qSourceItem.appendChild(qInfo.qText);
    qInfo.qSourceItem.insertBefore(qInfo.qScore, qInfo.qSourceItem.children[0]);

    const catTypeText = document.createElement("p");
    const catText = document.createElement("p");

    catTypeText.classList.add("rec-cat-type");
    catText.classList.add("rec-cat");

    [catTypeText.innerText, catText.innerText] = [qInfo.catTypeName, qInfo.catName];

    qInfo.qSourceItem.appendChild(catTypeText);
    qInfo.qSourceItem.appendChild(catText);

    return qInfo.qSourceItem;
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
    
    const recommendsInfo = await fetchResponse.json();
    return recommendsInfo;
  }

  // Set the currQRow to the question that is now being rated, so it can be 
  // easily removed once answered.
  _handleRateBtnClick(evt, question) {
    this.#currQRow  = evt.currentTarget.parentNode.parentNode;
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

    const latestRecsInfo = await this.getRecs();
    return latestRecsInfo;
  }

  // Used by the mixin to get latest recommendations.
  async _getUpdatedSourceData() {
    return await this.#getLatestRecs();
  }
  
  _getHoverText() {
    return "Rate it!";
  }
}

Object.assign(RecsQSource.prototype, kindredRecsMixin);