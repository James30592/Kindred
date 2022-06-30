const QUEUE_DESIRED_SIZE = 40;
const QUEUE_REFRESH_THRESHOLD = 20;

// Questions panel elements.
const panelDiv = document.querySelector(".rate-panel");
const rateBtn = document.querySelector(".rate-btn");
const skipBtn = document.querySelector(".skip-btn");
const changeScoreBtns = document.querySelectorAll(".change-score-btn");
const currQuestionText = document.querySelector(".curr-question");
const ratingScore = document.querySelector(".rating-score");
const panelElems = {panelDiv, rateBtn, skipBtn, changeScoreBtns, 
  currQuestionText, ratingScore};

// Filter info.
const fromDateInput = document.querySelector(".filter-date-from");
const toDateInput = document.querySelector(".filter-date-to");

// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// New questions queue object.
const thisQueue = new QuestionsQueue(categoryTypeName, categoryName);

// New UI panel object.
const uiPanel = new QuestionsUiPanel(panelElems, thisQueue, categoryTypeName, 
  categoryName);

// Add event listeners to the panel buttons.
uiPanel.init();




// -----------------------------------------------------------------------------------
let questionsQueue = [];
let currQuestion = null;
// Store if user has exhausted all questions in source for this category.
let endOfQSource = false;

window.onload = async () => {
  await updateQuestionQueue();
  showCurrentQuestion();
};

// searching for particular film just adds it to the front of the questionsQueue once selected.

// if questions queue runs out (eg. filtered by obscure actor and rated all 
// their films) then display message "you have rated all films meeting these 
// criteria, expand filter criteria".
// -----------------------------------------------------------------------------------


window.onload = async () => {
  await thisQueue.updateQuestionQueue();
  thisQueue.showCurrentQuestion();
};





class QuestionsQueue {
  categoryTypeName;
  categoryName;
  queue = [];
  filters;
  endOfQSource = false;

  constructor(categoryType, category) {
    this.categoryTypeName = categoryType;
    this.categoryName = category;
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





class QuestionsUiPanel {
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
    this.rateBtn.addEventListener("click", () => {this.answerQuestion});
    this.skipBtn.addEventListener("click", () => {this.answerQuestion});
    for (let changeScoreBtn of this.changeScoreBtns) {
      changeScoreBtn.addEventListener("click", () => {this.changeScore});
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
  
    ratingScore.innerText = Number(ratingScore.innerText) + changeAmount;
  }


  // Submit answer information to the server, update the queue if necessary.
  answerQuestion(event) {
    const userSkipped = (event.currentTarget === skipBtn);
    const currQuestion = this.questionsQueue.queue.shift();
    const thisScore = (userSkipped ? null : Number(this.ratingScore.innerText));

    const answerObj = QuestionsUiPanel.#getAnswerObj(currQuestion, userSkipped, 
      thisScore);

    // POSTS this new answer to the server for adding to DB.
    this.#submitAnswer(answerObj);
    
    // Updates the displayed question with the new first queue item.
    this.#updateDisplayedQ();

    // Add items to the questions queue if it's running low and there are 
    // unanswered questions remaining in the source.
    if (!endOfQSource) {
      updateQuestionQueue();
    };
  }
  

  // Updates the displayed question with the new first queue item.
  #updateDisplayedQ() {
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
  #submitAnswer(answerObj) {   
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







// Adds more questions to the questions queue if necessary.
async function updateQuestionQueue() {
  if (questionsQueue.length <= QUEUE_REFRESH_THRESHOLD) {
    debugger;
    const newQuestionsObj = await getNewQuestions(QUEUE_DESIRED_SIZE - 
      questionsQueue.length);

    const newQuestions = newQuestionsObj.results;
    endOfQSource = newQuestionsObj.endOfQSource;
    questionsQueue = questionsQueue.concat(newQuestions);
  };
}


// Gets more items to the questions queue, when it's running low.
async function getNewQuestions(numQuestions) {
  const filterInfo = {
    fromDate: fromDateInput?.value,
    toDate: toDateInput?.value
    // genres
    // people
  };
  
  const postObj = {
    type: "updateQueue",
    data: {
      numQs: numQuestions,
      // filtersChanged: false,    flag for if any filters have changed that will affect the queue.
      filters: filterInfo
    }
  };

  const fetchResponse = await fetch(`/questions/${categoryTypeName}/${categoryName}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(postObj)
  });

  const newQuestions = await fetchResponse.json();
  return newQuestions;
}
