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
    // Show or hide the scoring buttons as necessary.
    if (newQInfo.endOfQueue) {
      this.ratePanel.style.visibility = "hidden";
    }
    else {
      this.ratePanel.style.visibility = "visible";
    };

    // Show current question text.
    this.currQuestionText.innerText = newQInfo.currQText;

    let scoreSliderVal = 5;
    this.prevAnsVal.innerText = "";

    // If current question has a previous answer by the user, show the previous 
    // answer details.
    if (includeAlreadyAnswered && newQInfo.currQAns) {
      this.prevAnsDiv.classList.remove("hidden");

      let prevAnsDisplayVal = "Skipped";
      
      if (!newQInfo.currQAns.skip) {
        prevAnsDisplayVal = newQInfo.currQAns.answerVal;
        scoreSliderVal = prevAnsDisplayVal;
      };

      this.prevAnsVal.innerText = prevAnsDisplayVal;
    }
    else {
      this.prevAnsDiv.classList.add("hidden");
    };

    // Reset / set the score and send input event for the custom slider to 
    // cause the wrapper element to update also.
    this.scoreSliderInput.value = scoreSliderVal;
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
}