// To allow submitting answering of questions and getting new questions.

export class QuestionsQueue {
  static #QUEUE_DESIRED_SIZE = 40;
  static #QUEUE_REFRESH_THRESHOLD = 20;
  categoryTypeName;
  categoryName;
  queue = [];
  filters;
  endOfQSource = false;

  constructor(categoryType, category) {
    this.categoryTypeName = categoryType;
    this.categoryName = category;
  }

  // Add items to the questions queue if it's running low and there are 
  // unanswered questions remaining in the source. isNewQueue is boolean for if 
  // queue is merely appended too or built from scratch.
  async update(isNewQueue) {
    const queueNeedsExtending = this.queue.length <= QuestionsQueue.#QUEUE_REFRESH_THRESHOLD;
    const moreQsInSource = !this.endOfQSource;

    if (queueNeedsExtending && moreQsInSource) {
      // Queue needs to and can be extended.
      const numNewQs = QuestionsQueue.#QUEUE_DESIRED_SIZE - this.queue.length;
      const currQueueIds = this.queue.map(q => q._id);
      const maxQueueApiPage = this.queue.at(-1)?.apiPageNum;

      // Post request to server for new questions for the queue.
      const newQuestionsObj = await this.#postNewQsRequest(numNewQs, 
        currQueueIds, maxQueueApiPage, isNewQueue);

      this.endOfQSource = newQuestionsObj.endOfQSource;
      this.queue = this.queue.concat(newQuestionsObj.results);
    };
  }

  // Gets more items to the questions queue, when it's running low.
  async #postNewQsRequest(numQuestions, currQueueIds, maxQueueApiPage, isNewQueue) {
    const filterInfo = {
      // fromDate: fromDateInput?.value,
      // toDate: toDateInput?.value
      // genres
      // people
    };
    
    const postObj = {
      type: "updateQueue",
      data: {
        numQs: numQuestions,
        isNewQueue: isNewQueue,
        currQueueIds: currQueueIds,
        maxQueueApiPage: maxQueueApiPage,
        filters: filterInfo
      }
    };

    const fetchResponse = await fetch(`/questions/${this.categoryTypeName}/${this.categoryName}`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(postObj)
    });

    const newQuestions = await fetchResponse.json();
    return newQuestions;
  }

  // Gets the text to display of the current first item in the questions queue.
  getCurrQText() {
    let currQText;
    let endOfQueue = false;

    // Hide question answer panel if run out of questions and display a message.
    if (this.queue.length === 0) {
      currQText = "You have answered all questions in this category!";
      endOfQueue = true;
    }
    else {
      currQText = QuestionsQueue.#getQuestionText(this.categoryTypeName, 
        this.categoryName, this.queue[0]);
    };

    return {endOfQueue, currQText};
  }

  // Get the string to show as the question text, depending on the category.
  static #getQuestionText(catTypeName, catName, currQuestion) {
    let displayText;
  
    switch(true) {
  
      case (catTypeName === "Interests" && catName === "Films") :
        displayText = `${currQuestion.title} (${currQuestion.releaseDate})`;
        break;
  
      default:
        displayText = currQuestion.text;
    };
    
    return displayText;
  }
}      
  
  
  
export class QuestionsUiPanel {
    domElems;
    questionsQueue;
    categoryTypeName;
    categoryName;
  
    constructor(panelElems, questionsQueue, categoryTypeName, categoryName) {
      this.domElems = panelElems;
      this.questionsQueue = questionsQueue;
      this.categoryTypeName = categoryTypeName;
      this.categoryName = categoryName;
    }
  
    // Add event listeners to the buttons.
    init() {
      this.domElems.rateBtn.addEventListener("click", (evt) => {
        this.answerQuestion(evt);
      });
      this.domElems.skipBtn.addEventListener("click", (evt) => {
        this.answerQuestion(evt);
      });

      for (let changeScoreBtn of this.domElems.changeScoreBtns) {
        changeScoreBtn.addEventListener("click", (evt) => {
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
    
      this.domElems.ratingScore.innerText = Number(this.domElems.ratingScore.
        innerText) + changeAmount;
    }
  
    // Submit answer information to the server, update the queue if necessary.
    answerQuestion(event) {
      console.log(this.questionsQueue.queue);
      const userSkipped = (event.currentTarget === this.domElems.skipBtn);
      const currQuestion = this.questionsQueue.queue.shift();
      const thisScore = (userSkipped ? null : Number(this.domElems.ratingScore.innerText));
  
      const answerObj = QuestionsUiPanel.#getAnswerObj(currQuestion, userSkipped, 
        thisScore);
  
      // POSTS this new answer to the server asynchronously for adding to DB.
      this.#postAnswer(answerObj);
      
      // Updates the displayed question with the new first queue item.
      this.displayCurrQ();
  
      // Adds more questions to the questions queue if necessary.
      this.questionsQueue.update(false);
    }
    
    // Updates the displayed question with the new first queue item.
    displayCurrQ() {
      const newQInfo = this.questionsQueue.getCurrQText();
      const newQText = newQInfo.currQText;
  
      if (newQInfo.endOfQueue) {
        this.domElems.panelDiv.style.visibility = "hidden";
      };
      this.domElems.currQuestionText.innerText = newQText;
      this.domElems.ratingScore.innerText = 5;
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
    
      fetch(`/questions/${this.categoryTypeName}/${this.categoryName}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(postObj)
      });
    }
}