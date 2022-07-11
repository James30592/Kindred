// To allow submitting answering of questions and getting new questions.
export class QuestionsUiPanel {
    #domElems;
    #questionsQueue;
    #categoryTypeName;
    #categoryName;
  
    constructor(panelElems, questionsQueue, categoryTypeName, categoryName) {
      this.#domElems = panelElems;
      this.#questionsQueue = questionsQueue;
      this.#categoryTypeName = categoryTypeName;
      this.#categoryName = categoryName;
    }
  
    // Add event listeners to the buttons.
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
  
    // Submit answer information to the server, update the queue if necessary.
    #answerQuestion(event) {
      const userSkipped = (event.currentTarget === this.#domElems.skipBtn);
      const currQuestion = this.#questionsQueue.queue.shift();
      const thisScore = (userSkipped ? null : Number(this.#domElems.ratingScore.innerText));
  
      const answerObj = QuestionsUiPanel.#getAnswerObj(currQuestion, userSkipped, 
        thisScore);
  
      // POSTS this new answer to the server asynchronously for adding to DB.
      this.#postAnswer(answerObj);
      
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
  
    // POST this answer info to the server.
    #postAnswer(answerObj) {   
      const postObj = {
        type: "answer", 
        data: answerObj
      };
    
      fetch(`/questions/${this.#categoryTypeName}/${this.#categoryName}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(postObj)
      });
    }
}