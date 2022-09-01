import { QuestionsPage } from "../questionsPage.mjs";



export class RecsQuestionsPage extends QuestionsPage {
  #getRecsBtn;

  init() {
    super.init();
    this.#getRecsBtn = document.querySelector(".get-recommendations");

    this.#getRecsBtn.addEventListener("click", async () => {
      this.#handleGetRecsClick();
    });
  }

  // Wait for any just answered answers to be submitted and saved before 
  // refreshing the recommendations.
  async #handleGetRecsClick() {
    this.currQuestionMode.showLoader();
    await this._postAnswers();
    await this.currQuestionMode.refreshRecs();
    this.currQuestionMode.hideLoader();
  }
}