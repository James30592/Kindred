// To allow submitting answering of questions and getting new questions.
export class QuestionsUiPanel {
  #domElems;
  #questionsQueue;
  #categoryTypeName;
  #categoryName;
  #newAnswers = [];
  static #submitAnswersInterval = 600000; // 10 mins

  constructor(panelElems, questionsQueue, categoryTypeName, categoryName) {
    this.#domElems = panelElems;
    this.#questionsQueue = questionsQueue;
    this.#categoryTypeName = categoryTypeName;
    this.#categoryName = categoryName;
  }

  // Add event listeners to the buttons and call submitAnswers every 10 mins.
  init() {
    this.#domElems.rateBtn.addEventListener("click", evt => {
      this.#answerQuestion(evt);
    });
    this.#domElems.skipBtn.addEventListener("click", evt => {
      this.#answerQuestion(evt);
    });

    for (let changeScoreBtn of this.#domElems.changeScoreBtns) {
      changeScoreBtn.addEventListener("click", evt => {
      this.#changeScore(evt)
      });
    };

    // When questions page is left / tab closed, post any answers to the server.
    window.addEventListener("beforeunload", async () => {
      this.#postAnswers(true);
    });

    // Submit answers every 10 mins, if there are any.
    setInterval(() => {
      this.#postAnswers(false);
    }, QuestionsUiPanel.#submitAnswersInterval);
  }

  // Updates the displayed question with the new first queue item.
  displayCurrQ() {
    const newQInfo = this.#questionsQueue.getCurrQText();
    const newQText = newQInfo.currQText;

    if (newQInfo.endOfQueue) {
      this.#domElems.panelDiv.style.visibility = "hidden";
    };
    this.#domElems.currQuestionText.innerText = newQText;
    this.#domElems.ratingScore.innerText = 5;
  }

  // Update the score on button presses.
  #changeScore(event) {
    let changeAmount = 0.5;
    if (event.currentTarget.classList.contains("big-change-btn")) {
      changeAmount = 1.0;
    };
    if (event.currentTarget.classList.contains("down-btn")) {
      changeAmount = -changeAmount;
    };
  
    this.#domElems.ratingScore.innerText = Number(this.#domElems.ratingScore.
      innerText) + changeAmount;
  }

  // Save answer information, update the queue if necessary.
  #answerQuestion(event) {
    const userSkipped = (event.currentTarget === this.#domElems.skipBtn);
    const currQuestion = this.#questionsQueue.queue.shift();
    const thisScore = (userSkipped ? null : Number(this.#domElems.ratingScore.innerText));

    const answerObj = QuestionsUiPanel.#getAnswerObj(currQuestion, userSkipped, 
      thisScore);

    // Save this answer ready to post when leaving page / after x mins.
    this.#newAnswers.push(answerObj);

    // Updates the displayed question with the new first queue item.
    this.displayCurrQ();

    // Adds more questions to the questions queue if necessary.
    this.#questionsQueue.update(false);
  }

  // Gets current answer to current question as an object for DB.
  static #getAnswerObj(currQuestion, userSkipped, thisScore) {
    const answerInfo = {
      questionId: currQuestion._id,
      skip: userSkipped
    };
  
    if (!userSkipped) {
      answerInfo.answerVal = thisScore;
      answerInfo.answerPercentile = thisScore * 10
    };

    return answerInfo;
  }

  // POST these answers info to the server.
  async #postAnswers(isChangeOfPage = false) {
    // Check if there are any answers to upload.
    if (this.#newAnswers.length === 0) return;

    const postRoute = `/questions/${this.#categoryTypeName}/${this.#categoryName}`;

    const postObj = {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        type: "answers", 
        data: this.#newAnswers
      })
    };
    
    // If moving off the page, send answers data async.
    if (isChangeOfPage) {
      postObj.keepalive = true;
    };
    
    await fetch(postRoute, postObj);
    this.#newAnswers = [];
  }
}