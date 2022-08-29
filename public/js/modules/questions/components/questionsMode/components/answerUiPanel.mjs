export class AnswerUIPanel {
  mainDiv;
  ratePanel;
  rateBtn;
  skipBtn;
  changeScoreBtns;
  currQuestionText;
  ratingScore;
  prevAnsDiv;
  prevAnsVal;
  loader;
  details;

  constructor(qModeDiv) {
    this.mainDiv = qModeDiv.querySelector(".answer-panel");
    this.ratePanel = this.mainDiv.querySelector(".rate-panel");
    this.rateBtn = this.mainDiv.querySelector(".rate-btn");
    this.skipBtn = this.mainDiv.querySelector(".skip-btn");
    this.changeScoreBtns = this.mainDiv.querySelectorAll(".change-score-btn");
    this.currQuestionText = this.mainDiv.querySelector(".curr-question");
    this.ratingScore = this.mainDiv.querySelector(".rating-score");
    this.prevAnsDiv = this.mainDiv.querySelector(".prev-ans-info");
    this.prevAnsVal = this.mainDiv.querySelector(".prev-ans-val");
    this.loader = this.mainDiv.querySelector(".loader");
    this.details = this.mainDiv.querySelector(".details");
  }

  // Sets up the change score button event listeners.
  init() {
    for (let changeScoreBtn of this.changeScoreBtns) {
      changeScoreBtn.addEventListener("click", evt => {
        this.changeScore(evt)
      });
    };
  }

  // Update the score on button presses.
  changeScore(event) {
    let changeAmount = 0.5;
    if (event.currentTarget.classList.contains("big-change-btn")) {
      changeAmount = 1.0;
    };
    if (event.currentTarget.classList.contains("down-btn")) {
      changeAmount = -changeAmount;
    };
  
    this.ratingScore.innerText = Number(this.ratingScore.innerText) + 
      changeAmount;
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
    // Reset the score and previous answer value.
    this.ratingScore.innerText = 5;
    this.prevAnsVal.innerText = "";

    // If current question has a previous answer by the user, show the previous 
    // answer details.
    if (includeAlreadyAnswered && newQInfo.currQAns) {
      this.prevAnsDiv.classList.remove("hidden");

      const prevAnsDisplayVal = newQInfo.currQAns.skip ? "Skipped" 
        : newQInfo.currQAns.answerVal;

      this.prevAnsVal.innerText = prevAnsDisplayVal;
    }
    else {
      this.prevAnsDiv.classList.add("hidden");
    };
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