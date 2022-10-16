import { QuestionsPage } from "../questionsPage.mjs";



export class RecsQuestionsPage extends QuestionsPage {
  
  setQMode(newQMode) {
    super.setQMode(newQMode);

    this.currQuestionMode._qSource.addEventListener(`getRecsClick`, async () => {
      this._postAnswers();
    });
  }

  // Dispatch event to the q source so that it knows it can then refresh the 
  // recommendations.
  async _postAnswers(isChangeOfPage = false) {
    super._postAnswers(isChangeOfPage);
    this.currQuestionMode._qSource.dispatchEvent(new CustomEvent(`postAnswersComplete`));
  }
}