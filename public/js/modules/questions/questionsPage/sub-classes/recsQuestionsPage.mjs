import { QuestionsPage } from "../questionsPage.mjs";



export class RecsQuestionsPage extends QuestionsPage {
  #getRecsBtn;

  init() {
    super.init();
    this.#getRecsBtn = document.querySelector(".get-recommendations");

    this.#getRecsBtn.addEventListener("click", async () => {
      // Wait for any just answered answers to be submitted and saved before 
      // refreshing the recommendations.
      await this._postAnswers();
      this.currQuestionMode.refreshRecs();
    });
  }
}