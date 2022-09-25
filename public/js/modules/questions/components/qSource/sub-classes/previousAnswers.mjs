import { fadeIn, fullyFadeOut } from "../../../../fadeTransitions.mjs";
import { getQInfo } from "../../../questionsHelpers.mjs";
import { SingleModeQSource } from "../singleModeQSource.mjs";



export class PreviousAnswers extends SingleModeQSource {
  #notYetActivated = true;
  // Combination of all DB answers overwritten with any more recent answers for 
  // current session.
  #prevAnswers = [];
  _categoryTypeName;
  _categoryName;
  _qDivClass = "prev-ans-item";

  constructor(listDiv, categoryTypeName, categoryName) {
    super(listDiv);
    this._categoryTypeName = categoryTypeName;
    this._categoryName = categoryName;
  }

  // Get the latest version of all the user's current answers and update the 
  // div with them.
  async activate() {
    // Get user's current answers in the DB for this category, if first time 
    // running, and populate the DOM list.
    if (this.#notYetActivated) {
      this.#prevAnswers = await this.#getDBAnswers();
      this._buildContentDiv(this.#prevAnswers);
      this.#notYetActivated = false;
    };

    fadeIn(this._listDiv);
  }

  // Hides the list.
  deactivate() {
    fullyFadeOut(this._listDiv);
  }

  // Updates this #prevAnswers and the div list on a change.
  updateAnswersList(latestSessionAnswers) {
    for (let newAnswer of latestSessionAnswers) {
      // Update this prevAnswers and the DOM list with the latest 
      // session answers.
      const foundIndex = this.#prevAnswers.findIndex(prevAns => {
        return prevAns.questionId === newAnswer.questionId
      });

      const newAnsRowDiv = this._createQDiv(newAnswer);

      // If found, overwrite with new answer.
      if (foundIndex > -1) {
        this.#prevAnswers.splice(foundIndex, 1, newAnswer);
        this._contentDiv.replaceChild(newAnsRowDiv, this._contentDiv.children[foundIndex]);
      }
      // Otherwise add new row to end of the contentDiv.
      else {
        this.#prevAnswers.push(newAnswer);
        this._contentDiv.appendChild(newAnsRowDiv);
      };
    };
  }

  // Get user's current answers in the DB for this category.
  async #getDBAnswers() {
    const fetchCurrDBAnswers = await fetch(`/questions/user-answers/${this._categoryTypeName}/${this._categoryName}`);
    const currDBAnswers = await fetchCurrDBAnswers.json();
    return currDBAnswers;
  }

  _getQText(prevAns) {
    const thisQText = getQInfo(prevAns?.questionDetails, "qSourceDisplayText", 
      this._categoryTypeName, this._categoryName);
    
    return `${thisQText}. Skipped: ${prevAns.skip}. Answer: ${prevAns?.answerVal}.`;
  }

  _getScoreText(prevAns) {
    return prevAns.skip ? "Skipped" : Number(prevAns.answerVal).toFixed(1);
  }

  _addToQDiv(qInfo) {
    qInfo.qSourceItem.appendChild(qInfo.qText);
    qInfo.qSourceItem.appendChild(qInfo.qScore);
    return qInfo.qSourceItem;
  }
  
  _getHoverText() {
    return "Re-rate it!";
  }
}