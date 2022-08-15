import { SingleModeQSource } from "../singleModeQSource.mjs";



export class RecsQSource extends SingleModeQSource {
  // Stores the DOM row for the question that is currently being answered.
  currQRow = null;

  // 
  getRecs() {
    this.#buildListDiv();

    // ............
  }

  _getQText(rec) {
    const thisQText = this._getAnswerDisplayText(rec?.questionDetails, 
      rec.categoryType, rec.category);
    
    return `${rec.rating.strength.toFixed(1)} - ${thisQText} - ${rec.category} - ${rec.categoryType} - ${rec.rating.numUsersAnswered}`;
  }

  _getRateBtnText() {
    return "Rate it!";
  }

  // Set the currQRow to the question that is now being rated, so it can be 
  // easily removed once answered.
  _handleRateBtnClick(evt) {
    this.currQuestion = evt.currentTarget.parentNode;
    super._handleRateBtnClick(evt);
  }

  // Remove the newly answered question from the recommendations list.
  removeAnsweredQ() {
    this._listDiv.removeChild(this.currQRow);
  }
}