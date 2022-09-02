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
    const loaderShown = new Promise(async resolve => {
      await this.currQuestionMode.showLoader();
      resolve();
    });

    const recsUpdated = new Promise(async resolve => {
      await this._postAnswers();
      const recs = await this.currQuestionMode.getRecs();
      // Only rebuild content div once new recs have been received AND loader 
      // has finished fading in / content div has finished fading out (otherwise 
      //   this content appears immediately before content div has faded out).
      loaderShown.then(() => {
        this.currQuestionMode.rebuildContentDiv(recs);
        resolve();
      });
    });

    // Don't hide the loader / show the content until both the loader has 
    // finished faded in AND the recommendations have been updated.
    Promise.all([loaderShown, recsUpdated]).then(() => {
      this.currQuestionMode.hideLoader();
    });
  }
}