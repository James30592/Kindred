import { QuestionsPage } from "../questionsPage.mjs";



// Questions page that included a previous answers section for seeing previous 
// answers made by the user, for use when in questions mode proper.
export class FullQuestionsPage extends QuestionsPage {
  // Just the session answers since last time was on the prev answers mode.
  #latestSessionAnswers = [];

  constructor(qModes, categoryTypeName, categoryName) {
    super(qModes, categoryTypeName, categoryName);
  }

  _setRecentAnswers() {
    // If currently in the previous answers mode, reset the latestSessionAnswers 
    // immediately after setting it as it will be reflected in the prev answers 
    // list straight away.
    if (this.currQuestionMode?.name === "prevAns") {
      this.currQuestionMode.setRecentAnswers(this.#latestSessionAnswers);
      this.#latestSessionAnswers = [];
    }
    else {
      this.currQuestionMode.setRecentAnswers(this.allRecentAnswers);
    };
  }

  // Adds new answer to latest session answers.
  _handleNewAnswer(answerObj) {
    this._updateAnsArrayWithAns(this.#latestSessionAnswers, answerObj);
    super._handleNewAnswer(answerObj);
  }
}