export class AnswerUIPanel {
  mainDiv;
  ratePanel;
  rateBtn;
  skipBtn;
  scoreSlider;
  scoreSliderInput;
  currQuestionText;
  prevAnsDiv;
  prevAnsVal;
  loader;
  details;

  constructor(qModeDiv) {
    this.mainDiv = qModeDiv.querySelector(".answer-panel");
    this.ratePanel = this.mainDiv.querySelector(".rate-panel");
    this.rateBtn = this.mainDiv.querySelector(".rate-btn");
    this.skipBtn = this.mainDiv.querySelector(".skip-btn");
    this.scoreSlider = this.mainDiv.querySelector(".score-slider");
    this.scoreSliderInput = this.scoreSlider.querySelector("input");
    this.currQuestionText = this.mainDiv.querySelector(".curr-question");
    this.prevAnsDiv = this.mainDiv.querySelector(".prev-ans-info");
    this.prevAnsVal = this.mainDiv.querySelector(".prev-ans-val");
    this.loader = this.mainDiv.querySelector(".loader");
    this.details = this.mainDiv.querySelector(".details");
  }
  
  // Updates the displayed question with the new first queue item.
  displayCurrQ(newQInfo, includeAlreadyAnswered) {
    this.#showOrHidePanel(newQInfo);

    // Show current question text and reset previous answer info.
    this.currQuestionText.innerText = newQInfo.currQText;
    this.prevAnsVal.innerText = "";

    const prevScore = this.#fillPrevAns(newQInfo, includeAlreadyAnswered);

    // Reset / set the score and send input event for the custom slider to 
    // cause the wrapper element to update also.
    this.scoreSliderInput.value = prevScore;
    this.scoreSliderInput.dispatchEvent(new Event("input"));
  }

  async showLoader() {
    this.loader.classList.remove("fully-hidden");
    this.details.classList.add("fully-hidden");
    this.details.classList.add("transparent");
  }

  async hideLoader() {
    this.loader.classList.add("fully-hidden");
    this.details.classList.remove("fully-hidden");
    setTimeout(() => this.details.classList.remove("transparent"), 10);
  }

  // Shows / hides rate panel dependent on whether end of queue reached.
  #showOrHidePanel(newQInfo) {
    // Show or hide the scoring slider and buttons as necessary.
    if (newQInfo.endOfQueue) {
      this.ratePanel.classList.add("hidden");
    }
    else {
      this.ratePanel.classList.remove("hidden");
    };
  }

  // Shows or hides previous answer info dependent on whether there is one for 
  // this question and sets the prev ans text. Returns the prev ans score 
  // value, used to set the slider score.
  #fillPrevAns(newQInfo, includeAlreadyAnswered) {
    let prevAnsScore = 5;

    // If current question has a previous answer by the user, show the previous 
    // answer details.
    if (includeAlreadyAnswered && newQInfo.currQAns) {
      this.prevAnsDiv.classList.remove("hidden");      
      this.prevAnsVal.innerText = "Skipped";

      if (!newQInfo.currQAns.skip) {
        prevAnsScore = newQInfo.currQAns.answerVal;
        this.prevAnsVal.innerText = prevAnsScore;
      };
    }
    else {
      this.prevAnsDiv.classList.add("hidden");
    };

    return prevAnsScore;
  }
}