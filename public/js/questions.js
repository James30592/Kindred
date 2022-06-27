const QUEUE_DESIRED_SIZE = 40;
const QUEUE_REFRESH_THRESHOLD = 20;

const rateBtn = document.querySelector(".rate-btn");
const skipBtn = document.querySelector(".skip-btn");
const mainHeader = document.querySelector(".main-header");

// Filter info.
const fromDateInput = document.querySelector(".filter-date-from");
const toDateInput = document.querySelector(".filter-date-to");

const currQuestionText = document.querySelector(".curr-question");
const ratingScore = document.querySelector(".rating-score");

const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

rateBtn.addEventListener("click", answerQuestion);
skipBtn.addEventListener("click", answerQuestion);

for (let changeScoreBtn of document.querySelectorAll(".change-score-btn")) {
  changeScoreBtn.addEventListener("click", changeScore);
};

let questionsQueue = [];
let currQuestion = null;

let pageCounter = 1;

window.onload = async () => {
  await updateQuestionQueue();
  showCurrentQuestion();
};

// fetch a page of discover movie results using TMDB api, go through each one 
// and check if user answered yet using the id, for any that user hasn't answered, 
// add them to the queue. keep doing this for pages of results until queue has size 20.

// searching for particular film just adds it to the front of the questionsQueue once selected.

// if questions queue runs out (eg. filtered by obscure actor and rated all 
// their films) then display message "you have rated all films meeting these 
// criteria, expand filter criteria".


// current film shows questionsQueue[0]
// on changing any of the filter parameters, update the questionsQueue



// Update the score on button presses.
function changeScore(event) {
  let changeAmount = 0.5;
  if (event.currentTarget.classList.contains(".big-change-btn")) {
    changeAmount = 1.0;
  };
  if (event.currentTarget.classList.contains(".down-btn")) {
    changeAmount = -changeAmount;
  };

  ratingScore.innerText = ratingScore.innerText + changeAmount;
}

// 
function showCurrentQuestion() {
  currQuestion = questionsQueue[0];
  currQuestionText.innerText = `${currQuestion.title} (${currQuestion.releaseDate})`
  ratingScore.innerText = 5;
}


// Submit answer information to the server, update the queue if necessary.
function answerQuestion(event) {
  const userSkipped = (event.currentTarget === skipBtn);
  const currQuestion = questionsQueue.shift();
  const thisScore = (userSkipped ? null : Number(ratingScore.innerText));

  submitAnswer(currQuestion, userSkipped, thisScore, categoryTypeName, categoryName);
  
  // Show the new first question in the queue, after shifting the array.
  showCurrentQuestion();

  // Add items to the questions queue if it's running low.
  updateQuestionQueue();
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
  
  const postObj = {type: "answer", data: answerInfo};

  fetch(`/questions/${catTypeName}/${catName}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(postObj)
  });
}


// Adds more questions to the questions queue if necessary.
async function updateQuestionQueue() {
  if (questionsQueue.length <= QUEUE_REFRESH_THRESHOLD) {
    const newQuestions = await getNewQuestions(QUEUE_DESIRED_SIZE - 
      QUEUE_REFRESH_THRESHOLD);

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
    type: "filters",
    data: {
      numQs: numQuestions,
      filters: filterInfo
    }
  };

  const fetchResponse = await fetch(`/questions/${categoryTypeName}/${categoryName}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(postObj)
  });

  const newQuestions = await fetchResponse.json();
  return newQuestions.results;
}
