const QUEUE_DESIRED_SIZE = 40;
const QUEUE_REFRESH_THRESHOLD = 20;

const rateBtn = document.querySelector(".rate-btn");
const notSeenItBtn = document.querySelector(".not-seen-btn");
const mainHeader = document.querySelector(".main-header");

// Filter info.
const fromDateInput = document.querySelector(".filter-date-from");
const toDateInput = document.querySelector(".filter-date-to");

const currQuestionText = document.querySelector(".curr-question");
const ratingScore = document.querySelector(".rating-score");

const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

rateBtn.addEventListener("click", answerQuestion(true));
notSeenItBtn.addEventListener("click", answerQuestion(false));

let questionsQueue = [];
let currQuestion = null;

let pageCounter = 1;

window.onload = () => {
  updateQuestionQueue();
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


// 
function showCurrentQuestion() {
  currQuestion = questionsQueue[0];
  currQuestionText.innerText = `${currQuestion.title} (${currQuestion.releaseDate})`
  ratingScore.innerText = 5;
}


// Submit answer information to the server, update the queue if necessary.
function answerQuestion(userHasSeen) {
  const currQuestion = questionsQueue[0];

  const answerInfo = {
    id: currQuestion.id,
    title: currQuestion.title,
    releaseDate: currQuestion.releaseDate,
    posterPath: currQuestion.posterPath,
    seen: userHasSeen,
    score: Number(ratingScore.innerText)
  };
  
  const postObj = {
    type: "answer",
    data: answerInfo
  };

  // Post the answer info.
  fetch(`/questions/${categoryTypeName}/${categoryName}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(postObj)
  });
  
  // Remove this answered question from the questions queue.
  questionsQueue.shift();
  showCurrentQuestion();

  // Add items to the questions queue if it's running low.
  updateQuestionQueue();
}


// Adds more questions to the questions queue if necessary.
function updateQuestionQueue() {
  if (questionsQueue.length <= QUEUE_REFRESH_THRESHOLD) {
    const newQuestions = getNewQuestions(QUEUE_DESIRED_SIZE - QUEUE_REFRESH_THRESHOLD);
    questionsQueue = questionsQueue.concat(newQuestions);
  };
}


// Gets more items to the questions queue, when it's running low.
async function getNewQuestions(numQuestions) {
  const filterInfo = {
    fromDate: fromDateInput.value,
    toDate: toDateInput.value
    // genres
    // people
  };

  const newQuestionsInfo = {
    numQs: numQuestions,
    filters: filterInfo
  };
  
  const postObj = {
    type: "filters",
    data: newQuestionsInfo
  };

  const fetchResponse = await fetch(`/questions/${categoryTypeName}/${categoryName}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(postObj)
  });
  const newQuestions = await fetchResponse.json();

  return newQuestions;
}
