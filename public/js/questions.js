const QUEUE_DESIRED_SIZE = 40;
const QUEUE_REFRESH_THRESHOLD = 20;

// Questions panel elements.
const panelDiv = document.querySelector(".rate-panel");
const rateBtn = document.querySelector(".rate-btn");
const skipBtn = document.querySelector(".skip-btn");
const changeScoreBtns = document.querySelectorAll(".change-score-btn");
const currQuestionText = document.querySelector(".curr-question");
const ratingScore = document.querySelector(".rating-score");

// Filter info.
const fromDateInput = document.querySelector(".filter-date-from");
const toDateInput = document.querySelector(".filter-date-to");

// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// New UI panel object.
const uiPanel = new QuestionsUiPanel(panelDiv, rateBtn, skipBtn, changeScoreBtns,
  currQuestionText, ratingScore);

uiPanel.init();

// New queue object.
const thisQueue = new QuestionsQueue(uiPanel, categoryTypeName, categoryName);



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
  uiPanel;
  queue = [];
  currQuestion = null;
  filters;
  endOfQSource = false;

  constructor(uiPanel, categoryType, category) {
    this.uiPanel = uiPanel;
    this.categoryTypeName = categoryType;
    this.categoryName = category;
  }

  init() {

  }
}


class QuestionsUiPanel {
  panelDiv; 
  rateBtn; 
  skipBtn; 
  changeScoreBtns;
  currQuestionText; 
  ratingScore;

  constructor(panelDiv, rateBtn, skipBtn, changeScoreBtns, currQuestionText, 
    ratingScore) {

    this.panelDiv = panelDiv;
    this.rateBtn = rateBtn;
    this.skipBtn = skipBtn;
    this.changeScoreBtns = changeScoreBtns;
    this.currQuestionText = currQuestionText;
    this.ratingScore = ratingScore;
  }

  // Add event listeners to the buttons.
  init() {
    this.rateBtn.addEventListener("click", this.answerQuestion);
    this.skipBtn.addEventListener("click", this.answerQuestion);
    for (let changeScoreBtn of this.changeScoreBtns) {
      changeScoreBtn.addEventListener("click", this.changeScore);
    };
  }
  
  
}




// Update the score on button presses.
function changeScore(event) {
  let changeAmount = 0.5;
  if (event.currentTarget.classList.contains("big-change-btn")) {
    changeAmount = 1.0;
  };
  if (event.currentTarget.classList.contains("down-btn")) {
    changeAmount = -changeAmount;
  };

  ratingScore.innerText = Number(ratingScore.innerText) + changeAmount;
}

// Update webpage to show current question at front of queue.
function showCurrentQuestion() {
  currQuestion = questionsQueue[0];

  // Hide question answer panel if run out of questions and display a message.
  if (questionsQueue.length === 0) {
    currQuestionText.innerText = "You have answered all questions in this category!";

    panelDiv.style.visibility = "hidden";
    // ratePanel.style.display = "none";
  }
  else {
    currQuestionText.innerText = getQuestionText(categoryTypeName, categoryName, 
      currQuestion);
  };

  ratingScore.innerText = 5;
}

// Get the string to show as the question text, depending on the category.
function getQuestionText(catTypeName, catName, currQuestion) {
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

// Submit answer information to the server, update the queue if necessary.
function answerQuestion(event) {
  const userSkipped = (event.currentTarget === skipBtn);
  const currQuestion = questionsQueue.shift();
  const thisScore = (userSkipped ? null : Number(ratingScore.innerText));

  submitAnswer(currQuestion, userSkipped, thisScore, categoryTypeName, categoryName);
  
  // Show the new first question in the queue, after shifting the array.
  showCurrentQuestion();

  // Add items to the questions queue if it's running low and there are 
  // unanswered questions remaining in the source.
  if (!endOfQSource) {
    updateQuestionQueue();
  };
}


// POST this answer info to the server.
function submitAnswer(currQuestion, userSkipped, thisScore, catTypeName, 
  catName) {

  const answerInfo = {
    questionId: currQuestion._id,
    skip: userSkipped
  };

  if (!userSkipped) {
    answerInfo.answerVal = thisScore;
    answerInfo.answerPercentile = thisScore * 10
  };
  
  const postObj = {
    type: "answer", 
    data: answerInfo, 
    apiMaxPage: currQuestion.apiPageNum
  };

  fetch(`/questions/${catTypeName}/${catName}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(postObj)
  });
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
