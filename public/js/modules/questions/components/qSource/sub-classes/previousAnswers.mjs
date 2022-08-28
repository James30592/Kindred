import { fadeIn, fullyFadeOut } from "../../../../../../sharedJs/utils.mjs";
import { SingleModeQSource } from "../singleModeQSource.mjs";



export class PreviousAnswers extends SingleModeQSource {
  #notYetActivated = true;
  // Combination of all DB answers overwritten with any more recent answers for 
  // current session.
  #prevAnswers = [];
  _categoryTypeName;
  _categoryName;

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
      this._buildListDiv(this.#prevAnswers);
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

      const newAnsRowDiv = this._createRow(newAnswer);

      // If found, overwrite with new answer.
      if (foundIndex > -1) {
        this.#prevAnswers.splice(foundIndex, 1, newAnswer);
        this._listDiv.replaceChild(newAnsRowDiv, this._listDiv.children[foundIndex]);
      }
      // Otherwise add new row to end of the listDiv.
      else {
        this.#prevAnswers.push(newAnswer);
        this._listDiv.appendChild(newAnsRowDiv);
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
    const thisQText = this._getAnswerDisplayText(prevAns?.questionDetails, 
      this._categoryTypeName, this._categoryName);
    
    return `${thisQText}. Skipped: ${prevAns.skip}. Answer Percentage: ${prevAns?.answerPercentile}.`;
  }
  
  _getRateBtnText() {
    return "Re-rate it!";
  }
}