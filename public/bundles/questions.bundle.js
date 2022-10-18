/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/centreModal.mjs":
/*!****************************************!*\
  !*** ./src/js/modules/centreModal.mjs ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CentreModal": () => (/* binding */ CentreModal)
/* harmony export */ });
/* harmony import */ var _fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fadeTransitions.mjs */ "./src/js/modules/fadeTransitions.mjs");




class CentreModal {
  wrapper;
  #modal;
  #closeModalBtn;

  constructor(wrapper) {
    this.wrapper = wrapper;
    this.#modal = wrapper.querySelector(".centre-modal");
    this.#closeModalBtn = this.#modal.querySelector(".close");
  }

  // Set up the event listeners.
  init() {
    const closeModalElems = [this.#closeModalBtn, this.wrapper];

    for (let closeModalElem of closeModalElems) {
      closeModalElem.addEventListener("click", () => this.hide());
    };

    this.#modal.addEventListener("click", evt => evt.stopPropagation());
  }

  show() {
    (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fadeIn)(this.wrapper);
  }

  hide() {
    (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fullyFadeOut)(this.wrapper);
  }
}

/***/ }),

/***/ "./src/js/modules/fadeTransitions.mjs":
/*!********************************************!*\
  !*** ./src/js/modules/fadeTransitions.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fadeFromTo": () => (/* binding */ fadeFromTo),
/* harmony export */   "fadeIn": () => (/* binding */ fadeIn),
/* harmony export */   "fadeOut": () => (/* binding */ fadeOut),
/* harmony export */   "finishFadeIn": () => (/* binding */ finishFadeIn),
/* harmony export */   "finishFadeOut": () => (/* binding */ finishFadeOut),
/* harmony export */   "fullyFadeIn": () => (/* binding */ fullyFadeIn),
/* harmony export */   "fullyFadeOut": () => (/* binding */ fullyFadeOut)
/* harmony export */ });
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");
// Helper functions to assist with fading in / out DOM elements.




// Fade transition helper functions, used with transparent, fully-hidden and 
// fade-trans css classes.
// Makes display property visible and then removes transparency.
function fadeIn(elem) {
  elem.classList.remove("fully-hidden");
  setTimeout(() => elem.classList.remove("transparent"), 10);
}

async function finishFadeIn(elem) {
  await (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.awaitTransition)(elem, "opacity");
}

// Finishes when fade in is completed.
async function fullyFadeIn(elem) {
  fadeIn(elem);
  await finishFadeIn(elem);
}

function fadeOut(elem) {
  elem.classList.add("transparent");
}

// Function that returns a promise that resolves when opacity transition on the 
// given element is completed. Also fully hides the element.
async function finishFadeOut(elem) {
  await (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.awaitTransition)(elem, "opacity");
  elem.classList.add("fully-hidden");
}

// Fade out and fully hide the given element.
async function fullyFadeOut(elem) {
  fadeOut(elem);
  await finishFadeOut(elem);
}

// Fades out elem1 and fades in elem2 once transition completed, doesn't finish 
// until elem2 fully faded in. Returns promise.
function fadeFromTo(elem1, elem2) {
  const fadeCompletePromise = new Promise(async resolve => {
    await fullyFadeOut(elem1);
    await fullyFadeIn(elem2);
    resolve();
  });

  return fadeCompletePromise;
}

/***/ }),

/***/ "./src/js/modules/popBtns.mjs":
/*!************************************!*\
  !*** ./src/js/modules/popBtns.mjs ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fadeTransitions.mjs */ "./src/js/modules/fadeTransitions.mjs");




// Btn with associated content. Content fades in when button is clicked and 
// fades out when anything is clicked. Used by info buttons and nav dropdown.
class PopBtn {
  #btn;
  #content;

  constructor(popBtnContainer) {
    this.#btn = popBtnContainer.querySelector(".pop-btn");
    this.#content = popBtnContainer.querySelector(".pop-btn-content");
  }

  init() {
    this.#setupInfoBtnClick(this.#btn, this.#content);
  }

  #setupInfoBtnClick(btn, content) {
    btn.addEventListener("click", () => {
      this.#handleInfoBtnClick(btn, content);
    }, {once: true});
  }

  async #handleInfoBtnClick(btn, content) {
    await (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fullyFadeIn)(content);
    window.addEventListener("click", async () => {
      await (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fullyFadeOut)(content);
      this.#setupInfoBtnClick(btn, content);
    }, {once: true});
  }
}

// Inits all pop btns on a page.
function setupPopBtns() {
  const popBtnContainers = document.querySelectorAll(".pop-btn-container");
  
  popBtnContainers.forEach(popBtnContainer => {
    const popBtn = new PopBtn(popBtnContainer);
    popBtn.init();
  });
}

setupPopBtns();

/***/ }),

/***/ "./src/js/modules/questions/components/qSource/singleModeQSource.mjs":
/*!***************************************************************************!*\
  !*** ./src/js/modules/questions/components/qSource/singleModeQSource.mjs ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SingleModeQSource": () => (/* binding */ SingleModeQSource)
/* harmony export */ });
/* harmony import */ var _questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../questionsHelpers.mjs */ "./src/js/modules/questions/questionsHelpers.mjs");




class SingleModeQSource extends EventTarget {
  _listDiv;
  _contentDiv;
  _qDivClass;

  constructor(listDiv) {
    super();
    this._listDiv = listDiv;
    this._contentDiv = listDiv.querySelector(".content");
  }

  // Create a div with information for a question item.
  _createQDiv(q) {
    const [catTypeName, catName] = (0,_questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__.getQCategory)(q, this._categoryTypeName, 
      this._categoryName);

    const qSourceItem = (0,_questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__.createQDomItem)(q.questionDetails, catTypeName, 
      catName);
    
    qSourceItem.classList.add(this._qDivClass);

    const qText = this._createQTextElem(q, catTypeName, catName);
    const qScore = this._createtQScoreElem(q);
    this._setupQImg(q, qSourceItem);

    const qInfo = {
      qSourceItem: qSourceItem,
      qText: qText,
      qScore: qScore,
      catTypeName: catTypeName,
      catName: catName
    };

    this._addToQDiv(qInfo);
    return qSourceItem;
  }

  _handleRateBtnClick(evt, question) {
    this.dispatchEvent(
      new CustomEvent("answerSingleQ", {detail: {question: question}})
    );
  }

  // Builds the content div with all the questions.
  _buildContentDiv(questions) {
    for (let question of questions) {
      const qSourceItem = this._createQDiv(question);
      this._contentDiv.appendChild(qSourceItem);
    };
  }

  _createQTextElem(q, catTypeName, catName) {
    const qText = document.createElement("p");

    qText.innerText = (0,_questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__.getQInfo)(q.questionDetails, "qSourceDisplayText", 
      catTypeName, catName);
    
    qText.classList.add("q-text");
    return qText;
  }

  _createtQScoreElem(q) {
    const qScore = document.createElement("p");
    qScore.innerText = this._getScoreText(q);
    qScore.classList.add("user-score");
    return qScore;
  }

  // Add event listener for click to the image / placeholder image.
  // Also create and add hover effect div.
  _setupQImg(q, qSourceItem) {
    const qImg = qSourceItem.querySelector("img") ?? 
      qSourceItem.querySelector(".placeholder-img");

    qImg.addEventListener("click", evt => {
      this._handleRateBtnClick(evt, q);
    });

    const imgWrapperDiv = document.createElement("div");
    imgWrapperDiv.classList.add("q-source-img-wrapper");

    // Change img to be parented by the img wrapper div instead.
    imgWrapperDiv.appendChild(qImg);
    qSourceItem.insertBefore(imgWrapperDiv, qSourceItem.children[0]);

    // Add a hover div, also in the wrapper div.
    const hoverDiv = document.createElement("div");
    hoverDiv.classList.add("q-source-item-hover");

    const hoverTxt = document.createElement("span");
    hoverTxt.innerText = this._getHoverText();
    hoverTxt.classList.add("q-source-hover-txt");

    hoverDiv.appendChild(hoverTxt);
    imgWrapperDiv.appendChild(hoverDiv);
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/qSource/sub-classes/previousAnswers.mjs":
/*!*************************************************************************************!*\
  !*** ./src/js/modules/questions/components/qSource/sub-classes/previousAnswers.mjs ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PreviousAnswers": () => (/* binding */ PreviousAnswers)
/* harmony export */ });
/* harmony import */ var _fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../fadeTransitions.mjs */ "./src/js/modules/fadeTransitions.mjs");
/* harmony import */ var _questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../questionsHelpers.mjs */ "./src/js/modules/questions/questionsHelpers.mjs");
/* harmony import */ var _singleModeQSource_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../singleModeQSource.mjs */ "./src/js/modules/questions/components/qSource/singleModeQSource.mjs");






class PreviousAnswers extends _singleModeQSource_mjs__WEBPACK_IMPORTED_MODULE_2__.SingleModeQSource {
  #notYetActivated = true;
  // Combination of all DB answers overwritten with any more recent answers for 
  // current session.
  #prevAnswers = [];
  _categoryTypeName;
  _categoryName;
  _qDivClass = "prev-ans-item";

  constructor(listDiv, categoryTypeName, categoryName) {
    super(listDiv);
    this._categoryTypeName = categoryTypeName;
    this._categoryName = categoryName;
  }

  // Get the latest version of all the user's current answers and update the 
  // div with them.
  async activate() {
    // Get user's current answers in the DB for this category, if first time 
    // running, and populate the DOM list.
    if (this.#notYetActivated) {
      this.#prevAnswers = await this.#getDBAnswers();
      this._buildContentDiv(this.#prevAnswers);
      this.#notYetActivated = false;
    };

    (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fadeIn)(this._listDiv);
  }

  // Hides the list.
  deactivate() {
    (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fullyFadeOut)(this._listDiv);
  }

  // Updates this #prevAnswers and the div list on a change.
  updateAnswersList(latestSessionAnswers) {
    for (let newAnswer of latestSessionAnswers) {
      // Update this prevAnswers and the DOM list with the latest 
      // session answers.
      const foundIndex = this.#prevAnswers.findIndex(prevAns => {
        return prevAns.questionId === newAnswer.questionId
      });

      const newAnsRowDiv = this._createQDiv(newAnswer);

      // If found, overwrite with new answer.
      if (foundIndex > -1) {
        this.#prevAnswers.splice(foundIndex, 1, newAnswer);
        this._contentDiv.replaceChild(newAnsRowDiv, this._contentDiv.children[foundIndex]);
      }
      // Otherwise add new row to end of the contentDiv.
      else {
        this.#prevAnswers.push(newAnswer);
        this._contentDiv.appendChild(newAnsRowDiv);
      };
    };
  }

  // Get user's current answers in the DB for this category.
  async #getDBAnswers() {
    const fetchCurrDBAnswers = await fetch(`/questions/user-answers/${this._categoryTypeName}/${this._categoryName}`);
    const currDBAnswers = await fetchCurrDBAnswers.json();
    return currDBAnswers;
  }

  _getScoreText(prevAns) {
    return prevAns.skip ? "Skipped" : Number(prevAns.answerVal).toFixed(1);
  }

  _addToQDiv(qInfo) {
    qInfo.qSourceItem.appendChild(qInfo.qText);
    qInfo.qSourceItem.appendChild(qInfo.qScore);
    return qInfo.qSourceItem;
  }
  
  _getHoverText() {
    return "Re-rate it!";
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/answerUiPanel.mjs":
/*!****************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/answerUiPanel.mjs ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnswerUIPanel": () => (/* binding */ AnswerUIPanel)
/* harmony export */ });
class AnswerUIPanel {
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
    this.currQuestionText.innerHTML = newQInfo.currQText;
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

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/baseQuestionsQueue.mjs":
/*!****************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/baseQuestionsQueue.mjs ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseQuestionsQueue": () => (/* binding */ BaseQuestionsQueue)
/* harmony export */ });
/* harmony import */ var _questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../questionsHelpers.mjs */ "./src/js/modules/questions/questionsHelpers.mjs");
/* harmony import */ var _components_domQueue_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/domQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/components/domQueue.mjs");





class BaseQuestionsQueue {
  _categoryTypeName;
  _categoryName;
  queue = [];
  queueType;
  _domQueue;
  _queuePrevQs = [];

  constructor(qModeMainDiv, categoryType = null, category = null) {
    this._categoryTypeName = categoryType;
    this._categoryName = category;
    this._domQueue = new _components_domQueue_mjs__WEBPACK_IMPORTED_MODULE_1__.DomQueue(qModeMainDiv, categoryType, category);
  }

  // Gets the text to display of the current first item in the questions queue.
  getCurrQInfo() {
    let currQText;
    let currQAns;
    let endOfQueue = false;

    // Hide question answer panel if run out of questions and display a message.
    if (this.queue.length === 0) {
      currQText = this._getEndQueueMsg();
      endOfQueue = true;
    }
    else {
      const currQ = this.queue[0];
      const [catTypeName, catName] = (0,_questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__.getQCategory)(currQ, this._categoryTypeName, 
        this._categoryName);
        
      currQText = (0,_questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__.getQInfo)(currQ, "qDisplayText", catTypeName, catName);
      currQAns = currQ.currAns;
    };

    return {endOfQueue, currQText, currQAns};
  }

  _getEndQueueMsg() {
    return this.endQueueMsg;
  }

  // Removes an item from the queue and the corresponding item from the DOM 
  // queue. Returns the removed queue item.
  removeQueueItem(idx, doTrans) {
    const thisQueueItem = this.queue[idx];
    this.queue.splice(idx, 1);
    this._domQueue.removeQueueItem(idx, doTrans);

    return thisQueueItem;
  }

  // Adds array of questions to queue and adds corresponding new elements to 
  // DOM queue too.
  _addToQueue(qs) {
    this.queue = this.queue.concat(qs);
    this._domQueue.addToQueue(qs);
  }

  // Clears the DOM items queue.
  _resetQueue() {
    this.queue = [];
    this._domQueue.resetQueue();
    this._queuePrevQs = [];
  }

  savePrevQ(qId) {
    this._queuePrevQs.push(qId);
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/components/domQueue.mjs":
/*!*****************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/components/domQueue.mjs ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomQueue": () => (/* binding */ DomQueue)
/* harmony export */ });
/* harmony import */ var _questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../questionsHelpers.mjs */ "./src/js/modules/questions/questionsHelpers.mjs");
// Helper class for the base questions queue, to represent the DOM queue items.




// (eg. poster images) and handle their transitions when answering questions.
class DomQueue {
  _queue = [];
  #numTransitions = 0;
  #categoryTypeName;
  #categoryName;

  static LAZY_LOAD_START_IDX = 4;

  constructor(qModeMainDiv, categoryType, category) {
    this._queue = qModeMainDiv.querySelector(".queue-imgs");
    this.#categoryTypeName = categoryType;
    this.#categoryName = category;

    this._queue.addEventListener("transitionend", evt => {
      this.#endTransition(evt);
    });
  }

  // Once DOM queue has done the transition for answering a question, delete 
  // the dom question. Check in case any more transitions are queued and carry 
  // them out if so.
  #endTransition(evt) {
    if (evt.propertyName !== "left") return;

    this.#numTransitions--;
    this._deleteDomQ(0);
    this._queue.classList.remove("queue-imgs-transitioning");
    
    // If user has clicked multiple answers quickly, then carry out any 
    // queued transitions for further answers.
    if (this.#numTransitions > 0) {
      setTimeout(() => this.#doTransition(), 0);
    };    
  }

  // Create DOM queue images and audio (where present) from list of questions.
  addToQueue(qs) {
    for (let q of qs) {
      const [catTypeName, catName] = (0,_questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__.getQCategory)(q, 
        this.#categoryTypeName, this.#categoryName);
      
      const lazyLoad = this._queue.childElementCount >= DomQueue.LAZY_LOAD_START_IDX;

      const newDomQ = (0,_questionsHelpers_mjs__WEBPACK_IMPORTED_MODULE_0__.createQDomItem)(q, catTypeName, catName, lazyLoad);
      newDomQ.setAttribute("data-id", q._id);
      this._queue.appendChild(newDomQ);
    };
  }

  // Remove an item from the DOM images queue and handle the transition.
  removeQueueItem(idx, doTrans) {
    if (this._queue.hasChildNodes()) {
      // If first item in queue (ie. have answered a question), then need to 
      // handle the transition of images.
      if (idx === 0 && doTrans) {
        this.#numTransitions++;
        this.#doTransition();
      }

      // Otherwise just delete the DOM queue item.
      else {
        this._deleteDomQ(idx);
      };
    };
  }

  // Deletes an individual DOM queue item.
  _deleteDomQ(idx) {
    // If removing outdated queue items from middle of queue but queue is still 
    // transitioning, boost the index by 1 to factor in that the previously 
    // answered q will have been removed from the queue but not the dom queue yet 
    // as the transition hasn't yet completed.
    if (this._queue.classList.contains("queue-imgs-transitioning") && idx > 0) {
      idx++;
    };

    this._queue.removeChild(this._queue.children[idx]);
  }

  // Causes transitioning of poster images when answering a question.
  #doTransition() {
    this._queue.classList.add("queue-imgs-transitioning");
  }

  resetQueue() {
    this._queue.innerText = "";
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/components/singleDomQueue.mjs":
/*!***********************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/components/singleDomQueue.mjs ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SingleDomQueue": () => (/* binding */ SingleDomQueue)
/* harmony export */ });
/* harmony import */ var _domQueue_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/components/domQueue.mjs");




class SingleDomQueue extends _domQueue_mjs__WEBPACK_IMPORTED_MODULE_0__.DomQueue {
  // Remove an item from the DOM images queue and handle the transition.
  removeQueueItem(idx, doTrans) {
    if (this._queue.hasChildNodes()) {
      if (idx === 0) {
        this._deleteDomQ(idx);
      };
    };
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/questionsQueue.mjs":
/*!***************************************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/questionsQueue.mjs ***!
  \***************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QuestionsQueue": () => (/* binding */ QuestionsQueue)
/* harmony export */ });
/* harmony import */ var _baseQuestionsQueue_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../baseQuestionsQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/baseQuestionsQueue.mjs");




// For retreiving new questions from server.
class QuestionsQueue extends _baseQuestionsQueue_mjs__WEBPACK_IMPORTED_MODULE_0__.BaseQuestionsQueue {
  static #QUEUE_REFRESH_AMOUNT = 30;
  _QUEUE_REFRESH_THRESHOLD = 10;
  #filters;
  _endOfQSource = false;
  _currentlyUpdating = false;
  endQueueMsg;
  inputPanel;
  allRecentAnswers = [];

  // Add items to the questions queue if it's running low and there are 
  // unanswered questions remaining in the source. isNewQueue is boolean for 
  // whether queue should be started from scratch, used when the queue input 
  // criteria have changed eg. new search term.
  async update(isNewQueue = false) {
    this._updateQueuePrevQs(isNewQueue);

    let updated = false;

    // If already waiting for fetch on a previous update call, don't update.
    if (this._currentlyUpdating) return;

    const queueToBeUpdated = this.checkQueueToBeUpdated();

    if (queueToBeUpdated) {
      // Queue needs to and can be extended.
      const numNewQs = QuestionsQueue.#QUEUE_REFRESH_AMOUNT;
      const currQueueIds = this.queue.map(q => q._id);

      let startApiPage = 1;
      if (!isNewQueue) {
        const maxQueueApiPage = this.queue.at(-1)?.apiPageNum;
        startApiPage = this.queue.length > 0 ? maxQueueApiPage : 1;
      };

      // POST request to server for new questions for the queue.
      const newQuestionsObj = await this.#postNewQsRequest(numNewQs, 
        currQueueIds, startApiPage);

      this._endOfQSource = newQuestionsObj.endOfQSource;

      this._addToQueue(newQuestionsObj.results);
      updated = true;
    };

    return updated;
  }

  // If a new queue (eg. changing incl. already answered tickbox or new search 
  // term) then reset this queuePrevQs.
  _updateQueuePrevQs(isNewQueue) {
    if (isNewQueue) {
      this._queuePrevQs = [];
    };
  }

  // Checks if the queue needs and can be updated.
  checkQueueToBeUpdated() {
    const queueNeedsExtending = this.queue.length <= this._QUEUE_REFRESH_THRESHOLD;
    const moreQsInSource = !this._endOfQSource;

    const queueToBeUpdated = queueNeedsExtending && moreQsInSource;
    return queueToBeUpdated;
  }

  // 
  setRecentAnswers(allRecentAnswers) {
    this.allRecentAnswers = allRecentAnswers;
  }

  // Checks each question in the queue to see if it has recently been answered 
  // (and therefore should no longer be in the queue, or should be there with a 
  // newer answer value) and handles this. answerQ is true only if this was 
  // triggered from answering a question, so in this case the transitions should be done.
  checkForOutdatedQs(answerQ = false) {
    for (let ans of this.allRecentAnswers) {
      const queueIndex = this.queue.findIndex(q => q._id === ans.questionId);

      if (queueIndex > -1) {
        this.handleOutdatedQueueItem(queueIndex, ans, answerQ);
      };
    };
  }

  // If question in the queue has been answered recently and data isn't 
  // reflected on server yet, update answer info with latest local answer info.
  handleOutdatedQueueItem(queueIndex, recentAnswer, doTrans) {
    const inclPrevAnswers = this.inputPanel?.includeAlreadyAnsweredCheckbox?.checked;
    const previouslyInThisQueue = this._queuePrevQs.includes(this.queue[queueIndex]._id);
    // If want to include already answered questions, then just update the 
    // queue question currAns to the latest local answer info.
    if (inclPrevAnswers && !previouslyInThisQueue) {
      this.queue[queueIndex].currAns = {
        skip: recentAnswer.skip,
        answerVal: recentAnswer?.answerVal
      };
    }
    // Otherwise, remove this now answered question from the queue.
    else {
      this.removeQueueItem(queueIndex, doTrans);
    };
  }

  // Gets more items to the questions queue, when it's running low.
  async #postNewQsRequest(numQuestions, currQueueIds, startApiPage) {
    this._currentlyUpdating = true;
    
    const postObj = this._getPostObj(numQuestions, currQueueIds, startApiPage);

    const fetchResponse = await fetch(`/questions/${this._categoryTypeName}/${this._categoryName}`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(postObj)
    });

    const newQuestions = await fetchResponse.json();

    this._currentlyUpdating = false;

    return newQuestions;
  }

  // Makes the object to POST for updating the queue.
  _getPostObj(numQuestions, currQueueIds, startApiPage) {
    return {
      type: "updateQueue",
      data: {
        queueType: this.queueType,
        numQs: numQuestions,
        currQueueIds: currQueueIds,
        startApiPage: startApiPage,
        filters: {}
      }
    };
  }

  // Resets the search queue, ready for a new search query and update call or a 
  // new queue after toggling "include already answered".
  reset() {
    this._resetQueue();
    this._endOfQSource = false;
    this._currentlyUpdating = false;
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/sub-classes/autoQuestionsQueue.mjs":
/*!*******************************************************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/sub-classes/autoQuestionsQueue.mjs ***!
  \*******************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoQuestionsQueue": () => (/* binding */ AutoQuestionsQueue)
/* harmony export */ });
/* harmony import */ var _questionsQueue_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../questionsQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/questionsQueue.mjs");




class AutoQuestionsQueue extends _questionsQueue_mjs__WEBPACK_IMPORTED_MODULE_0__.QuestionsQueue {
  endQueueMsg = "You have answered all suggested questions in this category! Use Search to answer more!";
  queueType = "auto";

  // Adds in data on whether previously answered questions should be included.
  _getPostObj(numQuestions, currQueueIds, startApiPage) {
    const postObj = super._getPostObj(numQuestions, currQueueIds, 
      startApiPage);

    postObj.data.includeAnsweredQs = this.inputPanel.includeAlreadyAnsweredCheckbox.checked;
    return postObj;
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/sub-classes/searchQuestionsQueue.mjs":
/*!*********************************************************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/sub-classes/searchQuestionsQueue.mjs ***!
  \*********************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchQuestionsQueue": () => (/* binding */ SearchQuestionsQueue)
/* harmony export */ });
/* harmony import */ var _questionsQueue_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../questionsQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/questionsQueue.mjs");




class SearchQuestionsQueue extends _questionsQueue_mjs__WEBPACK_IMPORTED_MODULE_0__.QuestionsQueue {
  endQueueMsg = "No results for this search term (or you answered them all already), try another!";
  noSearchTermMsg = "Enter a search term!";
  queueType = "search";
  searchQuery = "";

  _getEndQueueMsg() {
    let endQueueMsg = (this.searchQuery === "") ? this.noSearchTermMsg : this.endQueueMsg;
    return endQueueMsg;
  }

  // Checks if the queue needs and can be extended.
  checkQueueToBeUpdated() {
    const canBeUpdated = super.checkQueueToBeUpdated();
    const isValidSearch = this.searchQuery !== "";
    return canBeUpdated && isValidSearch;
  }

  // Returns whether search query has changed or not.
  checkSearchTermChanged() {
    const prevSearchTerm = this.searchQuery;
    this.setSearchQuery();
    return this.searchQuery !== prevSearchTerm;
  }

  setSearchQuery() {
    this.searchQuery = encodeURI(this.inputPanel.searchInput.value);
  }

  // Search queue version of the making the post object for updating the queue, 
  // also includes the search query and whether previously answered questions 
  // should be included.
  _getPostObj(numQuestions, currQueueIds, startApiPage) {
    const postObj = super._getPostObj(numQuestions, currQueueIds, 
      startApiPage);

    postObj.data.searchQuery = this.searchQuery;
    postObj.data.includeAnsweredQs = this.inputPanel.includeAlreadyAnsweredCheckbox.checked;
    return postObj;
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/singleQuestionQueue.mjs":
/*!*****************************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/singleQuestionQueue.mjs ***!
  \*****************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SingleQuestionQueue": () => (/* binding */ SingleQuestionQueue)
/* harmony export */ });
/* harmony import */ var _baseQuestionsQueue_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../baseQuestionsQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/baseQuestionsQueue.mjs");
/* harmony import */ var _components_singleDomQueue_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/singleDomQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/components/singleDomQueue.mjs");





class SingleQuestionQueue extends _baseQuestionsQueue_mjs__WEBPACK_IMPORTED_MODULE_0__.BaseQuestionsQueue {

  constructor(qModeMainDiv, categoryType = null, category = null) {
    super(qModeMainDiv, categoryType, category);

    this._domQueue = new _components_singleDomQueue_mjs__WEBPACK_IMPORTED_MODULE_1__.SingleDomQueue(qModeMainDiv, categoryType, category);
  }

  update(question) {
    this._resetQueue();
    this._addToQueue([question]);
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/queueInputPanel/queueInputPanel.mjs":
/*!**********************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/queueInputPanel/queueInputPanel.mjs ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QueueInputPanel": () => (/* binding */ QueueInputPanel)
/* harmony export */ });
class QueueInputPanel {
  mainDiv;

  constructor(qModeDiv) {
    this.mainDiv = qModeDiv.querySelector(".queue-input-panel");
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/queueInputPanel/sub-classes/autoQueueInputPanel.mjs":
/*!**************************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/queueInputPanel/sub-classes/autoQueueInputPanel.mjs ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoQueueInputPanel": () => (/* binding */ AutoQueueInputPanel)
/* harmony export */ });
/* harmony import */ var _queueInputPanel_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../queueInputPanel.mjs */ "./src/js/modules/questions/components/questionsMode/components/queueInputPanel/queueInputPanel.mjs");




class AutoQueueInputPanel extends _queueInputPanel_mjs__WEBPACK_IMPORTED_MODULE_0__.QueueInputPanel {
  includeAlreadyAnsweredCheckbox;

  constructor(qModeDiv) {
    super(qModeDiv);
    this.includeAlreadyAnsweredCheckbox = this.mainDiv.querySelector(".incl-prev-ans");
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/components/queueInputPanel/sub-classes/searchQueueInputPanel.mjs":
/*!****************************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/components/queueInputPanel/sub-classes/searchQueueInputPanel.mjs ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchQueueInputPanel": () => (/* binding */ SearchQueueInputPanel)
/* harmony export */ });
/* harmony import */ var _queueInputPanel_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../queueInputPanel.mjs */ "./src/js/modules/questions/components/questionsMode/components/queueInputPanel/queueInputPanel.mjs");




class SearchQueueInputPanel extends _queueInputPanel_mjs__WEBPACK_IMPORTED_MODULE_0__.QueueInputPanel {
  includeAlreadyAnsweredCheckbox;
  searchInput;
  searchBtn;

  constructor(qModeDiv) {
    super(qModeDiv);
    this.includeAlreadyAnsweredCheckbox = this.mainDiv.querySelector(".incl-prev-ans");
    this.searchInput = this.mainDiv.querySelector(".search-input");
    this.searchBtn = this.mainDiv.querySelector(".search-btn");
  }

  init() {
    // Pressing enter in search input carries out the search.
    this.searchInput.addEventListener("keyup", event => {
      if (event.keyCode === 13) {
          event.preventDefault();
          this.searchBtn.click();
      };
    });
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/questionsMode.mjs":
/*!*****************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/questionsMode.mjs ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QuestionsMode": () => (/* binding */ QuestionsMode)
/* harmony export */ });
/* harmony import */ var _fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../fadeTransitions.mjs */ "./src/js/modules/fadeTransitions.mjs");
/* harmony import */ var _components_answerUiPanel_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/answerUiPanel.mjs */ "./src/js/modules/questions/components/questionsMode/components/answerUiPanel.mjs");





class QuestionsMode extends EventTarget {
  mainDiv;
  answerUiPanel;
  questionsQueue;
  btn;

  constructor(mainDiv, btn = null) {
    super();
    this.mainDiv = mainDiv;
    this.btn = btn;
    this.answerUiPanel = new _components_answerUiPanel_mjs__WEBPACK_IMPORTED_MODULE_1__.AnswerUIPanel(mainDiv);
  }

  // Sets up the answer UI panel button event listeners.
  init() {
    this.answerUiPanel.rateBtn.addEventListener("click", evt => {
      this.answerQuestion(evt);
    });
    this.answerUiPanel.skipBtn.addEventListener("click", evt => {
      this.answerQuestion(evt);
    });
  }

  // Passes the allRecentAnswers on to the questions queue.
  setRecentAnswers(allRecentAnswers) {
    this.questionsQueue.setRecentAnswers(allRecentAnswers);
  }

  // Updates the displayed question in the answer UI panel with the new first 
  // queue item.
  _showCurrQ(inclAlreadyAnswered = true) {
    // Gets information on whether queue is now empty, or what the next 10 
    // queue items (and first question user answer, if necessary) should be.
    const newCurrQInfo = this.questionsQueue.getCurrQInfo();

    this.answerUiPanel.displayCurrQ(newCurrQInfo, inclAlreadyAnswered);
  }

  // Gets current answer to current question as an object for DB.
  getAnswerObj(event, currQuestion) {
    const userSkipped = (event.currentTarget === this.answerUiPanel.skipBtn);
    const thisScore = (userSkipped ? null : Number(this.answerUiPanel.
      scoreSliderInput.value));
      
    const questionDetails = this._getQuestionDetails(currQuestion);

    const answerInfo = {
      questionId: currQuestion._id,
      skip: userSkipped,
      questionDetails: questionDetails
    };
  
    if (!userSkipped) {
      answerInfo.answerVal = thisScore;
    };

    return answerInfo;
  }

  // Gets all the question details (eg. title, release date etc.) for the current 
  // question in an object to be added to the answers object, to be added to the DB.
  _getQuestionDetails(currQuestion) {
    const questionDetails = {};
    const propsToIgnore = ["_id", "apiPageNum", "alreadyInDb", "currAns"];

    for (let prop in currQuestion) {
      const ignoreProp = propsToIgnore.includes(prop);
      if (ignoreProp) continue;
      questionDetails[prop] = currQuestion[prop];
    };

    return questionDetails;
  }

  activate() {
    if (this.btn) {
      this.btn.classList.add("active-q-mode");
    };

    (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fadeIn)(this.mainDiv);
  }

  deactivate() {
    if (this.btn) {
      this.btn.classList.remove("active-q-mode");
    };

    (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fadeOut)(this.mainDiv);
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/qModeWithQueueInput.mjs":
/*!*******************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/qModeWithQueueInput.mjs ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QModeWithQueueInput": () => (/* binding */ QModeWithQueueInput)
/* harmony export */ });
/* harmony import */ var _questionsMode_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../questionsMode.mjs */ "./src/js/modules/questions/components/questionsMode/questionsMode.mjs");




class QModeWithQueueInput extends _questionsMode_mjs__WEBPACK_IMPORTED_MODULE_0__.QuestionsMode {
  queueInputPanel;

  // Save answer information, update the queue if necessary.
  async answerQuestion(event) {
    const currQuestion = this.questionsQueue.removeQueueItem(0, true);

    this.questionsQueue.savePrevQ(currQuestion._id);

    // Get the answer object as it should be stored in the DB.
    const answerObj = this.getAnswerObj(event, currQuestion);

    // Emit event to be picked up by the questions page.
    this.dispatchEvent(
      new CustomEvent("answeredQ", {detail: {answerObj: answerObj}})
    );

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();

    // Adds more questions to the questions queue if necessary.
    let queueUpdated = await this.questionsQueue.update();
    if (queueUpdated) {
      this.questionsQueue.checkForOutdatedQs(true);
    };
  }

  // Updates the displayed question in the answer UI panel with the new first 
  // queue item. 
  _showCurrQ() {
    const inclAlreadyAnswered = this.queueInputPanel?.
      includeAlreadyAnsweredCheckbox.checked;

    super._showCurrQ(inclAlreadyAnswered);
  }

  async activate() {
    super.activate();
  }

  // Updates the questions queue and then displays the first question of it, 
  // called when switching to this questions mode.
  async updateQueueAndShowFirst(isNewQueue = false) {
    this.answerUiPanel.showLoader();
    await this.updateQueue(isNewQueue);
    this.answerUiPanel.hideLoader();
    this._showCurrQ();
  }

  // Updates the questions queue.
  async updateQueue(isNewQueue) {
    // Queue will only update if it's short on answers.
    await this.questionsQueue.update(isNewQueue);

    // Checks the queue to see if any questions in it are now outdated based on 
    // recently POSTed answers or recent answers from other questions modes that 
    // haven't yet been POSTed.
    this.questionsQueue.checkForOutdatedQs();
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/autoMode.mjs":
/*!********************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/autoMode.mjs ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoMode": () => (/* binding */ AutoMode)
/* harmony export */ });
/* harmony import */ var _qModeWithQueueInput_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../qModeWithQueueInput.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/qModeWithQueueInput.mjs");
/* harmony import */ var _components_queueInputPanel_sub_classes_autoQueueInputPanel_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/queueInputPanel/sub-classes/autoQueueInputPanel.mjs */ "./src/js/modules/questions/components/questionsMode/components/queueInputPanel/sub-classes/autoQueueInputPanel.mjs");
/* harmony import */ var _components_baseQuestionsQueue_sub_classes_questionsQueue_sub_classes_autoQuestionsQueue_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/baseQuestionsQueue/sub-classes/questionsQueue/sub-classes/autoQuestionsQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/sub-classes/autoQuestionsQueue.mjs");








class AutoMode extends _qModeWithQueueInput_mjs__WEBPACK_IMPORTED_MODULE_0__.QModeWithQueueInput {
  name = "auto";

  constructor(mainDiv, categoryType, category, btn = null) {
    super(mainDiv, btn);
    this.questionsQueue = new _components_baseQuestionsQueue_sub_classes_questionsQueue_sub_classes_autoQuestionsQueue_mjs__WEBPACK_IMPORTED_MODULE_2__.AutoQuestionsQueue(mainDiv, categoryType, category);
    this.queueInputPanel = new _components_queueInputPanel_sub_classes_autoQueueInputPanel_mjs__WEBPACK_IMPORTED_MODULE_1__.AutoQueueInputPanel(mainDiv);
  }

  // Sets up the queue input panel and answer UI panel button event listeners.
  init() {
    super.init();
    this.questionsQueue.inputPanel = this.queueInputPanel;

    this.queueInputPanel.includeAlreadyAnsweredCheckbox.addEventListener(
      "click", async () => {

      this.questionsQueue.reset();
      await this.updateQueueAndShowFirst(true);
    });
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/searchMode.mjs":
/*!**********************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/searchMode.mjs ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchMode": () => (/* binding */ SearchMode)
/* harmony export */ });
/* harmony import */ var _qModeWithQueueInput_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../qModeWithQueueInput.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/qModeWithQueueInput.mjs");
/* harmony import */ var _components_queueInputPanel_sub_classes_searchQueueInputPanel_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/queueInputPanel/sub-classes/searchQueueInputPanel.mjs */ "./src/js/modules/questions/components/questionsMode/components/queueInputPanel/sub-classes/searchQueueInputPanel.mjs");
/* harmony import */ var _components_baseQuestionsQueue_sub_classes_questionsQueue_sub_classes_searchQuestionsQueue_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/baseQuestionsQueue/sub-classes/questionsQueue/sub-classes/searchQuestionsQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/questionsQueue/sub-classes/searchQuestionsQueue.mjs");








class SearchMode extends _qModeWithQueueInput_mjs__WEBPACK_IMPORTED_MODULE_0__.QModeWithQueueInput {
  name = "search";

  constructor(mainDiv, categoryType, category, btn = null) {
    super(mainDiv, btn);
    this.questionsQueue = new _components_baseQuestionsQueue_sub_classes_questionsQueue_sub_classes_searchQuestionsQueue_mjs__WEBPACK_IMPORTED_MODULE_2__.SearchQuestionsQueue(mainDiv, categoryType, category);
    this.queueInputPanel = new _components_queueInputPanel_sub_classes_searchQueueInputPanel_mjs__WEBPACK_IMPORTED_MODULE_1__.SearchQueueInputPanel(mainDiv);
  }

  // Updates the questions queue and then displays the first question of it, 
  // called when switching to this questions mode.
  async updateQueueAndShowFirst(isNewQueue = false) {
    if (this.queueInputPanel.searchInput.value !== "") {
      this.answerUiPanel.showLoader();
      await super.updateQueue(isNewQueue);
    };
  
    this.answerUiPanel.hideLoader();
    this._showCurrQ();
  }

  // Sets up the queue input panel and answer UI panel button event listeners.
  init() {
    super.init();
    this.questionsQueue.inputPanel = this.queueInputPanel;
    this.questionsQueue.inputPanel.init();

    this.queueInputPanel.searchBtn.addEventListener("click", async () => {
      const searchTermChanged = this.questionsQueue.checkSearchTermChanged();
      if (searchTermChanged) {
        this.#resetQueueAndUpdate();
      };
    });

    this.queueInputPanel.includeAlreadyAnsweredCheckbox.addEventListener(
      "click", async () => {
      this.#resetQueueAndUpdate();
    });
  }

  async #resetQueueAndUpdate() {
    this.questionsQueue.reset();
    this.questionsQueue.setSearchQuery();
    await this.updateQueueAndShowFirst(true);
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/singleAnswerMode.mjs":
/*!*************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/singleAnswerMode.mjs ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SingleAnswerMode": () => (/* binding */ SingleAnswerMode)
/* harmony export */ });
/* harmony import */ var _questionsMode_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../questionsMode.mjs */ "./src/js/modules/questions/components/questionsMode/questionsMode.mjs");
/* harmony import */ var _components_baseQuestionsQueue_sub_classes_singleQuestionQueue_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/baseQuestionsQueue/sub-classes/singleQuestionQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/singleQuestionQueue.mjs");
/* harmony import */ var _centreModal_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../centreModal.mjs */ "./src/js/modules/centreModal.mjs");








class SingleAnswerMode extends _questionsMode_mjs__WEBPACK_IMPORTED_MODULE_0__.QuestionsMode {
  name = "single";
  _qSource;
  _answerUiModal;

  constructor(mainDiv, qSource, btn = null) {
    super(mainDiv, btn);
    this.questionsQueue = new _components_baseQuestionsQueue_sub_classes_singleQuestionQueue_mjs__WEBPACK_IMPORTED_MODULE_1__.SingleQuestionQueue(mainDiv);
    this._qSource = qSource;

    const modalWrapper = mainDiv.querySelector(".centre-modal-wrapper");
    this._answerUiModal = new _centreModal_mjs__WEBPACK_IMPORTED_MODULE_2__.CentreModal(modalWrapper);
  }

  init() {
    super.init();

    this._qSource.addEventListener("answerSingleQ", evt => {
      this._handleClickSingleQ(evt);
    });

    this._answerUiModal.init();
  }

  // Save answer information.
  answerQuestion(event) {
    const currQuestion = this.questionsQueue.removeQueueItem(0, true);

    // Get the answer object as it should be stored in the DB.
    const answerObj = this.getAnswerObj(event, currQuestion); 

    // Emit event to be picked up by the questions page.
    this.dispatchEvent(
      new CustomEvent("answeredQ", {detail: {answerObj: answerObj}})
    );

    // Hide the answer ui panel.
    this._answerUiModal.hide();

    return answerObj;
  }

  _handleClickSingleQ(evt) {
    // Get the question from this item and make it the queue contents.
    const thisQItem = evt.detail.question;
    const thisQuestion = this._makeQuestion(thisQItem);
    this.questionsQueue.update(thisQuestion);

    // Show the answer ui panel.
    this._answerUiModal.show();

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();
  }
}

/***/ }),

/***/ "./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/prevAnswerMode.mjs":
/*!***********************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/prevAnswerMode.mjs ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PrevAnswerMode": () => (/* binding */ PrevAnswerMode)
/* harmony export */ });
/* harmony import */ var _singleAnswerMode_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../singleAnswerMode.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/singleAnswerMode.mjs");
/* harmony import */ var _components_baseQuestionsQueue_sub_classes_singleQuestionQueue_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/baseQuestionsQueue/sub-classes/singleQuestionQueue.mjs */ "./src/js/modules/questions/components/questionsMode/components/baseQuestionsQueue/sub-classes/singleQuestionQueue.mjs");






class PrevAnswerMode extends _singleAnswerMode_mjs__WEBPACK_IMPORTED_MODULE_0__.SingleAnswerMode {
  name = "prevAns";

  constructor(mainDiv, qSource, catTypeName, catName, btn = null) {
    super(mainDiv, qSource, btn);
    this.questionsQueue = new _components_baseQuestionsQueue_sub_classes_singleQuestionQueue_mjs__WEBPACK_IMPORTED_MODULE_1__.SingleQuestionQueue(mainDiv, catTypeName, catName);
  }

  // Passes the latestSession answers on to the qSource.
  setRecentAnswers(latestSessionAnswers) {
    this._qSource.updateAnswersList(latestSessionAnswers);
  }

  async activate() {
    super.activate();
    await this._qSource.activate();
  }

  deactivate() {
    this._qSource.deactivate();
    super.deactivate();
  }

  // Makes a question, ready to be shown in the answerUiPanel, from the clicked 
  // on prevAnswer.
  _makeQuestion(prevAns) {
    const thisQ = {
      _id: prevAns.questionId,
      currAns: {
        skip: prevAns?.skip,
        answerVal: prevAns?.answerVal
      }
    };

    for (let prop in prevAns.questionDetails) {
      thisQ[prop] = prevAns.questionDetails[prop]
    };

    return thisQ;
  }
}

/***/ }),

/***/ "./src/js/modules/questions/questionsHelpers.mjs":
/*!*******************************************************!*\
  !*** ./src/js/modules/questions/questionsHelpers.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createQDomItem": () => (/* binding */ createQDomItem),
/* harmony export */   "getQCategory": () => (/* binding */ getQCategory),
/* harmony export */   "getQInfo": () => (/* binding */ getQInfo)
/* harmony export */ });
// Returns the category and type for a given question and object. If object has 
// no category then use that of the question. Used on baseQuestions Queue and 
// singleModeQSource.
function getQCategory(q, objCatType, objCat) {
  return (objCat) ? [objCatType, objCat] : 
    [q.categoryTypeName ?? q.categoryType, q.categoryName ?? q.category];
}

// Gets the correct image path, depending on the category.
function getQInfo(q, detail, catTypeName, catName) {
  let info;

  switch(catTypeName, catName) {

    case ("Interests", "Films") :
      info = {
        imgPath: q?.posterPath ? `https://image.tmdb.org/t/p/w185/${q.posterPath}` : null,
        qDisplayText: `${q?.title} (${getDisplayReleaseDate(q?.releaseDate)})`,
        qSourceDisplayText: `${q?.title}`,
        imgPlaceHolderTxt: `${q?.title}`
      };
      break;

    case ("Interests", "TV") :
      info = {
        imgPath: q?.posterPath ? `https://image.tmdb.org/t/p/w185/${q.posterPath}` : null,
        qDisplayText: `${q?.title} (${getDisplayReleaseDate(q?.releaseDate)})`,
        qSourceDisplayText: `${q?.title}`,
        imgPlaceHolderTxt: `${q?.title}`
      };
      break;

    case ("Interests", "Music"):
      info = {
        imgPath: q?.image,
        qDisplayText: `${q?.trackName} - ${q?.artist} (${q?.album} - ${new Date(q?.releaseDate).getFullYear()})`,
        qSourceDisplayText: `${q?.trackName} - ${q?.artist}`,
        imgPlaceHolderTxt: `${q?.trackName}`
      };
      break;

    case ("Interests", "Video Games"):
      info = {
        imgPath: q?.image ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${q.image}.jpg` : null,
        qDisplayText: `${q?.title} (${getDisplayReleaseDate(q?.releaseDate)}) (${q.platforms})`,
        qSourceDisplayText: `${q?.title}`,
        imgPlaceHolderTxt: `${q?.title}`
      };
      break;

    case ("Interests", "Books"):
      info = {
        imgPath: q?.image ? `https://covers.openlibrary.org/b/id/${q.image}-M.jpg` : null,
        qDisplayText: `${q?.title} (${q?.author})`,
        qSourceDisplayText: `${q?.title}`,
        imgPlaceHolderTxt: `${q?.title}`
      };
      break;

    default:
      info = {
        imgPath: null,
        qDisplayText: q?.text,
        qSourceDisplayText: q?.shortText,
        imgPlaceHolderTxt: q?.shortText ?? q.text
      };
  };

  return info[detail];
}

function getDisplayReleaseDate(releaseDate) {
  return releaseDate ? new Date(releaseDate).getFullYear() : "Unknown";
}

// Used in the dom queue for answering questions (search and auto) and also in 
// prev answers and recommendations pages.
function createQDomItem(q, catTypeName, catName, lazyLoad = true) {
  const newDomQ = document.createElement("div");;

  const imgPath = getQInfo(q, "imgPath", catTypeName, catName);
  
  if (imgPath) {
    const domImg = document.createElement("img");
    domImg.setAttribute("src", imgPath);
    if (lazyLoad) domImg.setAttribute("loading", "lazy");

    domImg.setAttribute("alt", q?.title);
    newDomQ.appendChild(domImg);
  }
  else {
    const noImgDiv = document.createElement("div");
    noImgDiv.classList.add("placeholder-img");
    const noImgText = document.createElement("span");
    const placeholderText = getQInfo(q, "imgPlaceHolderTxt", catTypeName, catName);
    noImgText.innerText = placeholderText;

    noImgDiv.appendChild(noImgText);
    newDomQ.appendChild(noImgDiv);
  };

  if (q.previewUrl) {
    const domMusicPlayer = document.createElement("audio");
    domMusicPlayer.setAttribute("controls", "true");
    domMusicPlayer.setAttribute("src", q.previewUrl);
    newDomQ.appendChild(domMusicPlayer);
  };

  return newDomQ;
}

/***/ }),

/***/ "./src/js/modules/questions/questionsPage/questionsPage.mjs":
/*!******************************************************************!*\
  !*** ./src/js/modules/questions/questionsPage/questionsPage.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QuestionsPage": () => (/* binding */ QuestionsPage)
/* harmony export */ });
/* harmony import */ var _fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../fadeTransitions.mjs */ "./src/js/modules/fadeTransitions.mjs");
/* harmony import */ var _sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../sharedJs/utils.mjs */ "./src/sharedJs/utils.mjs");
/* harmony import */ var _components_questionsMode_sub_classes_qModeWithQueueInput_qModeWithQueueInput_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/questionsMode/sub-classes/qModeWithQueueInput/qModeWithQueueInput.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/qModeWithQueueInput.mjs");







class QuestionsPage {
  #switchingMode = false;
  questionsModes;
  qModeSwitcher;
  currQuestionMode;
  categoryTypeName;
  categoryName;
  // New answers that have not yet been POSTed to server.
  notYetPostedAnswers = [];
  // The not yet POSTed answers plus any answers that are POSTed but the save 
  // on back end hasn't completed yet.
  allRecentAnswers = [];
  static #submitAnswersInterval = 600000; // 10 mins

  constructor(qModes, qModeSwitcher = [], categoryTypeName = null, 
    categoryName = null) {

    this.questionsModes = qModes;
    this.qModeSwitcher = qModeSwitcher;
    this.categoryTypeName = categoryTypeName;
    this.categoryName = categoryName;
  }

  // Set up the event listeners for all buttons and protocol for uploading 
  // answers data.
  init() {
    // Set up event listeners for buttons within each questions mode.
    for (let qMode of this.questionsModes) {
      qMode.init();
    };

    // When questions page is left / tab closed, post any answers to the server.
    window.addEventListener("beforeunload", () => {
      this._postAnswers(true);
    });

    // Submit answers every 10 mins, if there are any.
    setInterval(() => {
      this._postAnswers(false);
    }, QuestionsPage.#submitAnswersInterval);

    // Listen for events emitted by any q mode when a question is answered.
    for (let qMode of this.questionsModes) {
      qMode.addEventListener("answeredQ", evt => {
        const answerObj = evt.detail.answerObj;
        this._handleNewAnswer(answerObj);
      });
    };

    // Init the qModeSwitcher.
    this.#initQModeSwitcher();
  }

  // Add event listeners for q mode switch buttons.
  #initQModeSwitcher() {
    for (let modeBtnLink of this.qModeSwitcher) {
      const qModeBtn = modeBtnLink.btn;
      const qMode = modeBtnLink.mode;

      qModeBtn.addEventListener("click", async () => {
        // Don't try to switch mode if already transitioning between two or if 
        // clicked on current qMode.
        const dontSwitchMode = this.#switchingMode || (this.currQuestionMode === qMode);
        if (dontSwitchMode) return;

        this.#switchingMode = true;
        await this.switchQMode(qMode)
        this.#switchingMode = false;
      });
    };
  }
  
  // Saves (or overwrites) new answer to notYetPosted and allRecentAnswers and 
  // then sends the updated recent answers array to the current questions mode.
  _handleNewAnswer(answerObj) {
    this._updateAnsArrayWithAns(this.notYetPostedAnswers, answerObj);
    this._updateAnsArrayWithAns(this.allRecentAnswers, answerObj);
    this._setRecentAnswers();
  }

  // Remove current question mode: hide it, get the latest answers and post 
  // them to the server.
  removeQmode() {
    this.currQuestionMode.deactivate();
  }

  // Set the new questions mode and show it.
  async setQMode(newQMode) {
    this.currQuestionMode = newQMode;
    await this.currQuestionMode.activate();

    this._setRecentAnswers();

    if (this.currQuestionMode instanceof _components_questionsMode_sub_classes_qModeWithQueueInput_qModeWithQueueInput_mjs__WEBPACK_IMPORTED_MODULE_2__.QModeWithQueueInput) {
      // Update the queue for the questions mode and show first item in the queue.
      await this.currQuestionMode.updateQueueAndShowFirst();
    };
  }

  _setRecentAnswers() {
    // Don't need to keep a list of recent answers for recommendations mode.
    if (this.currQuestionMode?.name !== "recs") {
      this.currQuestionMode.setRecentAnswers(this.allRecentAnswers);
    };
  }

  // Updates an origAnsArray with a new answer, overwriting where 
  // present in the origAnsArray (otherwise adding).
  _updateAnsArrayWithAns(origAnsArray, newAns) {
    const matchFunc = (arrItem, newItem) => {
      return arrItem.questionId === newItem.questionId
    };

    (0,_sharedJs_utils_mjs__WEBPACK_IMPORTED_MODULE_1__.findAndOverwriteElsePush)(origAnsArray, newAns, matchFunc);
  }

  // Switch between question modes.
  async switchQMode(newQMode) {
    this.removeQmode();
    await (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.finishFadeOut)(this.currQuestionMode.mainDiv);
    await this.setQMode(newQMode);
  }
  
  // Resets the new and updated answers for this questions page.
  resetAnswers() {
    this.notYetPostedAnswers = [];
  }

  // Once the fetch POST of some new answers every 10 mins has been completed, 
  // update the allRecentAnswers so that the queue has less to modify.
  clearRecentlyPostedAnswers(successPostedAnswers) {
    // Remove each successfully POSTed answer from this allRecentAnswers.
    for (let successPostedAnswer of successPostedAnswers) {
      const findIndex = getFindIndex(successPostedAnswer, this.allRecentAnswers);
      if (findIndex > -1) {
        this.allRecentAnswers.splice(findIndex, 1);
      };
    };
    
    // Finds this exact answer in the allRecentAnswers (same 
    // questionId may appear more than once so only find exact match with 
    // answer / skip value too).
    function getFindIndex(successPostedAnswer, updateAnswersArray) {
      const findIndex = updateAnswersArray.findIndex(ans => {
        let isMatch = true;
        const propsToCheck = ["questionId", "skip", "answerVal"];

        for (let prop in ans) {
          const skipProp = !propsToCheck.includes(prop);
          if (skipProp) continue;

          isMatch = ans[prop] === successPostedAnswer[prop];
          if (!isMatch) break;
        };

        return isMatch;
      });

      return findIndex;
    };
  }

  // POST these answers info to the server.
  async _postAnswers(isChangeOfPage = false) {
    // Check if there are any answers to upload.
    const noNewAnswers = this.notYetPostedAnswers.length === 0;
    if (noNewAnswers) return;

    const [postRoute, answersToPost] = this.#getPostInfo();

    const postObj = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "answers", 
        data: answersToPost
      })
    };
    
    // If moving off the page, keep fetch request alive.
    if (isChangeOfPage) {
      postObj.keepalive = true;
    };
    
    this.resetAnswers();
    await fetch(postRoute, postObj);

    this.clearRecentlyPostedAnswers(answersToPost);
  }

  // Gets the relevant postRoute and answersToPost format for whether uploading 
  // answers for a single category (from questions page) or for multiple 
  // categories (eg. from recommendations page).
  #getPostInfo() {
    const answersMixedCategories = !this.categoryName;

    let postRoute;
    let answersToPost;

    if (answersMixedCategories) {
      postRoute = `/questions/mixed-categories`;
      answersToPost = this.#getAnswersToPostCatInfo(this.notYetPostedAnswers);
    }
    else {
      postRoute = `/questions/${this.categoryTypeName}/${this.categoryName}`;
      answersToPost = this.notYetPostedAnswers.slice();
    };

    return [postRoute, answersToPost];
  }

  // Make a category info object with the answers for each category, for when 
  // uploading answers for multiple categories at once (eg. from recommendations page).
  #getAnswersToPostCatInfo(answersToPost) {
    const categoriesAnswers = [];

    // Populate categoriesAnswers with answers for each different category.
    for (let answer of answersToPost) {
      const thisAnsCatType = answer.questionDetails.categoryTypeName;
      const thisAnsCat = answer.questionDetails.categoryName;

      const foundCategoryIdx = categoriesAnswers.findIndex(list => {
        const catTypeMatch = list.catType === thisAnsCatType;
        const catMatch = list.cat === thisAnsCat;
        return (catTypeMatch && catMatch);
      });

      const formattedAns = formatAnswer(answer);

      if (foundCategoryIdx > -1) {
        categoriesAnswers[foundCategoryIdx].answers.push(formattedAns);
      }
      else {
        const newCategory = {
          catType: thisAnsCatType,
          cat: thisAnsCat,
          answers: [formattedAns]
        };

        categoriesAnswers.push(newCategory);
      };
    };

    // Remove the category and category type from the answer.
    function formatAnswer(answer) {
      delete answer.questionDetails.categoryName;
      delete answer.questionDetails.categoryTypeName;
      return answer;
    }

    return categoriesAnswers;
  }
}

/***/ }),

/***/ "./src/js/modules/questions/questionsPage/sub-classes/fullQuestionsPage.mjs":
/*!**********************************************************************************!*\
  !*** ./src/js/modules/questions/questionsPage/sub-classes/fullQuestionsPage.mjs ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FullQuestionsPage": () => (/* binding */ FullQuestionsPage)
/* harmony export */ });
/* harmony import */ var _questionsPage_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../questionsPage.mjs */ "./src/js/modules/questions/questionsPage/questionsPage.mjs");




// Questions page that included a previous answers section for seeing previous 
// answers made by the user, for use when in questions mode proper.
class FullQuestionsPage extends _questionsPage_mjs__WEBPACK_IMPORTED_MODULE_0__.QuestionsPage {
  // Just the session answers since last time was on the prev answers mode.
  #latestSessionAnswers = [];

  _setRecentAnswers() {
    // If currently in the previous answers mode, reset the latestSessionAnswers 
    // immediately after setting it as it will be reflected in the prev answers 
    // list straight away.
    if (this.currQuestionMode?.name === "prevAns") {
      this.currQuestionMode.setRecentAnswers(this.#latestSessionAnswers);
      this.#latestSessionAnswers = [];
    }
    else {
      this.currQuestionMode.setRecentAnswers(this.allRecentAnswers);
    };
  }

  // Adds new answer to latest session answers.
  _handleNewAnswer(answerObj) {
    this._updateAnsArrayWithAns(this.#latestSessionAnswers, answerObj);
    super._handleNewAnswer(answerObj);
  }
}

/***/ }),

/***/ "./src/js/pages/loggedInPage.js":
/*!**************************************!*\
  !*** ./src/js/pages/loggedInPage.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_popBtns_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/popBtns.mjs */ "./src/js/modules/popBtns.mjs");


/***/ }),

/***/ "./src/sharedJs/utils.mjs":
/*!********************************!*\
  !*** ./src/sharedJs/utils.mjs ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "awaitTransition": () => (/* binding */ awaitTransition),
/* harmony export */   "clamp": () => (/* binding */ clamp),
/* harmony export */   "findAndOverwriteElsePush": () => (/* binding */ findAndOverwriteElsePush),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "randBetween": () => (/* binding */ randBetween),
/* harmony export */   "testRandMult": () => (/* binding */ testRandMult),
/* harmony export */   "testRandom": () => (/* binding */ testRandom)
/* harmony export */ });
// Clamp number between two values.
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function lerp(start, end, prprtn = 0.5) {
  return start + ((end - start) * prprtn);
}

// For ints, it is inclusive of start and not inclusive of end.
function randBetween(start = 0, end = 1, ints = false) {
  const range = end - start;
  const randFloat = (Math.random() * range) + start;
  return ints ? Math.floor(randFloat) : randFloat;
}

// Probability should be a decimal, returns true or false.
function testRandom(probability) {
  return (Math.random() <= probability) ? true : false;
}

// Takes a list of prob objects as input in format {name: name, prob: prob} and 
// returns name of chosen probObj, or false if none chosen (in case that probObjs 
// probs dont sum to 1).
function testRandMult(...probs) {
  const probsObjs = [];
  let currProbStart = 0;

  probs.forEach(prob => {
    const thisProb = {
      name: prob.name,
      start: currProbStart,
      end: currProbStart + prob.prob
    };

    probsObjs.push(thisProb);

    currProbStart += prob;
  });

  const chosenVal = Math.random();
  let returnVal = false;

  probsObjs.forEach(prob => {
    const chosenThisProb = prob.start <= chosenVal && prob.end > chosenVal;
    if (chosenThisProb) {
      returnVal = prob.name;
    };
  });

  return returnVal;
}

// Searches for a newItem in an array given an elemCompFunc that determines 
// whether it is present or not (eg. to find based on question ID). If present, 
// element in array is overwritten with newItem, otherwise newItem is pushed to 
// end of array.
function findAndOverwriteElsePush(array, newItem, elemCompFunc) {
  const foundIndex = array.findIndex(arrItem => elemCompFunc(arrItem, newItem));

  // If found, overwrite.
  if (foundIndex > -1) {
    array.splice(foundIndex, 1, newItem);
  }
  // Otherwise add.
  else {
    array.push(newItem);
  };
}

// Returns a promise that resolves when transition on given element ends, 
// optional transition property name check.
function awaitTransition(elem, propName = null) {
  return new Promise(resolve => {
    elem.addEventListener("transitionend", async evt => {

      if (propName) {
        if (evt.propertyName === propName) {
          resolve();
        }

        else {
          await awaitTransition(elem, propName);
          resolve();
        };
      }

      else {
        resolve();
      };

    }, {once: true});
  })
}

// For testing long running functions.
// await new Promise(resolve => setTimeout(resolve, 3000)); //........................................................

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************************!*\
  !*** ./src/js/pages/questions.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_questions_questionsPage_sub_classes_fullQuestionsPage_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/questions/questionsPage/sub-classes/fullQuestionsPage.mjs */ "./src/js/modules/questions/questionsPage/sub-classes/fullQuestionsPage.mjs");
/* harmony import */ var _modules_questions_components_questionsMode_sub_classes_qModeWithQueueInput_sub_classes_autoMode_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/autoMode.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/autoMode.mjs");
/* harmony import */ var _modules_questions_components_questionsMode_sub_classes_qModeWithQueueInput_sub_classes_searchMode_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/searchMode.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/qModeWithQueueInput/sub-classes/searchMode.mjs");
/* harmony import */ var _modules_questions_components_questionsMode_sub_classes_singleAnswerMode_sub_classes_prevAnswerMode_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/prevAnswerMode.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/prevAnswerMode.mjs");
/* harmony import */ var _modules_questions_components_qSource_sub_classes_previousAnswers_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../modules/questions/components/qSource/sub-classes/previousAnswers.mjs */ "./src/js/modules/questions/components/qSource/sub-classes/previousAnswers.mjs");
/* harmony import */ var _loggedInPage_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./loggedInPage.js */ "./src/js/pages/loggedInPage.js");









// Current category info.
const mainHeader = document.querySelector(".main-header");
const categoryTypeName = mainHeader.dataset.catType;
const categoryName = mainHeader.dataset.cat;

// Question mode divs.
const autoQModeDiv = document.querySelector(".auto-mode");
const searchQModeDiv = document.querySelector(".search-mode");
const singleAnswerQModeDiv = document.querySelector(".single-answer-mode");

// Previous answers.
const prevAnswersListDiv = document.querySelector(".prev-answers-list");
const prevAnswersList = new _modules_questions_components_qSource_sub_classes_previousAnswers_mjs__WEBPACK_IMPORTED_MODULE_4__.PreviousAnswers(prevAnswersListDiv, 
  categoryTypeName, categoryName);

  // Question mode buttons.
const autoModeBtn = document.querySelector(".auto-queue-mode-btn");
const searchModeBtn = document.querySelector(".search-mode-btn");
const prevAnswersModeBtn = document.querySelector(".prev-answers-mode-btn");

// Create the question modes.
const autoQMode = new _modules_questions_components_questionsMode_sub_classes_qModeWithQueueInput_sub_classes_autoMode_mjs__WEBPACK_IMPORTED_MODULE_1__.AutoMode(autoQModeDiv, categoryTypeName, categoryName, autoModeBtn);
const searchQMode = new _modules_questions_components_questionsMode_sub_classes_qModeWithQueueInput_sub_classes_searchMode_mjs__WEBPACK_IMPORTED_MODULE_2__.SearchMode(searchQModeDiv, categoryTypeName, categoryName, searchModeBtn);
const prevAnswerQMode = new _modules_questions_components_questionsMode_sub_classes_singleAnswerMode_sub_classes_prevAnswerMode_mjs__WEBPACK_IMPORTED_MODULE_3__.PrevAnswerMode(singleAnswerQModeDiv, 
  prevAnswersList, categoryTypeName, categoryName, prevAnswersModeBtn);

const allQModes = [autoQMode, searchQMode, prevAnswerQMode];

// Create the questions mode switcher.
const qModeSwitcher = [
  {mode: autoQMode, btn: autoModeBtn},
  {mode: searchQMode, btn: searchModeBtn},
  {mode: prevAnswerQMode, btn: prevAnswersModeBtn}
];

// Create the questions page.
const questionsPage = new _modules_questions_questionsPage_sub_classes_fullQuestionsPage_mjs__WEBPACK_IMPORTED_MODULE_0__.FullQuestionsPage(allQModes, qModeSwitcher, 
  categoryTypeName, categoryName);

questionsPage.init();

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPage.setQMode(autoQMode);
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdHMEQ7QUFDZ0I7QUFDMUU7QUFFNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxrSUFBbUI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLDZFQUF3QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxtRUFBYTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG1DQUFtQztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHNCQUFzQixHQUFHLGtCQUFrQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDcFFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sZ0NBQWdDLDZEQUFhO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxvREFBb0Qsd0JBQXdCO0FBQzVFO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLEdBQUcsV0FBVztBQUNuQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsNERBQTREOzs7Ozs7VUNoRzVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQ055RztBQUN5QjtBQUNJO0FBQ0s7QUFDakM7QUFDL0U7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGtIQUFlO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsMElBQVE7QUFDOUIsd0JBQXdCLDhJQUFVO0FBQ2xDLDRCQUE0QixtSkFBYztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLGtDQUFrQztBQUNyQyxHQUFHLHNDQUFzQztBQUN6QyxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGlIQUFpQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvY2VudHJlTW9kYWwubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9mYWRlVHJhbnNpdGlvbnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9wb3BCdG5zLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcVNvdXJjZS9zaW5nbGVNb2RlUVNvdXJjZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3FTb3VyY2Uvc3ViLWNsYXNzZXMvcHJldmlvdXNBbnN3ZXJzLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9jb21wb25lbnRzL2Fuc3dlclVpUGFuZWwubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL2NvbXBvbmVudHMvYmFzZVF1ZXN0aW9uc1F1ZXVlL2Jhc2VRdWVzdGlvbnNRdWV1ZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9iYXNlUXVlc3Rpb25zUXVldWUvY29tcG9uZW50cy9kb21RdWV1ZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9iYXNlUXVlc3Rpb25zUXVldWUvY29tcG9uZW50cy9zaW5nbGVEb21RdWV1ZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9iYXNlUXVlc3Rpb25zUXVldWUvc3ViLWNsYXNzZXMvcXVlc3Rpb25zUXVldWUvcXVlc3Rpb25zUXVldWUubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL2NvbXBvbmVudHMvYmFzZVF1ZXN0aW9uc1F1ZXVlL3N1Yi1jbGFzc2VzL3F1ZXN0aW9uc1F1ZXVlL3N1Yi1jbGFzc2VzL2F1dG9RdWVzdGlvbnNRdWV1ZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9iYXNlUXVlc3Rpb25zUXVldWUvc3ViLWNsYXNzZXMvcXVlc3Rpb25zUXVldWUvc3ViLWNsYXNzZXMvc2VhcmNoUXVlc3Rpb25zUXVldWUubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL2NvbXBvbmVudHMvYmFzZVF1ZXN0aW9uc1F1ZXVlL3N1Yi1jbGFzc2VzL3NpbmdsZVF1ZXN0aW9uUXVldWUubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL2NvbXBvbmVudHMvcXVldWVJbnB1dFBhbmVsL3F1ZXVlSW5wdXRQYW5lbC5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9xdWV1ZUlucHV0UGFuZWwvc3ViLWNsYXNzZXMvYXV0b1F1ZXVlSW5wdXRQYW5lbC5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9xdWV1ZUlucHV0UGFuZWwvc3ViLWNsYXNzZXMvc2VhcmNoUXVldWVJbnB1dFBhbmVsLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9xdWVzdGlvbnNNb2RlLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9zdWItY2xhc3Nlcy9xTW9kZVdpdGhRdWV1ZUlucHV0L3FNb2RlV2l0aFF1ZXVlSW5wdXQubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL3N1Yi1jbGFzc2VzL3FNb2RlV2l0aFF1ZXVlSW5wdXQvc3ViLWNsYXNzZXMvYXV0b01vZGUubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL3N1Yi1jbGFzc2VzL3FNb2RlV2l0aFF1ZXVlSW5wdXQvc3ViLWNsYXNzZXMvc2VhcmNoTW9kZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvc3ViLWNsYXNzZXMvc2luZ2xlQW5zd2VyTW9kZS9zaW5nbGVBbnN3ZXJNb2RlLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9zdWItY2xhc3Nlcy9zaW5nbGVBbnN3ZXJNb2RlL3N1Yi1jbGFzc2VzL3ByZXZBbnN3ZXJNb2RlLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL3F1ZXN0aW9uc0hlbHBlcnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvcXVlc3Rpb25zUGFnZS9xdWVzdGlvbnNQYWdlLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL3F1ZXN0aW9uc1BhZ2Uvc3ViLWNsYXNzZXMvZnVsbFF1ZXN0aW9uc1BhZ2UubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvc2hhcmVkSnMvdXRpbHMubWpzIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL3BhZ2VzL3F1ZXN0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmYWRlSW4sIGZ1bGx5RmFkZU91dCB9IGZyb20gXCIuL2ZhZGVUcmFuc2l0aW9ucy5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENlbnRyZU1vZGFsIHtcclxuICB3cmFwcGVyO1xyXG4gICNtb2RhbDtcclxuICAjY2xvc2VNb2RhbEJ0bjtcclxuXHJcbiAgY29uc3RydWN0b3Iod3JhcHBlcikge1xyXG4gICAgdGhpcy53cmFwcGVyID0gd3JhcHBlcjtcclxuICAgIHRoaXMuI21vZGFsID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmNlbnRyZS1tb2RhbFwiKTtcclxuICAgIHRoaXMuI2Nsb3NlTW9kYWxCdG4gPSB0aGlzLiNtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHVwIHRoZSBldmVudCBsaXN0ZW5lcnMuXHJcbiAgaW5pdCgpIHtcclxuICAgIGNvbnN0IGNsb3NlTW9kYWxFbGVtcyA9IFt0aGlzLiNjbG9zZU1vZGFsQnRuLCB0aGlzLndyYXBwZXJdO1xyXG5cclxuICAgIGZvciAobGV0IGNsb3NlTW9kYWxFbGVtIG9mIGNsb3NlTW9kYWxFbGVtcykge1xyXG4gICAgICBjbG9zZU1vZGFsRWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5oaWRlKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLiNtb2RhbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IGV2dC5zdG9wUHJvcGFnYXRpb24oKSk7XHJcbiAgfVxyXG5cclxuICBzaG93KCkge1xyXG4gICAgZmFkZUluKHRoaXMud3JhcHBlcik7XHJcbiAgfVxyXG5cclxuICBoaWRlKCkge1xyXG4gICAgZnVsbHlGYWRlT3V0KHRoaXMud3JhcHBlcik7XHJcbiAgfVxyXG59IiwiLy8gSGVscGVyIGZ1bmN0aW9ucyB0byBhc3Npc3Qgd2l0aCBmYWRpbmcgaW4gLyBvdXQgRE9NIGVsZW1lbnRzLlxyXG5pbXBvcnQgeyBhd2FpdFRyYW5zaXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkSnMvdXRpbHMubWpzXCI7XHJcblxyXG5cclxuXHJcbi8vIEZhZGUgdHJhbnNpdGlvbiBoZWxwZXIgZnVuY3Rpb25zLCB1c2VkIHdpdGggdHJhbnNwYXJlbnQsIGZ1bGx5LWhpZGRlbiBhbmQgXHJcbi8vIGZhZGUtdHJhbnMgY3NzIGNsYXNzZXMuXHJcbi8vIE1ha2VzIGRpc3BsYXkgcHJvcGVydHkgdmlzaWJsZSBhbmQgdGhlbiByZW1vdmVzIHRyYW5zcGFyZW5jeS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVJbihlbGVtKSB7XHJcbiAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsbHktaGlkZGVuXCIpO1xyXG4gIHNldFRpbWVvdXQoKCkgPT4gZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwidHJhbnNwYXJlbnRcIiksIDEwKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmlzaEZhZGVJbihlbGVtKSB7XHJcbiAgYXdhaXQgYXdhaXRUcmFuc2l0aW9uKGVsZW0sIFwib3BhY2l0eVwiKTtcclxufVxyXG5cclxuLy8gRmluaXNoZXMgd2hlbiBmYWRlIGluIGlzIGNvbXBsZXRlZC5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZ1bGx5RmFkZUluKGVsZW0pIHtcclxuICBmYWRlSW4oZWxlbSk7XHJcbiAgYXdhaXQgZmluaXNoRmFkZUluKGVsZW0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZU91dChlbGVtKSB7XHJcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKFwidHJhbnNwYXJlbnRcIik7XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIG9wYWNpdHkgdHJhbnNpdGlvbiBvbiB0aGUgXHJcbi8vIGdpdmVuIGVsZW1lbnQgaXMgY29tcGxldGVkLiBBbHNvIGZ1bGx5IGhpZGVzIHRoZSBlbGVtZW50LlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluaXNoRmFkZU91dChlbGVtKSB7XHJcbiAgYXdhaXQgYXdhaXRUcmFuc2l0aW9uKGVsZW0sIFwib3BhY2l0eVwiKTtcclxuICBlbGVtLmNsYXNzTGlzdC5hZGQoXCJmdWxseS1oaWRkZW5cIik7XHJcbn1cclxuXHJcbi8vIEZhZGUgb3V0IGFuZCBmdWxseSBoaWRlIHRoZSBnaXZlbiBlbGVtZW50LlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHlGYWRlT3V0KGVsZW0pIHtcclxuICBmYWRlT3V0KGVsZW0pO1xyXG4gIGF3YWl0IGZpbmlzaEZhZGVPdXQoZWxlbSk7XHJcbn1cclxuXHJcbi8vIEZhZGVzIG91dCBlbGVtMSBhbmQgZmFkZXMgaW4gZWxlbTIgb25jZSB0cmFuc2l0aW9uIGNvbXBsZXRlZCwgZG9lc24ndCBmaW5pc2ggXHJcbi8vIHVudGlsIGVsZW0yIGZ1bGx5IGZhZGVkIGluLiBSZXR1cm5zIHByb21pc2UuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlRnJvbVRvKGVsZW0xLCBlbGVtMikge1xyXG4gIGNvbnN0IGZhZGVDb21wbGV0ZVByb21pc2UgPSBuZXcgUHJvbWlzZShhc3luYyByZXNvbHZlID0+IHtcclxuICAgIGF3YWl0IGZ1bGx5RmFkZU91dChlbGVtMSk7XHJcbiAgICBhd2FpdCBmdWxseUZhZGVJbihlbGVtMik7XHJcbiAgICByZXNvbHZlKCk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBmYWRlQ29tcGxldGVQcm9taXNlO1xyXG59IiwiaW1wb3J0IHsgZnVsbHlGYWRlSW4sIGZ1bGx5RmFkZU91dCB9IGZyb20gXCIuL2ZhZGVUcmFuc2l0aW9ucy5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gQnRuIHdpdGggYXNzb2NpYXRlZCBjb250ZW50LiBDb250ZW50IGZhZGVzIGluIHdoZW4gYnV0dG9uIGlzIGNsaWNrZWQgYW5kIFxyXG4vLyBmYWRlcyBvdXQgd2hlbiBhbnl0aGluZyBpcyBjbGlja2VkLiBVc2VkIGJ5IGluZm8gYnV0dG9ucyBhbmQgbmF2IGRyb3Bkb3duLlxyXG5jbGFzcyBQb3BCdG4ge1xyXG4gICNidG47XHJcbiAgI2NvbnRlbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBvcEJ0bkNvbnRhaW5lcikge1xyXG4gICAgdGhpcy4jYnRuID0gcG9wQnRuQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIucG9wLWJ0blwiKTtcclxuICAgIHRoaXMuI2NvbnRlbnQgPSBwb3BCdG5Db250YWluZXIucXVlcnlTZWxlY3RvcihcIi5wb3AtYnRuLWNvbnRlbnRcIik7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy4jc2V0dXBJbmZvQnRuQ2xpY2sodGhpcy4jYnRuLCB0aGlzLiNjb250ZW50KTtcclxuICB9XHJcblxyXG4gICNzZXR1cEluZm9CdG5DbGljayhidG4sIGNvbnRlbnQpIHtcclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLiNoYW5kbGVJbmZvQnRuQ2xpY2soYnRuLCBjb250ZW50KTtcclxuICAgIH0sIHtvbmNlOiB0cnVlfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyAjaGFuZGxlSW5mb0J0bkNsaWNrKGJ0biwgY29udGVudCkge1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlSW4oY29udGVudCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgZnVsbHlGYWRlT3V0KGNvbnRlbnQpO1xyXG4gICAgICB0aGlzLiNzZXR1cEluZm9CdG5DbGljayhidG4sIGNvbnRlbnQpO1xyXG4gICAgfSwge29uY2U6IHRydWV9KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIEluaXRzIGFsbCBwb3AgYnRucyBvbiBhIHBhZ2UuXHJcbmZ1bmN0aW9uIHNldHVwUG9wQnRucygpIHtcclxuICBjb25zdCBwb3BCdG5Db250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3AtYnRuLWNvbnRhaW5lclwiKTtcclxuICBcclxuICBwb3BCdG5Db250YWluZXJzLmZvckVhY2gocG9wQnRuQ29udGFpbmVyID0+IHtcclxuICAgIGNvbnN0IHBvcEJ0biA9IG5ldyBQb3BCdG4ocG9wQnRuQ29udGFpbmVyKTtcclxuICAgIHBvcEJ0bi5pbml0KCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbnNldHVwUG9wQnRucygpOyIsImltcG9ydCB7IGNyZWF0ZVFEb21JdGVtLCBnZXRRQ2F0ZWdvcnksIGdldFFJbmZvIH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uc0hlbHBlcnMubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTaW5nbGVNb2RlUVNvdXJjZSBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcclxuICBfbGlzdERpdjtcclxuICBfY29udGVudERpdjtcclxuICBfcURpdkNsYXNzO1xyXG5cclxuICBjb25zdHJ1Y3RvcihsaXN0RGl2KSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fbGlzdERpdiA9IGxpc3REaXY7XHJcbiAgICB0aGlzLl9jb250ZW50RGl2ID0gbGlzdERpdi5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnRcIik7XHJcbiAgfVxyXG5cclxuICAvLyBDcmVhdGUgYSBkaXYgd2l0aCBpbmZvcm1hdGlvbiBmb3IgYSBxdWVzdGlvbiBpdGVtLlxyXG4gIF9jcmVhdGVRRGl2KHEpIHtcclxuICAgIGNvbnN0IFtjYXRUeXBlTmFtZSwgY2F0TmFtZV0gPSBnZXRRQ2F0ZWdvcnkocSwgdGhpcy5fY2F0ZWdvcnlUeXBlTmFtZSwgXHJcbiAgICAgIHRoaXMuX2NhdGVnb3J5TmFtZSk7XHJcblxyXG4gICAgY29uc3QgcVNvdXJjZUl0ZW0gPSBjcmVhdGVRRG9tSXRlbShxLnF1ZXN0aW9uRGV0YWlscywgY2F0VHlwZU5hbWUsIFxyXG4gICAgICBjYXROYW1lKTtcclxuICAgIFxyXG4gICAgcVNvdXJjZUl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLl9xRGl2Q2xhc3MpO1xyXG5cclxuICAgIGNvbnN0IHFUZXh0ID0gdGhpcy5fY3JlYXRlUVRleHRFbGVtKHEsIGNhdFR5cGVOYW1lLCBjYXROYW1lKTtcclxuICAgIGNvbnN0IHFTY29yZSA9IHRoaXMuX2NyZWF0ZXRRU2NvcmVFbGVtKHEpO1xyXG4gICAgdGhpcy5fc2V0dXBRSW1nKHEsIHFTb3VyY2VJdGVtKTtcclxuXHJcbiAgICBjb25zdCBxSW5mbyA9IHtcclxuICAgICAgcVNvdXJjZUl0ZW06IHFTb3VyY2VJdGVtLFxyXG4gICAgICBxVGV4dDogcVRleHQsXHJcbiAgICAgIHFTY29yZTogcVNjb3JlLFxyXG4gICAgICBjYXRUeXBlTmFtZTogY2F0VHlwZU5hbWUsXHJcbiAgICAgIGNhdE5hbWU6IGNhdE5hbWVcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fYWRkVG9RRGl2KHFJbmZvKTtcclxuICAgIHJldHVybiBxU291cmNlSXRlbTtcclxuICB9XHJcblxyXG4gIF9oYW5kbGVSYXRlQnRuQ2xpY2soZXZ0LCBxdWVzdGlvbikge1xyXG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJhbnN3ZXJTaW5nbGVRXCIsIHtkZXRhaWw6IHtxdWVzdGlvbjogcXVlc3Rpb259fSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyBCdWlsZHMgdGhlIGNvbnRlbnQgZGl2IHdpdGggYWxsIHRoZSBxdWVzdGlvbnMuXHJcbiAgX2J1aWxkQ29udGVudERpdihxdWVzdGlvbnMpIHtcclxuICAgIGZvciAobGV0IHF1ZXN0aW9uIG9mIHF1ZXN0aW9ucykge1xyXG4gICAgICBjb25zdCBxU291cmNlSXRlbSA9IHRoaXMuX2NyZWF0ZVFEaXYocXVlc3Rpb24pO1xyXG4gICAgICB0aGlzLl9jb250ZW50RGl2LmFwcGVuZENoaWxkKHFTb3VyY2VJdGVtKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBfY3JlYXRlUVRleHRFbGVtKHEsIGNhdFR5cGVOYW1lLCBjYXROYW1lKSB7XHJcbiAgICBjb25zdCBxVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG5cclxuICAgIHFUZXh0LmlubmVyVGV4dCA9IGdldFFJbmZvKHEucXVlc3Rpb25EZXRhaWxzLCBcInFTb3VyY2VEaXNwbGF5VGV4dFwiLCBcclxuICAgICAgY2F0VHlwZU5hbWUsIGNhdE5hbWUpO1xyXG4gICAgXHJcbiAgICBxVGV4dC5jbGFzc0xpc3QuYWRkKFwicS10ZXh0XCIpO1xyXG4gICAgcmV0dXJuIHFUZXh0O1xyXG4gIH1cclxuXHJcbiAgX2NyZWF0ZXRRU2NvcmVFbGVtKHEpIHtcclxuICAgIGNvbnN0IHFTY29yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgcVNjb3JlLmlubmVyVGV4dCA9IHRoaXMuX2dldFNjb3JlVGV4dChxKTtcclxuICAgIHFTY29yZS5jbGFzc0xpc3QuYWRkKFwidXNlci1zY29yZVwiKTtcclxuICAgIHJldHVybiBxU2NvcmU7XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yIGNsaWNrIHRvIHRoZSBpbWFnZSAvIHBsYWNlaG9sZGVyIGltYWdlLlxyXG4gIC8vIEFsc28gY3JlYXRlIGFuZCBhZGQgaG92ZXIgZWZmZWN0IGRpdi5cclxuICBfc2V0dXBRSW1nKHEsIHFTb3VyY2VJdGVtKSB7XHJcbiAgICBjb25zdCBxSW1nID0gcVNvdXJjZUl0ZW0ucXVlcnlTZWxlY3RvcihcImltZ1wiKSA/PyBcclxuICAgICAgcVNvdXJjZUl0ZW0ucXVlcnlTZWxlY3RvcihcIi5wbGFjZWhvbGRlci1pbWdcIik7XHJcblxyXG4gICAgcUltZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5faGFuZGxlUmF0ZUJ0bkNsaWNrKGV2dCwgcSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpbWdXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGltZ1dyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcInEtc291cmNlLWltZy13cmFwcGVyXCIpO1xyXG5cclxuICAgIC8vIENoYW5nZSBpbWcgdG8gYmUgcGFyZW50ZWQgYnkgdGhlIGltZyB3cmFwcGVyIGRpdiBpbnN0ZWFkLlxyXG4gICAgaW1nV3JhcHBlckRpdi5hcHBlbmRDaGlsZChxSW1nKTtcclxuICAgIHFTb3VyY2VJdGVtLmluc2VydEJlZm9yZShpbWdXcmFwcGVyRGl2LCBxU291cmNlSXRlbS5jaGlsZHJlblswXSk7XHJcblxyXG4gICAgLy8gQWRkIGEgaG92ZXIgZGl2LCBhbHNvIGluIHRoZSB3cmFwcGVyIGRpdi5cclxuICAgIGNvbnN0IGhvdmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGhvdmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJxLXNvdXJjZS1pdGVtLWhvdmVyXCIpO1xyXG5cclxuICAgIGNvbnN0IGhvdmVyVHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBob3ZlclR4dC5pbm5lclRleHQgPSB0aGlzLl9nZXRIb3ZlclRleHQoKTtcclxuICAgIGhvdmVyVHh0LmNsYXNzTGlzdC5hZGQoXCJxLXNvdXJjZS1ob3Zlci10eHRcIik7XHJcblxyXG4gICAgaG92ZXJEaXYuYXBwZW5kQ2hpbGQoaG92ZXJUeHQpO1xyXG4gICAgaW1nV3JhcHBlckRpdi5hcHBlbmRDaGlsZChob3ZlckRpdik7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgZmFkZUluLCBmdWxseUZhZGVPdXQgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZmFkZVRyYW5zaXRpb25zLm1qc1wiO1xyXG5pbXBvcnQgeyBnZXRRSW5mbyB9IGZyb20gXCIuLi8uLi8uLi9xdWVzdGlvbnNIZWxwZXJzLm1qc1wiO1xyXG5pbXBvcnQgeyBTaW5nbGVNb2RlUVNvdXJjZSB9IGZyb20gXCIuLi9zaW5nbGVNb2RlUVNvdXJjZS5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFByZXZpb3VzQW5zd2VycyBleHRlbmRzIFNpbmdsZU1vZGVRU291cmNlIHtcclxuICAjbm90WWV0QWN0aXZhdGVkID0gdHJ1ZTtcclxuICAvLyBDb21iaW5hdGlvbiBvZiBhbGwgREIgYW5zd2VycyBvdmVyd3JpdHRlbiB3aXRoIGFueSBtb3JlIHJlY2VudCBhbnN3ZXJzIGZvciBcclxuICAvLyBjdXJyZW50IHNlc3Npb24uXHJcbiAgI3ByZXZBbnN3ZXJzID0gW107XHJcbiAgX2NhdGVnb3J5VHlwZU5hbWU7XHJcbiAgX2NhdGVnb3J5TmFtZTtcclxuICBfcURpdkNsYXNzID0gXCJwcmV2LWFucy1pdGVtXCI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGxpc3REaXYsIGNhdGVnb3J5VHlwZU5hbWUsIGNhdGVnb3J5TmFtZSkge1xyXG4gICAgc3VwZXIobGlzdERpdik7XHJcbiAgICB0aGlzLl9jYXRlZ29yeVR5cGVOYW1lID0gY2F0ZWdvcnlUeXBlTmFtZTtcclxuICAgIHRoaXMuX2NhdGVnb3J5TmFtZSA9IGNhdGVnb3J5TmFtZTtcclxuICB9XHJcblxyXG4gIC8vIEdldCB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgYWxsIHRoZSB1c2VyJ3MgY3VycmVudCBhbnN3ZXJzIGFuZCB1cGRhdGUgdGhlIFxyXG4gIC8vIGRpdiB3aXRoIHRoZW0uXHJcbiAgYXN5bmMgYWN0aXZhdGUoKSB7XHJcbiAgICAvLyBHZXQgdXNlcidzIGN1cnJlbnQgYW5zd2VycyBpbiB0aGUgREIgZm9yIHRoaXMgY2F0ZWdvcnksIGlmIGZpcnN0IHRpbWUgXHJcbiAgICAvLyBydW5uaW5nLCBhbmQgcG9wdWxhdGUgdGhlIERPTSBsaXN0LlxyXG4gICAgaWYgKHRoaXMuI25vdFlldEFjdGl2YXRlZCkge1xyXG4gICAgICB0aGlzLiNwcmV2QW5zd2VycyA9IGF3YWl0IHRoaXMuI2dldERCQW5zd2VycygpO1xyXG4gICAgICB0aGlzLl9idWlsZENvbnRlbnREaXYodGhpcy4jcHJldkFuc3dlcnMpO1xyXG4gICAgICB0aGlzLiNub3RZZXRBY3RpdmF0ZWQgPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgZmFkZUluKHRoaXMuX2xpc3REaXYpO1xyXG4gIH1cclxuXHJcbiAgLy8gSGlkZXMgdGhlIGxpc3QuXHJcbiAgZGVhY3RpdmF0ZSgpIHtcclxuICAgIGZ1bGx5RmFkZU91dCh0aGlzLl9saXN0RGl2KTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZXMgdGhpcyAjcHJldkFuc3dlcnMgYW5kIHRoZSBkaXYgbGlzdCBvbiBhIGNoYW5nZS5cclxuICB1cGRhdGVBbnN3ZXJzTGlzdChsYXRlc3RTZXNzaW9uQW5zd2Vycykge1xyXG4gICAgZm9yIChsZXQgbmV3QW5zd2VyIG9mIGxhdGVzdFNlc3Npb25BbnN3ZXJzKSB7XHJcbiAgICAgIC8vIFVwZGF0ZSB0aGlzIHByZXZBbnN3ZXJzIGFuZCB0aGUgRE9NIGxpc3Qgd2l0aCB0aGUgbGF0ZXN0IFxyXG4gICAgICAvLyBzZXNzaW9uIGFuc3dlcnMuXHJcbiAgICAgIGNvbnN0IGZvdW5kSW5kZXggPSB0aGlzLiNwcmV2QW5zd2Vycy5maW5kSW5kZXgocHJldkFucyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHByZXZBbnMucXVlc3Rpb25JZCA9PT0gbmV3QW5zd2VyLnF1ZXN0aW9uSWRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBuZXdBbnNSb3dEaXYgPSB0aGlzLl9jcmVhdGVRRGl2KG5ld0Fuc3dlcik7XHJcblxyXG4gICAgICAvLyBJZiBmb3VuZCwgb3ZlcndyaXRlIHdpdGggbmV3IGFuc3dlci5cclxuICAgICAgaWYgKGZvdW5kSW5kZXggPiAtMSkge1xyXG4gICAgICAgIHRoaXMuI3ByZXZBbnN3ZXJzLnNwbGljZShmb3VuZEluZGV4LCAxLCBuZXdBbnN3ZXIpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRlbnREaXYucmVwbGFjZUNoaWxkKG5ld0Fuc1Jvd0RpdiwgdGhpcy5fY29udGVudERpdi5jaGlsZHJlbltmb3VuZEluZGV4XSk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBuZXcgcm93IHRvIGVuZCBvZiB0aGUgY29udGVudERpdi5cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy4jcHJldkFuc3dlcnMucHVzaChuZXdBbnN3ZXIpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRlbnREaXYuYXBwZW5kQ2hpbGQobmV3QW5zUm93RGl2KTtcclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgdXNlcidzIGN1cnJlbnQgYW5zd2VycyBpbiB0aGUgREIgZm9yIHRoaXMgY2F0ZWdvcnkuXHJcbiAgYXN5bmMgI2dldERCQW5zd2VycygpIHtcclxuICAgIGNvbnN0IGZldGNoQ3VyckRCQW5zd2VycyA9IGF3YWl0IGZldGNoKGAvcXVlc3Rpb25zL3VzZXItYW5zd2Vycy8ke3RoaXMuX2NhdGVnb3J5VHlwZU5hbWV9LyR7dGhpcy5fY2F0ZWdvcnlOYW1lfWApO1xyXG4gICAgY29uc3QgY3VyckRCQW5zd2VycyA9IGF3YWl0IGZldGNoQ3VyckRCQW5zd2Vycy5qc29uKCk7XHJcbiAgICByZXR1cm4gY3VyckRCQW5zd2VycztcclxuICB9XHJcblxyXG4gIF9nZXRTY29yZVRleHQocHJldkFucykge1xyXG4gICAgcmV0dXJuIHByZXZBbnMuc2tpcCA/IFwiU2tpcHBlZFwiIDogTnVtYmVyKHByZXZBbnMuYW5zd2VyVmFsKS50b0ZpeGVkKDEpO1xyXG4gIH1cclxuXHJcbiAgX2FkZFRvUURpdihxSW5mbykge1xyXG4gICAgcUluZm8ucVNvdXJjZUl0ZW0uYXBwZW5kQ2hpbGQocUluZm8ucVRleHQpO1xyXG4gICAgcUluZm8ucVNvdXJjZUl0ZW0uYXBwZW5kQ2hpbGQocUluZm8ucVNjb3JlKTtcclxuICAgIHJldHVybiBxSW5mby5xU291cmNlSXRlbTtcclxuICB9XHJcbiAgXHJcbiAgX2dldEhvdmVyVGV4dCgpIHtcclxuICAgIHJldHVybiBcIlJlLXJhdGUgaXQhXCI7XHJcbiAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEFuc3dlclVJUGFuZWwge1xyXG4gIG1haW5EaXY7XHJcbiAgcmF0ZVBhbmVsO1xyXG4gIHJhdGVCdG47XHJcbiAgc2tpcEJ0bjtcclxuICBzY29yZVNsaWRlcjtcclxuICBzY29yZVNsaWRlcklucHV0O1xyXG4gIGN1cnJRdWVzdGlvblRleHQ7XHJcbiAgcHJldkFuc0RpdjtcclxuICBwcmV2QW5zVmFsO1xyXG4gIGxvYWRlcjtcclxuICBkZXRhaWxzO1xyXG5cclxuICBjb25zdHJ1Y3RvcihxTW9kZURpdikge1xyXG4gICAgdGhpcy5tYWluRGl2ID0gcU1vZGVEaXYucXVlcnlTZWxlY3RvcihcIi5hbnN3ZXItcGFuZWxcIik7XHJcbiAgICB0aGlzLnJhdGVQYW5lbCA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnJhdGUtcGFuZWxcIik7XHJcbiAgICB0aGlzLnJhdGVCdG4gPSB0aGlzLm1haW5EaXYucXVlcnlTZWxlY3RvcihcIi5yYXRlLWJ0blwiKTtcclxuICAgIHRoaXMuc2tpcEJ0biA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnNraXAtYnRuXCIpO1xyXG4gICAgdGhpcy5zY29yZVNsaWRlciA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnNjb3JlLXNsaWRlclwiKTtcclxuICAgIHRoaXMuc2NvcmVTbGlkZXJJbnB1dCA9IHRoaXMuc2NvcmVTbGlkZXIucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgdGhpcy5jdXJyUXVlc3Rpb25UZXh0ID0gdGhpcy5tYWluRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuY3Vyci1xdWVzdGlvblwiKTtcclxuICAgIHRoaXMucHJldkFuc0RpdiA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnByZXYtYW5zLWluZm9cIik7XHJcbiAgICB0aGlzLnByZXZBbnNWYWwgPSB0aGlzLm1haW5EaXYucXVlcnlTZWxlY3RvcihcIi5wcmV2LWFucy12YWxcIik7XHJcbiAgICB0aGlzLmxvYWRlciA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLmxvYWRlclwiKTtcclxuICAgIHRoaXMuZGV0YWlscyA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLmRldGFpbHNcIik7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFVwZGF0ZXMgdGhlIGRpc3BsYXllZCBxdWVzdGlvbiB3aXRoIHRoZSBuZXcgZmlyc3QgcXVldWUgaXRlbS5cclxuICBkaXNwbGF5Q3VyclEobmV3UUluZm8sIGluY2x1ZGVBbHJlYWR5QW5zd2VyZWQpIHtcclxuICAgIHRoaXMuI3Nob3dPckhpZGVQYW5lbChuZXdRSW5mbyk7XHJcblxyXG4gICAgLy8gU2hvdyBjdXJyZW50IHF1ZXN0aW9uIHRleHQgYW5kIHJlc2V0IHByZXZpb3VzIGFuc3dlciBpbmZvLlxyXG4gICAgdGhpcy5jdXJyUXVlc3Rpb25UZXh0LmlubmVySFRNTCA9IG5ld1FJbmZvLmN1cnJRVGV4dDtcclxuICAgIHRoaXMucHJldkFuc1ZhbC5pbm5lclRleHQgPSBcIlwiO1xyXG5cclxuICAgIGNvbnN0IHByZXZTY29yZSA9IHRoaXMuI2ZpbGxQcmV2QW5zKG5ld1FJbmZvLCBpbmNsdWRlQWxyZWFkeUFuc3dlcmVkKTtcclxuXHJcbiAgICAvLyBSZXNldCAvIHNldCB0aGUgc2NvcmUgYW5kIHNlbmQgaW5wdXQgZXZlbnQgZm9yIHRoZSBjdXN0b20gc2xpZGVyIHRvIFxyXG4gICAgLy8gY2F1c2UgdGhlIHdyYXBwZXIgZWxlbWVudCB0byB1cGRhdGUgYWxzby5cclxuICAgIHRoaXMuc2NvcmVTbGlkZXJJbnB1dC52YWx1ZSA9IHByZXZTY29yZTtcclxuICAgIHRoaXMuc2NvcmVTbGlkZXJJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNob3dMb2FkZXIoKSB7XHJcbiAgICB0aGlzLmxvYWRlci5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsbHktaGlkZGVuXCIpO1xyXG4gICAgdGhpcy5kZXRhaWxzLmNsYXNzTGlzdC5hZGQoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgICB0aGlzLmRldGFpbHMuY2xhc3NMaXN0LmFkZChcInRyYW5zcGFyZW50XCIpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaGlkZUxvYWRlcigpIHtcclxuICAgIHRoaXMubG9hZGVyLmNsYXNzTGlzdC5hZGQoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgICB0aGlzLmRldGFpbHMuY2xhc3NMaXN0LnJlbW92ZShcImZ1bGx5LWhpZGRlblwiKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kZXRhaWxzLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc3BhcmVudFwiKSwgMTApO1xyXG4gIH1cclxuXHJcbiAgLy8gU2hvd3MgLyBoaWRlcyByYXRlIHBhbmVsIGRlcGVuZGVudCBvbiB3aGV0aGVyIGVuZCBvZiBxdWV1ZSByZWFjaGVkLlxyXG4gICNzaG93T3JIaWRlUGFuZWwobmV3UUluZm8pIHtcclxuICAgIC8vIFNob3cgb3IgaGlkZSB0aGUgc2NvcmluZyBzbGlkZXIgYW5kIGJ1dHRvbnMgYXMgbmVjZXNzYXJ5LlxyXG4gICAgaWYgKG5ld1FJbmZvLmVuZE9mUXVldWUpIHtcclxuICAgICAgdGhpcy5yYXRlUGFuZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnJhdGVQYW5lbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIFNob3dzIG9yIGhpZGVzIHByZXZpb3VzIGFuc3dlciBpbmZvIGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZXJlIGlzIG9uZSBmb3IgXHJcbiAgLy8gdGhpcyBxdWVzdGlvbiBhbmQgc2V0cyB0aGUgcHJldiBhbnMgdGV4dC4gUmV0dXJucyB0aGUgcHJldiBhbnMgc2NvcmUgXHJcbiAgLy8gdmFsdWUsIHVzZWQgdG8gc2V0IHRoZSBzbGlkZXIgc2NvcmUuXHJcbiAgI2ZpbGxQcmV2QW5zKG5ld1FJbmZvLCBpbmNsdWRlQWxyZWFkeUFuc3dlcmVkKSB7XHJcbiAgICBsZXQgcHJldkFuc1Njb3JlID0gNTtcclxuXHJcbiAgICAvLyBJZiBjdXJyZW50IHF1ZXN0aW9uIGhhcyBhIHByZXZpb3VzIGFuc3dlciBieSB0aGUgdXNlciwgc2hvdyB0aGUgcHJldmlvdXMgXHJcbiAgICAvLyBhbnN3ZXIgZGV0YWlscy5cclxuICAgIGlmIChpbmNsdWRlQWxyZWFkeUFuc3dlcmVkICYmIG5ld1FJbmZvLmN1cnJRQW5zKSB7XHJcbiAgICAgIHRoaXMucHJldkFuc0Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpOyAgICAgIFxyXG4gICAgICB0aGlzLnByZXZBbnNWYWwuaW5uZXJUZXh0ID0gXCJTa2lwcGVkXCI7XHJcblxyXG4gICAgICBpZiAoIW5ld1FJbmZvLmN1cnJRQW5zLnNraXApIHtcclxuICAgICAgICBwcmV2QW5zU2NvcmUgPSBuZXdRSW5mby5jdXJyUUFucy5hbnN3ZXJWYWw7XHJcbiAgICAgICAgdGhpcy5wcmV2QW5zVmFsLmlubmVyVGV4dCA9IHByZXZBbnNTY29yZTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnByZXZBbnNEaXYuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHByZXZBbnNTY29yZTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBnZXRRQ2F0ZWdvcnksIGdldFFJbmZvIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3F1ZXN0aW9uc0hlbHBlcnMubWpzXCI7XHJcbmltcG9ydCB7IERvbVF1ZXVlIH0gZnJvbSBcIi4vY29tcG9uZW50cy9kb21RdWV1ZS5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2VRdWVzdGlvbnNRdWV1ZSB7XHJcbiAgX2NhdGVnb3J5VHlwZU5hbWU7XHJcbiAgX2NhdGVnb3J5TmFtZTtcclxuICBxdWV1ZSA9IFtdO1xyXG4gIHF1ZXVlVHlwZTtcclxuICBfZG9tUXVldWU7XHJcbiAgX3F1ZXVlUHJldlFzID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHFNb2RlTWFpbkRpdiwgY2F0ZWdvcnlUeXBlID0gbnVsbCwgY2F0ZWdvcnkgPSBudWxsKSB7XHJcbiAgICB0aGlzLl9jYXRlZ29yeVR5cGVOYW1lID0gY2F0ZWdvcnlUeXBlO1xyXG4gICAgdGhpcy5fY2F0ZWdvcnlOYW1lID0gY2F0ZWdvcnk7XHJcbiAgICB0aGlzLl9kb21RdWV1ZSA9IG5ldyBEb21RdWV1ZShxTW9kZU1haW5EaXYsIGNhdGVnb3J5VHlwZSwgY2F0ZWdvcnkpO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0cyB0aGUgdGV4dCB0byBkaXNwbGF5IG9mIHRoZSBjdXJyZW50IGZpcnN0IGl0ZW0gaW4gdGhlIHF1ZXN0aW9ucyBxdWV1ZS5cclxuICBnZXRDdXJyUUluZm8oKSB7XHJcbiAgICBsZXQgY3VyclFUZXh0O1xyXG4gICAgbGV0IGN1cnJRQW5zO1xyXG4gICAgbGV0IGVuZE9mUXVldWUgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBIaWRlIHF1ZXN0aW9uIGFuc3dlciBwYW5lbCBpZiBydW4gb3V0IG9mIHF1ZXN0aW9ucyBhbmQgZGlzcGxheSBhIG1lc3NhZ2UuXHJcbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgY3VyclFUZXh0ID0gdGhpcy5fZ2V0RW5kUXVldWVNc2coKTtcclxuICAgICAgZW5kT2ZRdWV1ZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc3QgY3VyclEgPSB0aGlzLnF1ZXVlWzBdO1xyXG4gICAgICBjb25zdCBbY2F0VHlwZU5hbWUsIGNhdE5hbWVdID0gZ2V0UUNhdGVnb3J5KGN1cnJRLCB0aGlzLl9jYXRlZ29yeVR5cGVOYW1lLCBcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeU5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICBjdXJyUVRleHQgPSBnZXRRSW5mbyhjdXJyUSwgXCJxRGlzcGxheVRleHRcIiwgY2F0VHlwZU5hbWUsIGNhdE5hbWUpO1xyXG4gICAgICBjdXJyUUFucyA9IGN1cnJRLmN1cnJBbnM7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7ZW5kT2ZRdWV1ZSwgY3VyclFUZXh0LCBjdXJyUUFuc307XHJcbiAgfVxyXG5cclxuICBfZ2V0RW5kUXVldWVNc2coKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbmRRdWV1ZU1zZztcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBxdWV1ZSBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgaXRlbSBmcm9tIHRoZSBET00gXHJcbiAgLy8gcXVldWUuIFJldHVybnMgdGhlIHJlbW92ZWQgcXVldWUgaXRlbS5cclxuICByZW1vdmVRdWV1ZUl0ZW0oaWR4LCBkb1RyYW5zKSB7XHJcbiAgICBjb25zdCB0aGlzUXVldWVJdGVtID0gdGhpcy5xdWV1ZVtpZHhdO1xyXG4gICAgdGhpcy5xdWV1ZS5zcGxpY2UoaWR4LCAxKTtcclxuICAgIHRoaXMuX2RvbVF1ZXVlLnJlbW92ZVF1ZXVlSXRlbShpZHgsIGRvVHJhbnMpO1xyXG5cclxuICAgIHJldHVybiB0aGlzUXVldWVJdGVtO1xyXG4gIH1cclxuXHJcbiAgLy8gQWRkcyBhcnJheSBvZiBxdWVzdGlvbnMgdG8gcXVldWUgYW5kIGFkZHMgY29ycmVzcG9uZGluZyBuZXcgZWxlbWVudHMgdG8gXHJcbiAgLy8gRE9NIHF1ZXVlIHRvby5cclxuICBfYWRkVG9RdWV1ZShxcykge1xyXG4gICAgdGhpcy5xdWV1ZSA9IHRoaXMucXVldWUuY29uY2F0KHFzKTtcclxuICAgIHRoaXMuX2RvbVF1ZXVlLmFkZFRvUXVldWUocXMpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ2xlYXJzIHRoZSBET00gaXRlbXMgcXVldWUuXHJcbiAgX3Jlc2V0UXVldWUoKSB7XHJcbiAgICB0aGlzLnF1ZXVlID0gW107XHJcbiAgICB0aGlzLl9kb21RdWV1ZS5yZXNldFF1ZXVlKCk7XHJcbiAgICB0aGlzLl9xdWV1ZVByZXZRcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgc2F2ZVByZXZRKHFJZCkge1xyXG4gICAgdGhpcy5fcXVldWVQcmV2UXMucHVzaChxSWQpO1xyXG4gIH1cclxufSIsIi8vIEhlbHBlciBjbGFzcyBmb3IgdGhlIGJhc2UgcXVlc3Rpb25zIHF1ZXVlLCB0byByZXByZXNlbnQgdGhlIERPTSBxdWV1ZSBpdGVtcy5cclxuaW1wb3J0IHsgY3JlYXRlUURvbUl0ZW0sIGdldFFDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9xdWVzdGlvbnNIZWxwZXJzLm1qc1wiO1xyXG5cclxuXHJcblxyXG4vLyAoZWcuIHBvc3RlciBpbWFnZXMpIGFuZCBoYW5kbGUgdGhlaXIgdHJhbnNpdGlvbnMgd2hlbiBhbnN3ZXJpbmcgcXVlc3Rpb25zLlxyXG5leHBvcnQgY2xhc3MgRG9tUXVldWUge1xyXG4gIF9xdWV1ZSA9IFtdO1xyXG4gICNudW1UcmFuc2l0aW9ucyA9IDA7XHJcbiAgI2NhdGVnb3J5VHlwZU5hbWU7XHJcbiAgI2NhdGVnb3J5TmFtZTtcclxuXHJcbiAgc3RhdGljIExBWllfTE9BRF9TVEFSVF9JRFggPSA0O1xyXG5cclxuICBjb25zdHJ1Y3RvcihxTW9kZU1haW5EaXYsIGNhdGVnb3J5VHlwZSwgY2F0ZWdvcnkpIHtcclxuICAgIHRoaXMuX3F1ZXVlID0gcU1vZGVNYWluRGl2LnF1ZXJ5U2VsZWN0b3IoXCIucXVldWUtaW1nc1wiKTtcclxuICAgIHRoaXMuI2NhdGVnb3J5VHlwZU5hbWUgPSBjYXRlZ29yeVR5cGU7XHJcbiAgICB0aGlzLiNjYXRlZ29yeU5hbWUgPSBjYXRlZ29yeTtcclxuXHJcbiAgICB0aGlzLl9xdWV1ZS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLiNlbmRUcmFuc2l0aW9uKGV2dCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIE9uY2UgRE9NIHF1ZXVlIGhhcyBkb25lIHRoZSB0cmFuc2l0aW9uIGZvciBhbnN3ZXJpbmcgYSBxdWVzdGlvbiwgZGVsZXRlIFxyXG4gIC8vIHRoZSBkb20gcXVlc3Rpb24uIENoZWNrIGluIGNhc2UgYW55IG1vcmUgdHJhbnNpdGlvbnMgYXJlIHF1ZXVlZCBhbmQgY2FycnkgXHJcbiAgLy8gdGhlbSBvdXQgaWYgc28uXHJcbiAgI2VuZFRyYW5zaXRpb24oZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LnByb3BlcnR5TmFtZSAhPT0gXCJsZWZ0XCIpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLiNudW1UcmFuc2l0aW9ucy0tO1xyXG4gICAgdGhpcy5fZGVsZXRlRG9tUSgwKTtcclxuICAgIHRoaXMuX3F1ZXVlLmNsYXNzTGlzdC5yZW1vdmUoXCJxdWV1ZS1pbWdzLXRyYW5zaXRpb25pbmdcIik7XHJcbiAgICBcclxuICAgIC8vIElmIHVzZXIgaGFzIGNsaWNrZWQgbXVsdGlwbGUgYW5zd2VycyBxdWlja2x5LCB0aGVuIGNhcnJ5IG91dCBhbnkgXHJcbiAgICAvLyBxdWV1ZWQgdHJhbnNpdGlvbnMgZm9yIGZ1cnRoZXIgYW5zd2Vycy5cclxuICAgIGlmICh0aGlzLiNudW1UcmFuc2l0aW9ucyA+IDApIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLiNkb1RyYW5zaXRpb24oKSwgMCk7XHJcbiAgICB9OyAgICBcclxuICB9XHJcblxyXG4gIC8vIENyZWF0ZSBET00gcXVldWUgaW1hZ2VzIGFuZCBhdWRpbyAod2hlcmUgcHJlc2VudCkgZnJvbSBsaXN0IG9mIHF1ZXN0aW9ucy5cclxuICBhZGRUb1F1ZXVlKHFzKSB7XHJcbiAgICBmb3IgKGxldCBxIG9mIHFzKSB7XHJcbiAgICAgIGNvbnN0IFtjYXRUeXBlTmFtZSwgY2F0TmFtZV0gPSBnZXRRQ2F0ZWdvcnkocSwgXHJcbiAgICAgICAgdGhpcy4jY2F0ZWdvcnlUeXBlTmFtZSwgdGhpcy4jY2F0ZWdvcnlOYW1lKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IGxhenlMb2FkID0gdGhpcy5fcXVldWUuY2hpbGRFbGVtZW50Q291bnQgPj0gRG9tUXVldWUuTEFaWV9MT0FEX1NUQVJUX0lEWDtcclxuXHJcbiAgICAgIGNvbnN0IG5ld0RvbVEgPSBjcmVhdGVRRG9tSXRlbShxLCBjYXRUeXBlTmFtZSwgY2F0TmFtZSwgbGF6eUxvYWQpO1xyXG4gICAgICBuZXdEb21RLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgcS5faWQpO1xyXG4gICAgICB0aGlzLl9xdWV1ZS5hcHBlbmRDaGlsZChuZXdEb21RKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSBET00gaW1hZ2VzIHF1ZXVlIGFuZCBoYW5kbGUgdGhlIHRyYW5zaXRpb24uXHJcbiAgcmVtb3ZlUXVldWVJdGVtKGlkeCwgZG9UcmFucykge1xyXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICAvLyBJZiBmaXJzdCBpdGVtIGluIHF1ZXVlIChpZS4gaGF2ZSBhbnN3ZXJlZCBhIHF1ZXN0aW9uKSwgdGhlbiBuZWVkIHRvIFxyXG4gICAgICAvLyBoYW5kbGUgdGhlIHRyYW5zaXRpb24gb2YgaW1hZ2VzLlxyXG4gICAgICBpZiAoaWR4ID09PSAwICYmIGRvVHJhbnMpIHtcclxuICAgICAgICB0aGlzLiNudW1UcmFuc2l0aW9ucysrO1xyXG4gICAgICAgIHRoaXMuI2RvVHJhbnNpdGlvbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBPdGhlcndpc2UganVzdCBkZWxldGUgdGhlIERPTSBxdWV1ZSBpdGVtLlxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLl9kZWxldGVEb21RKGlkeCk7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gRGVsZXRlcyBhbiBpbmRpdmlkdWFsIERPTSBxdWV1ZSBpdGVtLlxyXG4gIF9kZWxldGVEb21RKGlkeCkge1xyXG4gICAgLy8gSWYgcmVtb3Zpbmcgb3V0ZGF0ZWQgcXVldWUgaXRlbXMgZnJvbSBtaWRkbGUgb2YgcXVldWUgYnV0IHF1ZXVlIGlzIHN0aWxsIFxyXG4gICAgLy8gdHJhbnNpdGlvbmluZywgYm9vc3QgdGhlIGluZGV4IGJ5IDEgdG8gZmFjdG9yIGluIHRoYXQgdGhlIHByZXZpb3VzbHkgXHJcbiAgICAvLyBhbnN3ZXJlZCBxIHdpbGwgaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcXVldWUgYnV0IG5vdCB0aGUgZG9tIHF1ZXVlIHlldCBcclxuICAgIC8vIGFzIHRoZSB0cmFuc2l0aW9uIGhhc24ndCB5ZXQgY29tcGxldGVkLlxyXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmNsYXNzTGlzdC5jb250YWlucyhcInF1ZXVlLWltZ3MtdHJhbnNpdGlvbmluZ1wiKSAmJiBpZHggPiAwKSB7XHJcbiAgICAgIGlkeCsrO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl9xdWV1ZS5yZW1vdmVDaGlsZCh0aGlzLl9xdWV1ZS5jaGlsZHJlbltpZHhdKTtcclxuICB9XHJcblxyXG4gIC8vIENhdXNlcyB0cmFuc2l0aW9uaW5nIG9mIHBvc3RlciBpbWFnZXMgd2hlbiBhbnN3ZXJpbmcgYSBxdWVzdGlvbi5cclxuICAjZG9UcmFuc2l0aW9uKCkge1xyXG4gICAgdGhpcy5fcXVldWUuY2xhc3NMaXN0LmFkZChcInF1ZXVlLWltZ3MtdHJhbnNpdGlvbmluZ1wiKTtcclxuICB9XHJcblxyXG4gIHJlc2V0UXVldWUoKSB7XHJcbiAgICB0aGlzLl9xdWV1ZS5pbm5lclRleHQgPSBcIlwiO1xyXG4gIH1cclxufSIsImltcG9ydCB7IERvbVF1ZXVlIH0gZnJvbSBcIi4vZG9tUXVldWUubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTaW5nbGVEb21RdWV1ZSBleHRlbmRzIERvbVF1ZXVlIHtcclxuICAvLyBSZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSBET00gaW1hZ2VzIHF1ZXVlIGFuZCBoYW5kbGUgdGhlIHRyYW5zaXRpb24uXHJcbiAgcmVtb3ZlUXVldWVJdGVtKGlkeCwgZG9UcmFucykge1xyXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICBpZiAoaWR4ID09PSAwKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsZXRlRG9tUShpZHgpO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBCYXNlUXVlc3Rpb25zUXVldWUgfSBmcm9tIFwiLi4vLi4vYmFzZVF1ZXN0aW9uc1F1ZXVlLm1qc1wiO1xyXG5cclxuXHJcblxyXG4vLyBGb3IgcmV0cmVpdmluZyBuZXcgcXVlc3Rpb25zIGZyb20gc2VydmVyLlxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25zUXVldWUgZXh0ZW5kcyBCYXNlUXVlc3Rpb25zUXVldWUge1xyXG4gIHN0YXRpYyAjUVVFVUVfUkVGUkVTSF9BTU9VTlQgPSAzMDtcclxuICBfUVVFVUVfUkVGUkVTSF9USFJFU0hPTEQgPSAxMDtcclxuICAjZmlsdGVycztcclxuICBfZW5kT2ZRU291cmNlID0gZmFsc2U7XHJcbiAgX2N1cnJlbnRseVVwZGF0aW5nID0gZmFsc2U7XHJcbiAgZW5kUXVldWVNc2c7XHJcbiAgaW5wdXRQYW5lbDtcclxuICBhbGxSZWNlbnRBbnN3ZXJzID0gW107XHJcblxyXG4gIC8vIEFkZCBpdGVtcyB0byB0aGUgcXVlc3Rpb25zIHF1ZXVlIGlmIGl0J3MgcnVubmluZyBsb3cgYW5kIHRoZXJlIGFyZSBcclxuICAvLyB1bmFuc3dlcmVkIHF1ZXN0aW9ucyByZW1haW5pbmcgaW4gdGhlIHNvdXJjZS4gaXNOZXdRdWV1ZSBpcyBib29sZWFuIGZvciBcclxuICAvLyB3aGV0aGVyIHF1ZXVlIHNob3VsZCBiZSBzdGFydGVkIGZyb20gc2NyYXRjaCwgdXNlZCB3aGVuIHRoZSBxdWV1ZSBpbnB1dCBcclxuICAvLyBjcml0ZXJpYSBoYXZlIGNoYW5nZWQgZWcuIG5ldyBzZWFyY2ggdGVybS5cclxuICBhc3luYyB1cGRhdGUoaXNOZXdRdWV1ZSA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLl91cGRhdGVRdWV1ZVByZXZRcyhpc05ld1F1ZXVlKTtcclxuXHJcbiAgICBsZXQgdXBkYXRlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIElmIGFscmVhZHkgd2FpdGluZyBmb3IgZmV0Y2ggb24gYSBwcmV2aW91cyB1cGRhdGUgY2FsbCwgZG9uJ3QgdXBkYXRlLlxyXG4gICAgaWYgKHRoaXMuX2N1cnJlbnRseVVwZGF0aW5nKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgcXVldWVUb0JlVXBkYXRlZCA9IHRoaXMuY2hlY2tRdWV1ZVRvQmVVcGRhdGVkKCk7XHJcblxyXG4gICAgaWYgKHF1ZXVlVG9CZVVwZGF0ZWQpIHtcclxuICAgICAgLy8gUXVldWUgbmVlZHMgdG8gYW5kIGNhbiBiZSBleHRlbmRlZC5cclxuICAgICAgY29uc3QgbnVtTmV3UXMgPSBRdWVzdGlvbnNRdWV1ZS4jUVVFVUVfUkVGUkVTSF9BTU9VTlQ7XHJcbiAgICAgIGNvbnN0IGN1cnJRdWV1ZUlkcyA9IHRoaXMucXVldWUubWFwKHEgPT4gcS5faWQpO1xyXG5cclxuICAgICAgbGV0IHN0YXJ0QXBpUGFnZSA9IDE7XHJcbiAgICAgIGlmICghaXNOZXdRdWV1ZSkge1xyXG4gICAgICAgIGNvbnN0IG1heFF1ZXVlQXBpUGFnZSA9IHRoaXMucXVldWUuYXQoLTEpPy5hcGlQYWdlTnVtO1xyXG4gICAgICAgIHN0YXJ0QXBpUGFnZSA9IHRoaXMucXVldWUubGVuZ3RoID4gMCA/IG1heFF1ZXVlQXBpUGFnZSA6IDE7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBQT1NUIHJlcXVlc3QgdG8gc2VydmVyIGZvciBuZXcgcXVlc3Rpb25zIGZvciB0aGUgcXVldWUuXHJcbiAgICAgIGNvbnN0IG5ld1F1ZXN0aW9uc09iaiA9IGF3YWl0IHRoaXMuI3Bvc3ROZXdRc1JlcXVlc3QobnVtTmV3UXMsIFxyXG4gICAgICAgIGN1cnJRdWV1ZUlkcywgc3RhcnRBcGlQYWdlKTtcclxuXHJcbiAgICAgIHRoaXMuX2VuZE9mUVNvdXJjZSA9IG5ld1F1ZXN0aW9uc09iai5lbmRPZlFTb3VyY2U7XHJcblxyXG4gICAgICB0aGlzLl9hZGRUb1F1ZXVlKG5ld1F1ZXN0aW9uc09iai5yZXN1bHRzKTtcclxuICAgICAgdXBkYXRlZCA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB1cGRhdGVkO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgYSBuZXcgcXVldWUgKGVnLiBjaGFuZ2luZyBpbmNsLiBhbHJlYWR5IGFuc3dlcmVkIHRpY2tib3ggb3IgbmV3IHNlYXJjaCBcclxuICAvLyB0ZXJtKSB0aGVuIHJlc2V0IHRoaXMgcXVldWVQcmV2UXMuXHJcbiAgX3VwZGF0ZVF1ZXVlUHJldlFzKGlzTmV3UXVldWUpIHtcclxuICAgIGlmIChpc05ld1F1ZXVlKSB7XHJcbiAgICAgIHRoaXMuX3F1ZXVlUHJldlFzID0gW107XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gQ2hlY2tzIGlmIHRoZSBxdWV1ZSBuZWVkcyBhbmQgY2FuIGJlIHVwZGF0ZWQuXHJcbiAgY2hlY2tRdWV1ZVRvQmVVcGRhdGVkKCkge1xyXG4gICAgY29uc3QgcXVldWVOZWVkc0V4dGVuZGluZyA9IHRoaXMucXVldWUubGVuZ3RoIDw9IHRoaXMuX1FVRVVFX1JFRlJFU0hfVEhSRVNIT0xEO1xyXG4gICAgY29uc3QgbW9yZVFzSW5Tb3VyY2UgPSAhdGhpcy5fZW5kT2ZRU291cmNlO1xyXG5cclxuICAgIGNvbnN0IHF1ZXVlVG9CZVVwZGF0ZWQgPSBxdWV1ZU5lZWRzRXh0ZW5kaW5nICYmIG1vcmVRc0luU291cmNlO1xyXG4gICAgcmV0dXJuIHF1ZXVlVG9CZVVwZGF0ZWQ7XHJcbiAgfVxyXG5cclxuICAvLyBcclxuICBzZXRSZWNlbnRBbnN3ZXJzKGFsbFJlY2VudEFuc3dlcnMpIHtcclxuICAgIHRoaXMuYWxsUmVjZW50QW5zd2VycyA9IGFsbFJlY2VudEFuc3dlcnM7XHJcbiAgfVxyXG5cclxuICAvLyBDaGVja3MgZWFjaCBxdWVzdGlvbiBpbiB0aGUgcXVldWUgdG8gc2VlIGlmIGl0IGhhcyByZWNlbnRseSBiZWVuIGFuc3dlcmVkIFxyXG4gIC8vIChhbmQgdGhlcmVmb3JlIHNob3VsZCBubyBsb25nZXIgYmUgaW4gdGhlIHF1ZXVlLCBvciBzaG91bGQgYmUgdGhlcmUgd2l0aCBhIFxyXG4gIC8vIG5ld2VyIGFuc3dlciB2YWx1ZSkgYW5kIGhhbmRsZXMgdGhpcy4gYW5zd2VyUSBpcyB0cnVlIG9ubHkgaWYgdGhpcyB3YXMgXHJcbiAgLy8gdHJpZ2dlcmVkIGZyb20gYW5zd2VyaW5nIGEgcXVlc3Rpb24sIHNvIGluIHRoaXMgY2FzZSB0aGUgdHJhbnNpdGlvbnMgc2hvdWxkIGJlIGRvbmUuXHJcbiAgY2hlY2tGb3JPdXRkYXRlZFFzKGFuc3dlclEgPSBmYWxzZSkge1xyXG4gICAgZm9yIChsZXQgYW5zIG9mIHRoaXMuYWxsUmVjZW50QW5zd2Vycykge1xyXG4gICAgICBjb25zdCBxdWV1ZUluZGV4ID0gdGhpcy5xdWV1ZS5maW5kSW5kZXgocSA9PiBxLl9pZCA9PT0gYW5zLnF1ZXN0aW9uSWQpO1xyXG5cclxuICAgICAgaWYgKHF1ZXVlSW5kZXggPiAtMSkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT3V0ZGF0ZWRRdWV1ZUl0ZW0ocXVldWVJbmRleCwgYW5zLCBhbnN3ZXJRKTtcclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBJZiBxdWVzdGlvbiBpbiB0aGUgcXVldWUgaGFzIGJlZW4gYW5zd2VyZWQgcmVjZW50bHkgYW5kIGRhdGEgaXNuJ3QgXHJcbiAgLy8gcmVmbGVjdGVkIG9uIHNlcnZlciB5ZXQsIHVwZGF0ZSBhbnN3ZXIgaW5mbyB3aXRoIGxhdGVzdCBsb2NhbCBhbnN3ZXIgaW5mby5cclxuICBoYW5kbGVPdXRkYXRlZFF1ZXVlSXRlbShxdWV1ZUluZGV4LCByZWNlbnRBbnN3ZXIsIGRvVHJhbnMpIHtcclxuICAgIGNvbnN0IGluY2xQcmV2QW5zd2VycyA9IHRoaXMuaW5wdXRQYW5lbD8uaW5jbHVkZUFscmVhZHlBbnN3ZXJlZENoZWNrYm94Py5jaGVja2VkO1xyXG4gICAgY29uc3QgcHJldmlvdXNseUluVGhpc1F1ZXVlID0gdGhpcy5fcXVldWVQcmV2UXMuaW5jbHVkZXModGhpcy5xdWV1ZVtxdWV1ZUluZGV4XS5faWQpO1xyXG4gICAgLy8gSWYgd2FudCB0byBpbmNsdWRlIGFscmVhZHkgYW5zd2VyZWQgcXVlc3Rpb25zLCB0aGVuIGp1c3QgdXBkYXRlIHRoZSBcclxuICAgIC8vIHF1ZXVlIHF1ZXN0aW9uIGN1cnJBbnMgdG8gdGhlIGxhdGVzdCBsb2NhbCBhbnN3ZXIgaW5mby5cclxuICAgIGlmIChpbmNsUHJldkFuc3dlcnMgJiYgIXByZXZpb3VzbHlJblRoaXNRdWV1ZSkge1xyXG4gICAgICB0aGlzLnF1ZXVlW3F1ZXVlSW5kZXhdLmN1cnJBbnMgPSB7XHJcbiAgICAgICAgc2tpcDogcmVjZW50QW5zd2VyLnNraXAsXHJcbiAgICAgICAgYW5zd2VyVmFsOiByZWNlbnRBbnN3ZXI/LmFuc3dlclZhbFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgLy8gT3RoZXJ3aXNlLCByZW1vdmUgdGhpcyBub3cgYW5zd2VyZWQgcXVlc3Rpb24gZnJvbSB0aGUgcXVldWUuXHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5yZW1vdmVRdWV1ZUl0ZW0ocXVldWVJbmRleCwgZG9UcmFucyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0cyBtb3JlIGl0ZW1zIHRvIHRoZSBxdWVzdGlvbnMgcXVldWUsIHdoZW4gaXQncyBydW5uaW5nIGxvdy5cclxuICBhc3luYyAjcG9zdE5ld1FzUmVxdWVzdChudW1RdWVzdGlvbnMsIGN1cnJRdWV1ZUlkcywgc3RhcnRBcGlQYWdlKSB7XHJcbiAgICB0aGlzLl9jdXJyZW50bHlVcGRhdGluZyA9IHRydWU7XHJcbiAgICBcclxuICAgIGNvbnN0IHBvc3RPYmogPSB0aGlzLl9nZXRQb3N0T2JqKG51bVF1ZXN0aW9ucywgY3VyclF1ZXVlSWRzLCBzdGFydEFwaVBhZ2UpO1xyXG5cclxuICAgIGNvbnN0IGZldGNoUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL3F1ZXN0aW9ucy8ke3RoaXMuX2NhdGVnb3J5VHlwZU5hbWV9LyR7dGhpcy5fY2F0ZWdvcnlOYW1lfWAsIHtcclxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwb3N0T2JqKVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbmV3UXVlc3Rpb25zID0gYXdhaXQgZmV0Y2hSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgdGhpcy5fY3VycmVudGx5VXBkYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICByZXR1cm4gbmV3UXVlc3Rpb25zO1xyXG4gIH1cclxuXHJcbiAgLy8gTWFrZXMgdGhlIG9iamVjdCB0byBQT1NUIGZvciB1cGRhdGluZyB0aGUgcXVldWUuXHJcbiAgX2dldFBvc3RPYmoobnVtUXVlc3Rpb25zLCBjdXJyUXVldWVJZHMsIHN0YXJ0QXBpUGFnZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogXCJ1cGRhdGVRdWV1ZVwiLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcXVldWVUeXBlOiB0aGlzLnF1ZXVlVHlwZSxcclxuICAgICAgICBudW1RczogbnVtUXVlc3Rpb25zLFxyXG4gICAgICAgIGN1cnJRdWV1ZUlkczogY3VyclF1ZXVlSWRzLFxyXG4gICAgICAgIHN0YXJ0QXBpUGFnZTogc3RhcnRBcGlQYWdlLFxyXG4gICAgICAgIGZpbHRlcnM6IHt9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBSZXNldHMgdGhlIHNlYXJjaCBxdWV1ZSwgcmVhZHkgZm9yIGEgbmV3IHNlYXJjaCBxdWVyeSBhbmQgdXBkYXRlIGNhbGwgb3IgYSBcclxuICAvLyBuZXcgcXVldWUgYWZ0ZXIgdG9nZ2xpbmcgXCJpbmNsdWRlIGFscmVhZHkgYW5zd2VyZWRcIi5cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMuX3Jlc2V0UXVldWUoKTtcclxuICAgIHRoaXMuX2VuZE9mUVNvdXJjZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5fY3VycmVudGx5VXBkYXRpbmcgPSBmYWxzZTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBRdWVzdGlvbnNRdWV1ZSB9IGZyb20gXCIuLi9xdWVzdGlvbnNRdWV1ZS5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEF1dG9RdWVzdGlvbnNRdWV1ZSBleHRlbmRzIFF1ZXN0aW9uc1F1ZXVlIHtcclxuICBlbmRRdWV1ZU1zZyA9IFwiWW91IGhhdmUgYW5zd2VyZWQgYWxsIHN1Z2dlc3RlZCBxdWVzdGlvbnMgaW4gdGhpcyBjYXRlZ29yeSEgVXNlIFNlYXJjaCB0byBhbnN3ZXIgbW9yZSFcIjtcclxuICBxdWV1ZVR5cGUgPSBcImF1dG9cIjtcclxuXHJcbiAgLy8gQWRkcyBpbiBkYXRhIG9uIHdoZXRoZXIgcHJldmlvdXNseSBhbnN3ZXJlZCBxdWVzdGlvbnMgc2hvdWxkIGJlIGluY2x1ZGVkLlxyXG4gIF9nZXRQb3N0T2JqKG51bVF1ZXN0aW9ucywgY3VyclF1ZXVlSWRzLCBzdGFydEFwaVBhZ2UpIHtcclxuICAgIGNvbnN0IHBvc3RPYmogPSBzdXBlci5fZ2V0UG9zdE9iaihudW1RdWVzdGlvbnMsIGN1cnJRdWV1ZUlkcywgXHJcbiAgICAgIHN0YXJ0QXBpUGFnZSk7XHJcblxyXG4gICAgcG9zdE9iai5kYXRhLmluY2x1ZGVBbnN3ZXJlZFFzID0gdGhpcy5pbnB1dFBhbmVsLmluY2x1ZGVBbHJlYWR5QW5zd2VyZWRDaGVja2JveC5jaGVja2VkO1xyXG4gICAgcmV0dXJuIHBvc3RPYmo7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgUXVlc3Rpb25zUXVldWUgfSBmcm9tIFwiLi4vcXVlc3Rpb25zUXVldWUubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hRdWVzdGlvbnNRdWV1ZSBleHRlbmRzIFF1ZXN0aW9uc1F1ZXVlIHtcclxuICBlbmRRdWV1ZU1zZyA9IFwiTm8gcmVzdWx0cyBmb3IgdGhpcyBzZWFyY2ggdGVybSAob3IgeW91IGFuc3dlcmVkIHRoZW0gYWxsIGFscmVhZHkpLCB0cnkgYW5vdGhlciFcIjtcclxuICBub1NlYXJjaFRlcm1Nc2cgPSBcIkVudGVyIGEgc2VhcmNoIHRlcm0hXCI7XHJcbiAgcXVldWVUeXBlID0gXCJzZWFyY2hcIjtcclxuICBzZWFyY2hRdWVyeSA9IFwiXCI7XHJcblxyXG4gIF9nZXRFbmRRdWV1ZU1zZygpIHtcclxuICAgIGxldCBlbmRRdWV1ZU1zZyA9ICh0aGlzLnNlYXJjaFF1ZXJ5ID09PSBcIlwiKSA/IHRoaXMubm9TZWFyY2hUZXJtTXNnIDogdGhpcy5lbmRRdWV1ZU1zZztcclxuICAgIHJldHVybiBlbmRRdWV1ZU1zZztcclxuICB9XHJcblxyXG4gIC8vIENoZWNrcyBpZiB0aGUgcXVldWUgbmVlZHMgYW5kIGNhbiBiZSBleHRlbmRlZC5cclxuICBjaGVja1F1ZXVlVG9CZVVwZGF0ZWQoKSB7XHJcbiAgICBjb25zdCBjYW5CZVVwZGF0ZWQgPSBzdXBlci5jaGVja1F1ZXVlVG9CZVVwZGF0ZWQoKTtcclxuICAgIGNvbnN0IGlzVmFsaWRTZWFyY2ggPSB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBcIlwiO1xyXG4gICAgcmV0dXJuIGNhbkJlVXBkYXRlZCAmJiBpc1ZhbGlkU2VhcmNoO1xyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJucyB3aGV0aGVyIHNlYXJjaCBxdWVyeSBoYXMgY2hhbmdlZCBvciBub3QuXHJcbiAgY2hlY2tTZWFyY2hUZXJtQ2hhbmdlZCgpIHtcclxuICAgIGNvbnN0IHByZXZTZWFyY2hUZXJtID0gdGhpcy5zZWFyY2hRdWVyeTtcclxuICAgIHRoaXMuc2V0U2VhcmNoUXVlcnkoKTtcclxuICAgIHJldHVybiB0aGlzLnNlYXJjaFF1ZXJ5ICE9PSBwcmV2U2VhcmNoVGVybTtcclxuICB9XHJcblxyXG4gIHNldFNlYXJjaFF1ZXJ5KCkge1xyXG4gICAgdGhpcy5zZWFyY2hRdWVyeSA9IGVuY29kZVVSSSh0aGlzLmlucHV0UGFuZWwuc2VhcmNoSW5wdXQudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2VhcmNoIHF1ZXVlIHZlcnNpb24gb2YgdGhlIG1ha2luZyB0aGUgcG9zdCBvYmplY3QgZm9yIHVwZGF0aW5nIHRoZSBxdWV1ZSwgXHJcbiAgLy8gYWxzbyBpbmNsdWRlcyB0aGUgc2VhcmNoIHF1ZXJ5IGFuZCB3aGV0aGVyIHByZXZpb3VzbHkgYW5zd2VyZWQgcXVlc3Rpb25zIFxyXG4gIC8vIHNob3VsZCBiZSBpbmNsdWRlZC5cclxuICBfZ2V0UG9zdE9iaihudW1RdWVzdGlvbnMsIGN1cnJRdWV1ZUlkcywgc3RhcnRBcGlQYWdlKSB7XHJcbiAgICBjb25zdCBwb3N0T2JqID0gc3VwZXIuX2dldFBvc3RPYmoobnVtUXVlc3Rpb25zLCBjdXJyUXVldWVJZHMsIFxyXG4gICAgICBzdGFydEFwaVBhZ2UpO1xyXG5cclxuICAgIHBvc3RPYmouZGF0YS5zZWFyY2hRdWVyeSA9IHRoaXMuc2VhcmNoUXVlcnk7XHJcbiAgICBwb3N0T2JqLmRhdGEuaW5jbHVkZUFuc3dlcmVkUXMgPSB0aGlzLmlucHV0UGFuZWwuaW5jbHVkZUFscmVhZHlBbnN3ZXJlZENoZWNrYm94LmNoZWNrZWQ7XHJcbiAgICByZXR1cm4gcG9zdE9iajtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBCYXNlUXVlc3Rpb25zUXVldWUgfSBmcm9tIFwiLi4vYmFzZVF1ZXN0aW9uc1F1ZXVlLm1qc1wiO1xyXG5pbXBvcnQgeyBTaW5nbGVEb21RdWV1ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL3NpbmdsZURvbVF1ZXVlLm1qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2luZ2xlUXVlc3Rpb25RdWV1ZSBleHRlbmRzIEJhc2VRdWVzdGlvbnNRdWV1ZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHFNb2RlTWFpbkRpdiwgY2F0ZWdvcnlUeXBlID0gbnVsbCwgY2F0ZWdvcnkgPSBudWxsKSB7XHJcbiAgICBzdXBlcihxTW9kZU1haW5EaXYsIGNhdGVnb3J5VHlwZSwgY2F0ZWdvcnkpO1xyXG5cclxuICAgIHRoaXMuX2RvbVF1ZXVlID0gbmV3IFNpbmdsZURvbVF1ZXVlKHFNb2RlTWFpbkRpdiwgY2F0ZWdvcnlUeXBlLCBjYXRlZ29yeSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUocXVlc3Rpb24pIHtcclxuICAgIHRoaXMuX3Jlc2V0UXVldWUoKTtcclxuICAgIHRoaXMuX2FkZFRvUXVldWUoW3F1ZXN0aW9uXSk7XHJcbiAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFF1ZXVlSW5wdXRQYW5lbCB7XHJcbiAgbWFpbkRpdjtcclxuXHJcbiAgY29uc3RydWN0b3IocU1vZGVEaXYpIHtcclxuICAgIHRoaXMubWFpbkRpdiA9IHFNb2RlRGl2LnF1ZXJ5U2VsZWN0b3IoXCIucXVldWUtaW5wdXQtcGFuZWxcIik7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgUXVldWVJbnB1dFBhbmVsIH0gZnJvbSBcIi4uL3F1ZXVlSW5wdXRQYW5lbC5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEF1dG9RdWV1ZUlucHV0UGFuZWwgZXh0ZW5kcyBRdWV1ZUlucHV0UGFuZWwge1xyXG4gIGluY2x1ZGVBbHJlYWR5QW5zd2VyZWRDaGVja2JveDtcclxuXHJcbiAgY29uc3RydWN0b3IocU1vZGVEaXYpIHtcclxuICAgIHN1cGVyKHFNb2RlRGl2KTtcclxuICAgIHRoaXMuaW5jbHVkZUFscmVhZHlBbnN3ZXJlZENoZWNrYm94ID0gdGhpcy5tYWluRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuaW5jbC1wcmV2LWFuc1wiKTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBRdWV1ZUlucHV0UGFuZWwgfSBmcm9tIFwiLi4vcXVldWVJbnB1dFBhbmVsLm1qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoUXVldWVJbnB1dFBhbmVsIGV4dGVuZHMgUXVldWVJbnB1dFBhbmVsIHtcclxuICBpbmNsdWRlQWxyZWFkeUFuc3dlcmVkQ2hlY2tib3g7XHJcbiAgc2VhcmNoSW5wdXQ7XHJcbiAgc2VhcmNoQnRuO1xyXG5cclxuICBjb25zdHJ1Y3RvcihxTW9kZURpdikge1xyXG4gICAgc3VwZXIocU1vZGVEaXYpO1xyXG4gICAgdGhpcy5pbmNsdWRlQWxyZWFkeUFuc3dlcmVkQ2hlY2tib3ggPSB0aGlzLm1haW5EaXYucXVlcnlTZWxlY3RvcihcIi5pbmNsLXByZXYtYW5zXCIpO1xyXG4gICAgdGhpcy5zZWFyY2hJbnB1dCA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnNlYXJjaC1pbnB1dFwiKTtcclxuICAgIHRoaXMuc2VhcmNoQnRuID0gdGhpcy5tYWluRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuc2VhcmNoLWJ0blwiKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICAvLyBQcmVzc2luZyBlbnRlciBpbiBzZWFyY2ggaW5wdXQgY2FycmllcyBvdXQgdGhlIHNlYXJjaC5cclxuICAgIHRoaXMuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGV2ZW50ID0+IHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy5zZWFyY2hCdG4uY2xpY2soKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxufSIsImltcG9ydCB7IGZhZGVJbiwgZmFkZU91dCB9IGZyb20gXCIuLi8uLi8uLi9mYWRlVHJhbnNpdGlvbnMubWpzXCI7XHJcbmltcG9ydCB7IEFuc3dlclVJUGFuZWwgfSBmcm9tIFwiLi9jb21wb25lbnRzL2Fuc3dlclVpUGFuZWwubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbnNNb2RlIGV4dGVuZHMgRXZlbnRUYXJnZXQge1xyXG4gIG1haW5EaXY7XHJcbiAgYW5zd2VyVWlQYW5lbDtcclxuICBxdWVzdGlvbnNRdWV1ZTtcclxuICBidG47XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1haW5EaXYsIGJ0biA9IG51bGwpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLm1haW5EaXYgPSBtYWluRGl2O1xyXG4gICAgdGhpcy5idG4gPSBidG47XHJcbiAgICB0aGlzLmFuc3dlclVpUGFuZWwgPSBuZXcgQW5zd2VyVUlQYW5lbChtYWluRGl2KTtcclxuICB9XHJcblxyXG4gIC8vIFNldHMgdXAgdGhlIGFuc3dlciBVSSBwYW5lbCBidXR0b24gZXZlbnQgbGlzdGVuZXJzLlxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLmFuc3dlclVpUGFuZWwucmF0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5hbnN3ZXJRdWVzdGlvbihldnQpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmFuc3dlclVpUGFuZWwuc2tpcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5hbnN3ZXJRdWVzdGlvbihldnQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBQYXNzZXMgdGhlIGFsbFJlY2VudEFuc3dlcnMgb24gdG8gdGhlIHF1ZXN0aW9ucyBxdWV1ZS5cclxuICBzZXRSZWNlbnRBbnN3ZXJzKGFsbFJlY2VudEFuc3dlcnMpIHtcclxuICAgIHRoaXMucXVlc3Rpb25zUXVldWUuc2V0UmVjZW50QW5zd2VycyhhbGxSZWNlbnRBbnN3ZXJzKTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZXMgdGhlIGRpc3BsYXllZCBxdWVzdGlvbiBpbiB0aGUgYW5zd2VyIFVJIHBhbmVsIHdpdGggdGhlIG5ldyBmaXJzdCBcclxuICAvLyBxdWV1ZSBpdGVtLlxyXG4gIF9zaG93Q3VyclEoaW5jbEFscmVhZHlBbnN3ZXJlZCA9IHRydWUpIHtcclxuICAgIC8vIEdldHMgaW5mb3JtYXRpb24gb24gd2hldGhlciBxdWV1ZSBpcyBub3cgZW1wdHksIG9yIHdoYXQgdGhlIG5leHQgMTAgXHJcbiAgICAvLyBxdWV1ZSBpdGVtcyAoYW5kIGZpcnN0IHF1ZXN0aW9uIHVzZXIgYW5zd2VyLCBpZiBuZWNlc3NhcnkpIHNob3VsZCBiZS5cclxuICAgIGNvbnN0IG5ld0N1cnJRSW5mbyA9IHRoaXMucXVlc3Rpb25zUXVldWUuZ2V0Q3VyclFJbmZvKCk7XHJcblxyXG4gICAgdGhpcy5hbnN3ZXJVaVBhbmVsLmRpc3BsYXlDdXJyUShuZXdDdXJyUUluZm8sIGluY2xBbHJlYWR5QW5zd2VyZWQpO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0cyBjdXJyZW50IGFuc3dlciB0byBjdXJyZW50IHF1ZXN0aW9uIGFzIGFuIG9iamVjdCBmb3IgREIuXHJcbiAgZ2V0QW5zd2VyT2JqKGV2ZW50LCBjdXJyUXVlc3Rpb24pIHtcclxuICAgIGNvbnN0IHVzZXJTa2lwcGVkID0gKGV2ZW50LmN1cnJlbnRUYXJnZXQgPT09IHRoaXMuYW5zd2VyVWlQYW5lbC5za2lwQnRuKTtcclxuICAgIGNvbnN0IHRoaXNTY29yZSA9ICh1c2VyU2tpcHBlZCA/IG51bGwgOiBOdW1iZXIodGhpcy5hbnN3ZXJVaVBhbmVsLlxyXG4gICAgICBzY29yZVNsaWRlcklucHV0LnZhbHVlKSk7XHJcbiAgICAgIFxyXG4gICAgY29uc3QgcXVlc3Rpb25EZXRhaWxzID0gdGhpcy5fZ2V0UXVlc3Rpb25EZXRhaWxzKGN1cnJRdWVzdGlvbik7XHJcblxyXG4gICAgY29uc3QgYW5zd2VySW5mbyA9IHtcclxuICAgICAgcXVlc3Rpb25JZDogY3VyclF1ZXN0aW9uLl9pZCxcclxuICAgICAgc2tpcDogdXNlclNraXBwZWQsXHJcbiAgICAgIHF1ZXN0aW9uRGV0YWlsczogcXVlc3Rpb25EZXRhaWxzXHJcbiAgICB9O1xyXG4gIFxyXG4gICAgaWYgKCF1c2VyU2tpcHBlZCkge1xyXG4gICAgICBhbnN3ZXJJbmZvLmFuc3dlclZhbCA9IHRoaXNTY29yZTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGFuc3dlckluZm87XHJcbiAgfVxyXG5cclxuICAvLyBHZXRzIGFsbCB0aGUgcXVlc3Rpb24gZGV0YWlscyAoZWcuIHRpdGxlLCByZWxlYXNlIGRhdGUgZXRjLikgZm9yIHRoZSBjdXJyZW50IFxyXG4gIC8vIHF1ZXN0aW9uIGluIGFuIG9iamVjdCB0byBiZSBhZGRlZCB0byB0aGUgYW5zd2VycyBvYmplY3QsIHRvIGJlIGFkZGVkIHRvIHRoZSBEQi5cclxuICBfZ2V0UXVlc3Rpb25EZXRhaWxzKGN1cnJRdWVzdGlvbikge1xyXG4gICAgY29uc3QgcXVlc3Rpb25EZXRhaWxzID0ge307XHJcbiAgICBjb25zdCBwcm9wc1RvSWdub3JlID0gW1wiX2lkXCIsIFwiYXBpUGFnZU51bVwiLCBcImFscmVhZHlJbkRiXCIsIFwiY3VyckFuc1wiXTtcclxuXHJcbiAgICBmb3IgKGxldCBwcm9wIGluIGN1cnJRdWVzdGlvbikge1xyXG4gICAgICBjb25zdCBpZ25vcmVQcm9wID0gcHJvcHNUb0lnbm9yZS5pbmNsdWRlcyhwcm9wKTtcclxuICAgICAgaWYgKGlnbm9yZVByb3ApIGNvbnRpbnVlO1xyXG4gICAgICBxdWVzdGlvbkRldGFpbHNbcHJvcF0gPSBjdXJyUXVlc3Rpb25bcHJvcF07XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBxdWVzdGlvbkRldGFpbHM7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmJ0bikge1xyXG4gICAgICB0aGlzLmJ0bi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlLXEtbW9kZVwiKTtcclxuICAgIH07XHJcblxyXG4gICAgZmFkZUluKHRoaXMubWFpbkRpdik7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlKCkge1xyXG4gICAgaWYgKHRoaXMuYnRuKSB7XHJcbiAgICAgIHRoaXMuYnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtcS1tb2RlXCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmYWRlT3V0KHRoaXMubWFpbkRpdik7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgUXVlc3Rpb25zTW9kZSB9IGZyb20gXCIuLi8uLi9xdWVzdGlvbnNNb2RlLm1qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgUU1vZGVXaXRoUXVldWVJbnB1dCBleHRlbmRzIFF1ZXN0aW9uc01vZGUge1xyXG4gIHF1ZXVlSW5wdXRQYW5lbDtcclxuXHJcbiAgLy8gU2F2ZSBhbnN3ZXIgaW5mb3JtYXRpb24sIHVwZGF0ZSB0aGUgcXVldWUgaWYgbmVjZXNzYXJ5LlxyXG4gIGFzeW5jIGFuc3dlclF1ZXN0aW9uKGV2ZW50KSB7XHJcbiAgICBjb25zdCBjdXJyUXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1F1ZXVlLnJlbW92ZVF1ZXVlSXRlbSgwLCB0cnVlKTtcclxuXHJcbiAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlLnNhdmVQcmV2UShjdXJyUXVlc3Rpb24uX2lkKTtcclxuXHJcbiAgICAvLyBHZXQgdGhlIGFuc3dlciBvYmplY3QgYXMgaXQgc2hvdWxkIGJlIHN0b3JlZCBpbiB0aGUgREIuXHJcbiAgICBjb25zdCBhbnN3ZXJPYmogPSB0aGlzLmdldEFuc3dlck9iaihldmVudCwgY3VyclF1ZXN0aW9uKTtcclxuXHJcbiAgICAvLyBFbWl0IGV2ZW50IHRvIGJlIHBpY2tlZCB1cCBieSB0aGUgcXVlc3Rpb25zIHBhZ2UuXHJcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoXHJcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImFuc3dlcmVkUVwiLCB7ZGV0YWlsOiB7YW5zd2VyT2JqOiBhbnN3ZXJPYmp9fSlcclxuICAgICk7XHJcblxyXG4gICAgLy8gVXBkYXRlcyB0aGUgZGlzcGxheWVkIHF1ZXN0aW9uIGluIHRoZSBhbnN3ZXIgVUkgcGFuZWwgd2l0aCB0aGUgbmV3IGZpcnN0IFxyXG4gICAgLy8gcXVldWUgaXRlbS5cclxuICAgIHRoaXMuX3Nob3dDdXJyUSgpO1xyXG5cclxuICAgIC8vIEFkZHMgbW9yZSBxdWVzdGlvbnMgdG8gdGhlIHF1ZXN0aW9ucyBxdWV1ZSBpZiBuZWNlc3NhcnkuXHJcbiAgICBsZXQgcXVldWVVcGRhdGVkID0gYXdhaXQgdGhpcy5xdWVzdGlvbnNRdWV1ZS51cGRhdGUoKTtcclxuICAgIGlmIChxdWV1ZVVwZGF0ZWQpIHtcclxuICAgICAgdGhpcy5xdWVzdGlvbnNRdWV1ZS5jaGVja0Zvck91dGRhdGVkUXModHJ1ZSk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlcyB0aGUgZGlzcGxheWVkIHF1ZXN0aW9uIGluIHRoZSBhbnN3ZXIgVUkgcGFuZWwgd2l0aCB0aGUgbmV3IGZpcnN0IFxyXG4gIC8vIHF1ZXVlIGl0ZW0uIFxyXG4gIF9zaG93Q3VyclEoKSB7XHJcbiAgICBjb25zdCBpbmNsQWxyZWFkeUFuc3dlcmVkID0gdGhpcy5xdWV1ZUlucHV0UGFuZWw/LlxyXG4gICAgICBpbmNsdWRlQWxyZWFkeUFuc3dlcmVkQ2hlY2tib3guY2hlY2tlZDtcclxuXHJcbiAgICBzdXBlci5fc2hvd0N1cnJRKGluY2xBbHJlYWR5QW5zd2VyZWQpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgYWN0aXZhdGUoKSB7XHJcbiAgICBzdXBlci5hY3RpdmF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlcyB0aGUgcXVlc3Rpb25zIHF1ZXVlIGFuZCB0aGVuIGRpc3BsYXlzIHRoZSBmaXJzdCBxdWVzdGlvbiBvZiBpdCwgXHJcbiAgLy8gY2FsbGVkIHdoZW4gc3dpdGNoaW5nIHRvIHRoaXMgcXVlc3Rpb25zIG1vZGUuXHJcbiAgYXN5bmMgdXBkYXRlUXVldWVBbmRTaG93Rmlyc3QoaXNOZXdRdWV1ZSA9IGZhbHNlKSB7XHJcbiAgICB0aGlzLmFuc3dlclVpUGFuZWwuc2hvd0xvYWRlcigpO1xyXG4gICAgYXdhaXQgdGhpcy51cGRhdGVRdWV1ZShpc05ld1F1ZXVlKTtcclxuICAgIHRoaXMuYW5zd2VyVWlQYW5lbC5oaWRlTG9hZGVyKCk7XHJcbiAgICB0aGlzLl9zaG93Q3VyclEoKTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZXMgdGhlIHF1ZXN0aW9ucyBxdWV1ZS5cclxuICBhc3luYyB1cGRhdGVRdWV1ZShpc05ld1F1ZXVlKSB7XHJcbiAgICAvLyBRdWV1ZSB3aWxsIG9ubHkgdXBkYXRlIGlmIGl0J3Mgc2hvcnQgb24gYW5zd2Vycy5cclxuICAgIGF3YWl0IHRoaXMucXVlc3Rpb25zUXVldWUudXBkYXRlKGlzTmV3UXVldWUpO1xyXG5cclxuICAgIC8vIENoZWNrcyB0aGUgcXVldWUgdG8gc2VlIGlmIGFueSBxdWVzdGlvbnMgaW4gaXQgYXJlIG5vdyBvdXRkYXRlZCBiYXNlZCBvbiBcclxuICAgIC8vIHJlY2VudGx5IFBPU1RlZCBhbnN3ZXJzIG9yIHJlY2VudCBhbnN3ZXJzIGZyb20gb3RoZXIgcXVlc3Rpb25zIG1vZGVzIHRoYXQgXHJcbiAgICAvLyBoYXZlbid0IHlldCBiZWVuIFBPU1RlZC5cclxuICAgIHRoaXMucXVlc3Rpb25zUXVldWUuY2hlY2tGb3JPdXRkYXRlZFFzKCk7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgUU1vZGVXaXRoUXVldWVJbnB1dCB9IGZyb20gXCIuLi9xTW9kZVdpdGhRdWV1ZUlucHV0Lm1qc1wiO1xyXG5cclxuaW1wb3J0IHsgQXV0b1F1ZXVlSW5wdXRQYW5lbCB9IGZyb20gXCIuLi8uLi8uLi9jb21wb25lbnRzL3F1ZXVlSW5wdXRQYW5lbC9cXFxyXG5zdWItY2xhc3Nlcy9hdXRvUXVldWVJbnB1dFBhbmVsLm1qc1wiO1xyXG5cclxuaW1wb3J0IHsgQXV0b1F1ZXN0aW9uc1F1ZXVlIH0gZnJvbSBcIi4uLy4uLy4uL2NvbXBvbmVudHMvYmFzZVF1ZXN0aW9uc1F1ZXVlL1xcXHJcbnN1Yi1jbGFzc2VzL3F1ZXN0aW9uc1F1ZXVlL3N1Yi1jbGFzc2VzL2F1dG9RdWVzdGlvbnNRdWV1ZS5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEF1dG9Nb2RlIGV4dGVuZHMgUU1vZGVXaXRoUXVldWVJbnB1dCB7XHJcbiAgbmFtZSA9IFwiYXV0b1wiO1xyXG5cclxuICBjb25zdHJ1Y3RvcihtYWluRGl2LCBjYXRlZ29yeVR5cGUsIGNhdGVnb3J5LCBidG4gPSBudWxsKSB7XHJcbiAgICBzdXBlcihtYWluRGl2LCBidG4pO1xyXG4gICAgdGhpcy5xdWVzdGlvbnNRdWV1ZSA9IG5ldyBBdXRvUXVlc3Rpb25zUXVldWUobWFpbkRpdiwgY2F0ZWdvcnlUeXBlLCBjYXRlZ29yeSk7XHJcbiAgICB0aGlzLnF1ZXVlSW5wdXRQYW5lbCA9IG5ldyBBdXRvUXVldWVJbnB1dFBhbmVsKG1haW5EaXYpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyB1cCB0aGUgcXVldWUgaW5wdXQgcGFuZWwgYW5kIGFuc3dlciBVSSBwYW5lbCBidXR0b24gZXZlbnQgbGlzdGVuZXJzLlxyXG4gIGluaXQoKSB7XHJcbiAgICBzdXBlci5pbml0KCk7XHJcbiAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlLmlucHV0UGFuZWwgPSB0aGlzLnF1ZXVlSW5wdXRQYW5lbDtcclxuXHJcbiAgICB0aGlzLnF1ZXVlSW5wdXRQYW5lbC5pbmNsdWRlQWxyZWFkeUFuc3dlcmVkQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlLnJlc2V0KCk7XHJcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlUXVldWVBbmRTaG93Rmlyc3QodHJ1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBRTW9kZVdpdGhRdWV1ZUlucHV0IH0gZnJvbSBcIi4uL3FNb2RlV2l0aFF1ZXVlSW5wdXQubWpzXCI7XHJcblxyXG5pbXBvcnQgeyBTZWFyY2hRdWV1ZUlucHV0UGFuZWwgfSBmcm9tIFwiLi4vLi4vLi4vY29tcG9uZW50cy9xdWV1ZUlucHV0UGFuZWwvXFxcclxuc3ViLWNsYXNzZXMvc2VhcmNoUXVldWVJbnB1dFBhbmVsLm1qc1wiO1xyXG5cclxuaW1wb3J0IHsgU2VhcmNoUXVlc3Rpb25zUXVldWUgfSBmcm9tIFwiLi4vLi4vLi4vY29tcG9uZW50cy9iYXNlUXVlc3Rpb25zUXVldWUvXFxcclxuc3ViLWNsYXNzZXMvcXVlc3Rpb25zUXVldWUvc3ViLWNsYXNzZXMvc2VhcmNoUXVlc3Rpb25zUXVldWUubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTZWFyY2hNb2RlIGV4dGVuZHMgUU1vZGVXaXRoUXVldWVJbnB1dCB7XHJcbiAgbmFtZSA9IFwic2VhcmNoXCI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1haW5EaXYsIGNhdGVnb3J5VHlwZSwgY2F0ZWdvcnksIGJ0biA9IG51bGwpIHtcclxuICAgIHN1cGVyKG1haW5EaXYsIGJ0bik7XHJcbiAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlID0gbmV3IFNlYXJjaFF1ZXN0aW9uc1F1ZXVlKG1haW5EaXYsIGNhdGVnb3J5VHlwZSwgY2F0ZWdvcnkpO1xyXG4gICAgdGhpcy5xdWV1ZUlucHV0UGFuZWwgPSBuZXcgU2VhcmNoUXVldWVJbnB1dFBhbmVsKG1haW5EaXYpO1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlcyB0aGUgcXVlc3Rpb25zIHF1ZXVlIGFuZCB0aGVuIGRpc3BsYXlzIHRoZSBmaXJzdCBxdWVzdGlvbiBvZiBpdCwgXHJcbiAgLy8gY2FsbGVkIHdoZW4gc3dpdGNoaW5nIHRvIHRoaXMgcXVlc3Rpb25zIG1vZGUuXHJcbiAgYXN5bmMgdXBkYXRlUXVldWVBbmRTaG93Rmlyc3QoaXNOZXdRdWV1ZSA9IGZhbHNlKSB7XHJcbiAgICBpZiAodGhpcy5xdWV1ZUlucHV0UGFuZWwuc2VhcmNoSW5wdXQudmFsdWUgIT09IFwiXCIpIHtcclxuICAgICAgdGhpcy5hbnN3ZXJVaVBhbmVsLnNob3dMb2FkZXIoKTtcclxuICAgICAgYXdhaXQgc3VwZXIudXBkYXRlUXVldWUoaXNOZXdRdWV1ZSk7XHJcbiAgICB9O1xyXG4gIFxyXG4gICAgdGhpcy5hbnN3ZXJVaVBhbmVsLmhpZGVMb2FkZXIoKTtcclxuICAgIHRoaXMuX3Nob3dDdXJyUSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyB1cCB0aGUgcXVldWUgaW5wdXQgcGFuZWwgYW5kIGFuc3dlciBVSSBwYW5lbCBidXR0b24gZXZlbnQgbGlzdGVuZXJzLlxyXG4gIGluaXQoKSB7XHJcbiAgICBzdXBlci5pbml0KCk7XHJcbiAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlLmlucHV0UGFuZWwgPSB0aGlzLnF1ZXVlSW5wdXRQYW5lbDtcclxuICAgIHRoaXMucXVlc3Rpb25zUXVldWUuaW5wdXRQYW5lbC5pbml0KCk7XHJcblxyXG4gICAgdGhpcy5xdWV1ZUlucHV0UGFuZWwuc2VhcmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlYXJjaFRlcm1DaGFuZ2VkID0gdGhpcy5xdWVzdGlvbnNRdWV1ZS5jaGVja1NlYXJjaFRlcm1DaGFuZ2VkKCk7XHJcbiAgICAgIGlmIChzZWFyY2hUZXJtQ2hhbmdlZCkge1xyXG4gICAgICAgIHRoaXMuI3Jlc2V0UXVldWVBbmRVcGRhdGUoKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucXVldWVJbnB1dFBhbmVsLmluY2x1ZGVBbHJlYWR5QW5zd2VyZWRDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgdGhpcy4jcmVzZXRRdWV1ZUFuZFVwZGF0ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyAjcmVzZXRRdWV1ZUFuZFVwZGF0ZSgpIHtcclxuICAgIHRoaXMucXVlc3Rpb25zUXVldWUucmVzZXQoKTtcclxuICAgIHRoaXMucXVlc3Rpb25zUXVldWUuc2V0U2VhcmNoUXVlcnkoKTtcclxuICAgIGF3YWl0IHRoaXMudXBkYXRlUXVldWVBbmRTaG93Rmlyc3QodHJ1ZSk7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgUXVlc3Rpb25zTW9kZSB9IGZyb20gXCIuLi8uLi9xdWVzdGlvbnNNb2RlLm1qc1wiO1xyXG5cclxuaW1wb3J0IHsgU2luZ2xlUXVlc3Rpb25RdWV1ZSB9IGZyb20gXCIuLi8uLi9jb21wb25lbnRzL2Jhc2VRdWVzdGlvbnNRdWV1ZS9cXFxyXG5zdWItY2xhc3Nlcy9zaW5nbGVRdWVzdGlvblF1ZXVlLm1qc1wiO1xyXG5cclxuaW1wb3J0IHsgQ2VudHJlTW9kYWwgfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vY2VudHJlTW9kYWwubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTaW5nbGVBbnN3ZXJNb2RlIGV4dGVuZHMgUXVlc3Rpb25zTW9kZSB7XHJcbiAgbmFtZSA9IFwic2luZ2xlXCI7XHJcbiAgX3FTb3VyY2U7XHJcbiAgX2Fuc3dlclVpTW9kYWw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1haW5EaXYsIHFTb3VyY2UsIGJ0biA9IG51bGwpIHtcclxuICAgIHN1cGVyKG1haW5EaXYsIGJ0bik7XHJcbiAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlID0gbmV3IFNpbmdsZVF1ZXN0aW9uUXVldWUobWFpbkRpdik7XHJcbiAgICB0aGlzLl9xU291cmNlID0gcVNvdXJjZTtcclxuXHJcbiAgICBjb25zdCBtb2RhbFdyYXBwZXIgPSBtYWluRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuY2VudHJlLW1vZGFsLXdyYXBwZXJcIik7XHJcbiAgICB0aGlzLl9hbnN3ZXJVaU1vZGFsID0gbmV3IENlbnRyZU1vZGFsKG1vZGFsV3JhcHBlcik7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgc3VwZXIuaW5pdCgpO1xyXG5cclxuICAgIHRoaXMuX3FTb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcihcImFuc3dlclNpbmdsZVFcIiwgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5faGFuZGxlQ2xpY2tTaW5nbGVRKGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl9hbnN3ZXJVaU1vZGFsLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8vIFNhdmUgYW5zd2VyIGluZm9ybWF0aW9uLlxyXG4gIGFuc3dlclF1ZXN0aW9uKGV2ZW50KSB7XHJcbiAgICBjb25zdCBjdXJyUXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1F1ZXVlLnJlbW92ZVF1ZXVlSXRlbSgwLCB0cnVlKTtcclxuXHJcbiAgICAvLyBHZXQgdGhlIGFuc3dlciBvYmplY3QgYXMgaXQgc2hvdWxkIGJlIHN0b3JlZCBpbiB0aGUgREIuXHJcbiAgICBjb25zdCBhbnN3ZXJPYmogPSB0aGlzLmdldEFuc3dlck9iaihldmVudCwgY3VyclF1ZXN0aW9uKTsgXHJcblxyXG4gICAgLy8gRW1pdCBldmVudCB0byBiZSBwaWNrZWQgdXAgYnkgdGhlIHF1ZXN0aW9ucyBwYWdlLlxyXG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJhbnN3ZXJlZFFcIiwge2RldGFpbDoge2Fuc3dlck9iajogYW5zd2VyT2JqfX0pXHJcbiAgICApO1xyXG5cclxuICAgIC8vIEhpZGUgdGhlIGFuc3dlciB1aSBwYW5lbC5cclxuICAgIHRoaXMuX2Fuc3dlclVpTW9kYWwuaGlkZSgpO1xyXG5cclxuICAgIHJldHVybiBhbnN3ZXJPYmo7XHJcbiAgfVxyXG5cclxuICBfaGFuZGxlQ2xpY2tTaW5nbGVRKGV2dCkge1xyXG4gICAgLy8gR2V0IHRoZSBxdWVzdGlvbiBmcm9tIHRoaXMgaXRlbSBhbmQgbWFrZSBpdCB0aGUgcXVldWUgY29udGVudHMuXHJcbiAgICBjb25zdCB0aGlzUUl0ZW0gPSBldnQuZGV0YWlsLnF1ZXN0aW9uO1xyXG4gICAgY29uc3QgdGhpc1F1ZXN0aW9uID0gdGhpcy5fbWFrZVF1ZXN0aW9uKHRoaXNRSXRlbSk7XHJcbiAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlLnVwZGF0ZSh0aGlzUXVlc3Rpb24pO1xyXG5cclxuICAgIC8vIFNob3cgdGhlIGFuc3dlciB1aSBwYW5lbC5cclxuICAgIHRoaXMuX2Fuc3dlclVpTW9kYWwuc2hvdygpO1xyXG5cclxuICAgIC8vIFVwZGF0ZXMgdGhlIGRpc3BsYXllZCBxdWVzdGlvbiBpbiB0aGUgYW5zd2VyIFVJIHBhbmVsIHdpdGggdGhlIG5ldyBmaXJzdCBcclxuICAgIC8vIHF1ZXVlIGl0ZW0uXHJcbiAgICB0aGlzLl9zaG93Q3VyclEoKTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBTaW5nbGVBbnN3ZXJNb2RlIH0gZnJvbSBcIi4uL3NpbmdsZUFuc3dlck1vZGUubWpzXCI7XHJcblxyXG5pbXBvcnQgeyBTaW5nbGVRdWVzdGlvblF1ZXVlIH0gZnJvbSBcIi4uLy4uLy4uL2NvbXBvbmVudHMvYmFzZVF1ZXN0aW9uc1F1ZXVlL1xcXHJcbnN1Yi1jbGFzc2VzL3NpbmdsZVF1ZXN0aW9uUXVldWUubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBQcmV2QW5zd2VyTW9kZSBleHRlbmRzIFNpbmdsZUFuc3dlck1vZGUge1xyXG4gIG5hbWUgPSBcInByZXZBbnNcIjtcclxuXHJcbiAgY29uc3RydWN0b3IobWFpbkRpdiwgcVNvdXJjZSwgY2F0VHlwZU5hbWUsIGNhdE5hbWUsIGJ0biA9IG51bGwpIHtcclxuICAgIHN1cGVyKG1haW5EaXYsIHFTb3VyY2UsIGJ0bik7XHJcbiAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlID0gbmV3IFNpbmdsZVF1ZXN0aW9uUXVldWUobWFpbkRpdiwgY2F0VHlwZU5hbWUsIGNhdE5hbWUpO1xyXG4gIH1cclxuXHJcbiAgLy8gUGFzc2VzIHRoZSBsYXRlc3RTZXNzaW9uIGFuc3dlcnMgb24gdG8gdGhlIHFTb3VyY2UuXHJcbiAgc2V0UmVjZW50QW5zd2VycyhsYXRlc3RTZXNzaW9uQW5zd2Vycykge1xyXG4gICAgdGhpcy5fcVNvdXJjZS51cGRhdGVBbnN3ZXJzTGlzdChsYXRlc3RTZXNzaW9uQW5zd2Vycyk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBhY3RpdmF0ZSgpIHtcclxuICAgIHN1cGVyLmFjdGl2YXRlKCk7XHJcbiAgICBhd2FpdCB0aGlzLl9xU291cmNlLmFjdGl2YXRlKCk7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlKCkge1xyXG4gICAgdGhpcy5fcVNvdXJjZS5kZWFjdGl2YXRlKCk7XHJcbiAgICBzdXBlci5kZWFjdGl2YXRlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBNYWtlcyBhIHF1ZXN0aW9uLCByZWFkeSB0byBiZSBzaG93biBpbiB0aGUgYW5zd2VyVWlQYW5lbCwgZnJvbSB0aGUgY2xpY2tlZCBcclxuICAvLyBvbiBwcmV2QW5zd2VyLlxyXG4gIF9tYWtlUXVlc3Rpb24ocHJldkFucykge1xyXG4gICAgY29uc3QgdGhpc1EgPSB7XHJcbiAgICAgIF9pZDogcHJldkFucy5xdWVzdGlvbklkLFxyXG4gICAgICBjdXJyQW5zOiB7XHJcbiAgICAgICAgc2tpcDogcHJldkFucz8uc2tpcCxcclxuICAgICAgICBhbnN3ZXJWYWw6IHByZXZBbnM/LmFuc3dlclZhbFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAobGV0IHByb3AgaW4gcHJldkFucy5xdWVzdGlvbkRldGFpbHMpIHtcclxuICAgICAgdGhpc1FbcHJvcF0gPSBwcmV2QW5zLnF1ZXN0aW9uRGV0YWlsc1twcm9wXVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpc1E7XHJcbiAgfVxyXG59IiwiLy8gUmV0dXJucyB0aGUgY2F0ZWdvcnkgYW5kIHR5cGUgZm9yIGEgZ2l2ZW4gcXVlc3Rpb24gYW5kIG9iamVjdC4gSWYgb2JqZWN0IGhhcyBcclxuLy8gbm8gY2F0ZWdvcnkgdGhlbiB1c2UgdGhhdCBvZiB0aGUgcXVlc3Rpb24uIFVzZWQgb24gYmFzZVF1ZXN0aW9ucyBRdWV1ZSBhbmQgXHJcbi8vIHNpbmdsZU1vZGVRU291cmNlLlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UUNhdGVnb3J5KHEsIG9iakNhdFR5cGUsIG9iakNhdCkge1xyXG4gIHJldHVybiAob2JqQ2F0KSA/IFtvYmpDYXRUeXBlLCBvYmpDYXRdIDogXHJcbiAgICBbcS5jYXRlZ29yeVR5cGVOYW1lID8/IHEuY2F0ZWdvcnlUeXBlLCBxLmNhdGVnb3J5TmFtZSA/PyBxLmNhdGVnb3J5XTtcclxufVxyXG5cclxuLy8gR2V0cyB0aGUgY29ycmVjdCBpbWFnZSBwYXRoLCBkZXBlbmRpbmcgb24gdGhlIGNhdGVnb3J5LlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UUluZm8ocSwgZGV0YWlsLCBjYXRUeXBlTmFtZSwgY2F0TmFtZSkge1xyXG4gIGxldCBpbmZvO1xyXG5cclxuICBzd2l0Y2goY2F0VHlwZU5hbWUsIGNhdE5hbWUpIHtcclxuXHJcbiAgICBjYXNlIChcIkludGVyZXN0c1wiLCBcIkZpbG1zXCIpIDpcclxuICAgICAgaW5mbyA9IHtcclxuICAgICAgICBpbWdQYXRoOiBxPy5wb3N0ZXJQYXRoID8gYGh0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cxODUvJHtxLnBvc3RlclBhdGh9YCA6IG51bGwsXHJcbiAgICAgICAgcURpc3BsYXlUZXh0OiBgJHtxPy50aXRsZX0gKCR7Z2V0RGlzcGxheVJlbGVhc2VEYXRlKHE/LnJlbGVhc2VEYXRlKX0pYCxcclxuICAgICAgICBxU291cmNlRGlzcGxheVRleHQ6IGAke3E/LnRpdGxlfWAsXHJcbiAgICAgICAgaW1nUGxhY2VIb2xkZXJUeHQ6IGAke3E/LnRpdGxlfWBcclxuICAgICAgfTtcclxuICAgICAgYnJlYWs7XHJcblxyXG4gICAgY2FzZSAoXCJJbnRlcmVzdHNcIiwgXCJUVlwiKSA6XHJcbiAgICAgIGluZm8gPSB7XHJcbiAgICAgICAgaW1nUGF0aDogcT8ucG9zdGVyUGF0aCA/IGBodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LyR7cS5wb3N0ZXJQYXRofWAgOiBudWxsLFxyXG4gICAgICAgIHFEaXNwbGF5VGV4dDogYCR7cT8udGl0bGV9ICgke2dldERpc3BsYXlSZWxlYXNlRGF0ZShxPy5yZWxlYXNlRGF0ZSl9KWAsXHJcbiAgICAgICAgcVNvdXJjZURpc3BsYXlUZXh0OiBgJHtxPy50aXRsZX1gLFxyXG4gICAgICAgIGltZ1BsYWNlSG9sZGVyVHh0OiBgJHtxPy50aXRsZX1gXHJcbiAgICAgIH07XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGNhc2UgKFwiSW50ZXJlc3RzXCIsIFwiTXVzaWNcIik6XHJcbiAgICAgIGluZm8gPSB7XHJcbiAgICAgICAgaW1nUGF0aDogcT8uaW1hZ2UsXHJcbiAgICAgICAgcURpc3BsYXlUZXh0OiBgJHtxPy50cmFja05hbWV9IC0gJHtxPy5hcnRpc3R9ICgke3E/LmFsYnVtfSAtICR7bmV3IERhdGUocT8ucmVsZWFzZURhdGUpLmdldEZ1bGxZZWFyKCl9KWAsXHJcbiAgICAgICAgcVNvdXJjZURpc3BsYXlUZXh0OiBgJHtxPy50cmFja05hbWV9IC0gJHtxPy5hcnRpc3R9YCxcclxuICAgICAgICBpbWdQbGFjZUhvbGRlclR4dDogYCR7cT8udHJhY2tOYW1lfWBcclxuICAgICAgfTtcclxuICAgICAgYnJlYWs7XHJcblxyXG4gICAgY2FzZSAoXCJJbnRlcmVzdHNcIiwgXCJWaWRlbyBHYW1lc1wiKTpcclxuICAgICAgaW5mbyA9IHtcclxuICAgICAgICBpbWdQYXRoOiBxPy5pbWFnZSA/IGBodHRwczovL2ltYWdlcy5pZ2RiLmNvbS9pZ2RiL2ltYWdlL3VwbG9hZC90X2NvdmVyX2JpZy8ke3EuaW1hZ2V9LmpwZ2AgOiBudWxsLFxyXG4gICAgICAgIHFEaXNwbGF5VGV4dDogYCR7cT8udGl0bGV9ICgke2dldERpc3BsYXlSZWxlYXNlRGF0ZShxPy5yZWxlYXNlRGF0ZSl9KSAoJHtxLnBsYXRmb3Jtc30pYCxcclxuICAgICAgICBxU291cmNlRGlzcGxheVRleHQ6IGAke3E/LnRpdGxlfWAsXHJcbiAgICAgICAgaW1nUGxhY2VIb2xkZXJUeHQ6IGAke3E/LnRpdGxlfWBcclxuICAgICAgfTtcclxuICAgICAgYnJlYWs7XHJcblxyXG4gICAgY2FzZSAoXCJJbnRlcmVzdHNcIiwgXCJCb29rc1wiKTpcclxuICAgICAgaW5mbyA9IHtcclxuICAgICAgICBpbWdQYXRoOiBxPy5pbWFnZSA/IGBodHRwczovL2NvdmVycy5vcGVubGlicmFyeS5vcmcvYi9pZC8ke3EuaW1hZ2V9LU0uanBnYCA6IG51bGwsXHJcbiAgICAgICAgcURpc3BsYXlUZXh0OiBgJHtxPy50aXRsZX0gKCR7cT8uYXV0aG9yfSlgLFxyXG4gICAgICAgIHFTb3VyY2VEaXNwbGF5VGV4dDogYCR7cT8udGl0bGV9YCxcclxuICAgICAgICBpbWdQbGFjZUhvbGRlclR4dDogYCR7cT8udGl0bGV9YFxyXG4gICAgICB9O1xyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBpbmZvID0ge1xyXG4gICAgICAgIGltZ1BhdGg6IG51bGwsXHJcbiAgICAgICAgcURpc3BsYXlUZXh0OiBxPy50ZXh0LFxyXG4gICAgICAgIHFTb3VyY2VEaXNwbGF5VGV4dDogcT8uc2hvcnRUZXh0LFxyXG4gICAgICAgIGltZ1BsYWNlSG9sZGVyVHh0OiBxPy5zaG9ydFRleHQgPz8gcS50ZXh0XHJcbiAgICAgIH07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGluZm9bZGV0YWlsXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGlzcGxheVJlbGVhc2VEYXRlKHJlbGVhc2VEYXRlKSB7XHJcbiAgcmV0dXJuIHJlbGVhc2VEYXRlID8gbmV3IERhdGUocmVsZWFzZURhdGUpLmdldEZ1bGxZZWFyKCkgOiBcIlVua25vd25cIjtcclxufVxyXG5cclxuLy8gVXNlZCBpbiB0aGUgZG9tIHF1ZXVlIGZvciBhbnN3ZXJpbmcgcXVlc3Rpb25zIChzZWFyY2ggYW5kIGF1dG8pIGFuZCBhbHNvIGluIFxyXG4vLyBwcmV2IGFuc3dlcnMgYW5kIHJlY29tbWVuZGF0aW9ucyBwYWdlcy5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVFEb21JdGVtKHEsIGNhdFR5cGVOYW1lLCBjYXROYW1lLCBsYXp5TG9hZCA9IHRydWUpIHtcclxuICBjb25zdCBuZXdEb21RID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTs7XHJcblxyXG4gIGNvbnN0IGltZ1BhdGggPSBnZXRRSW5mbyhxLCBcImltZ1BhdGhcIiwgY2F0VHlwZU5hbWUsIGNhdE5hbWUpO1xyXG4gIFxyXG4gIGlmIChpbWdQYXRoKSB7XHJcbiAgICBjb25zdCBkb21JbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgZG9tSW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCBpbWdQYXRoKTtcclxuICAgIGlmIChsYXp5TG9hZCkgZG9tSW1nLnNldEF0dHJpYnV0ZShcImxvYWRpbmdcIiwgXCJsYXp5XCIpO1xyXG5cclxuICAgIGRvbUltZy5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgcT8udGl0bGUpO1xyXG4gICAgbmV3RG9tUS5hcHBlbmRDaGlsZChkb21JbWcpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGNvbnN0IG5vSW1nRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIG5vSW1nRGl2LmNsYXNzTGlzdC5hZGQoXCJwbGFjZWhvbGRlci1pbWdcIik7XHJcbiAgICBjb25zdCBub0ltZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIGNvbnN0IHBsYWNlaG9sZGVyVGV4dCA9IGdldFFJbmZvKHEsIFwiaW1nUGxhY2VIb2xkZXJUeHRcIiwgY2F0VHlwZU5hbWUsIGNhdE5hbWUpO1xyXG4gICAgbm9JbWdUZXh0LmlubmVyVGV4dCA9IHBsYWNlaG9sZGVyVGV4dDtcclxuXHJcbiAgICBub0ltZ0Rpdi5hcHBlbmRDaGlsZChub0ltZ1RleHQpO1xyXG4gICAgbmV3RG9tUS5hcHBlbmRDaGlsZChub0ltZ0Rpdik7XHJcbiAgfTtcclxuXHJcbiAgaWYgKHEucHJldmlld1VybCkge1xyXG4gICAgY29uc3QgZG9tTXVzaWNQbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XHJcbiAgICBkb21NdXNpY1BsYXllci5zZXRBdHRyaWJ1dGUoXCJjb250cm9sc1wiLCBcInRydWVcIik7XHJcbiAgICBkb21NdXNpY1BsYXllci5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgcS5wcmV2aWV3VXJsKTtcclxuICAgIG5ld0RvbVEuYXBwZW5kQ2hpbGQoZG9tTXVzaWNQbGF5ZXIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBuZXdEb21RO1xyXG59IiwiaW1wb3J0IHsgZmluaXNoRmFkZU91dCB9IGZyb20gXCIuLi8uLi9mYWRlVHJhbnNpdGlvbnMubWpzXCI7XHJcbmltcG9ydCB7IGZpbmRBbmRPdmVyd3JpdGVFbHNlUHVzaCB9IGZyb20gXCIuLi8uLi8uLi8uLi9zaGFyZWRKcy91dGlscy5tanNcIjtcclxuXHJcbmltcG9ydCB7IFFNb2RlV2l0aFF1ZXVlSW5wdXQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL3N1Yi1jbGFzc2VzL1xcXHJcbnFNb2RlV2l0aFF1ZXVlSW5wdXQvcU1vZGVXaXRoUXVldWVJbnB1dC5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uc1BhZ2Uge1xyXG4gICNzd2l0Y2hpbmdNb2RlID0gZmFsc2U7XHJcbiAgcXVlc3Rpb25zTW9kZXM7XHJcbiAgcU1vZGVTd2l0Y2hlcjtcclxuICBjdXJyUXVlc3Rpb25Nb2RlO1xyXG4gIGNhdGVnb3J5VHlwZU5hbWU7XHJcbiAgY2F0ZWdvcnlOYW1lO1xyXG4gIC8vIE5ldyBhbnN3ZXJzIHRoYXQgaGF2ZSBub3QgeWV0IGJlZW4gUE9TVGVkIHRvIHNlcnZlci5cclxuICBub3RZZXRQb3N0ZWRBbnN3ZXJzID0gW107XHJcbiAgLy8gVGhlIG5vdCB5ZXQgUE9TVGVkIGFuc3dlcnMgcGx1cyBhbnkgYW5zd2VycyB0aGF0IGFyZSBQT1NUZWQgYnV0IHRoZSBzYXZlIFxyXG4gIC8vIG9uIGJhY2sgZW5kIGhhc24ndCBjb21wbGV0ZWQgeWV0LlxyXG4gIGFsbFJlY2VudEFuc3dlcnMgPSBbXTtcclxuICBzdGF0aWMgI3N1Ym1pdEFuc3dlcnNJbnRlcnZhbCA9IDYwMDAwMDsgLy8gMTAgbWluc1xyXG5cclxuICBjb25zdHJ1Y3RvcihxTW9kZXMsIHFNb2RlU3dpdGNoZXIgPSBbXSwgY2F0ZWdvcnlUeXBlTmFtZSA9IG51bGwsIFxyXG4gICAgY2F0ZWdvcnlOYW1lID0gbnVsbCkge1xyXG5cclxuICAgIHRoaXMucXVlc3Rpb25zTW9kZXMgPSBxTW9kZXM7XHJcbiAgICB0aGlzLnFNb2RlU3dpdGNoZXIgPSBxTW9kZVN3aXRjaGVyO1xyXG4gICAgdGhpcy5jYXRlZ29yeVR5cGVOYW1lID0gY2F0ZWdvcnlUeXBlTmFtZTtcclxuICAgIHRoaXMuY2F0ZWdvcnlOYW1lID0gY2F0ZWdvcnlOYW1lO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHVwIHRoZSBldmVudCBsaXN0ZW5lcnMgZm9yIGFsbCBidXR0b25zIGFuZCBwcm90b2NvbCBmb3IgdXBsb2FkaW5nIFxyXG4gIC8vIGFuc3dlcnMgZGF0YS5cclxuICBpbml0KCkge1xyXG4gICAgLy8gU2V0IHVwIGV2ZW50IGxpc3RlbmVycyBmb3IgYnV0dG9ucyB3aXRoaW4gZWFjaCBxdWVzdGlvbnMgbW9kZS5cclxuICAgIGZvciAobGV0IHFNb2RlIG9mIHRoaXMucXVlc3Rpb25zTW9kZXMpIHtcclxuICAgICAgcU1vZGUuaW5pdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBXaGVuIHF1ZXN0aW9ucyBwYWdlIGlzIGxlZnQgLyB0YWIgY2xvc2VkLCBwb3N0IGFueSBhbnN3ZXJzIHRvIHRoZSBzZXJ2ZXIuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuX3Bvc3RBbnN3ZXJzKHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU3VibWl0IGFuc3dlcnMgZXZlcnkgMTAgbWlucywgaWYgdGhlcmUgYXJlIGFueS5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgdGhpcy5fcG9zdEFuc3dlcnMoZmFsc2UpO1xyXG4gICAgfSwgUXVlc3Rpb25zUGFnZS4jc3VibWl0QW5zd2Vyc0ludGVydmFsKTtcclxuXHJcbiAgICAvLyBMaXN0ZW4gZm9yIGV2ZW50cyBlbWl0dGVkIGJ5IGFueSBxIG1vZGUgd2hlbiBhIHF1ZXN0aW9uIGlzIGFuc3dlcmVkLlxyXG4gICAgZm9yIChsZXQgcU1vZGUgb2YgdGhpcy5xdWVzdGlvbnNNb2Rlcykge1xyXG4gICAgICBxTW9kZS5hZGRFdmVudExpc3RlbmVyKFwiYW5zd2VyZWRRXCIsIGV2dCA9PiB7XHJcbiAgICAgICAgY29uc3QgYW5zd2VyT2JqID0gZXZ0LmRldGFpbC5hbnN3ZXJPYmo7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlTmV3QW5zd2VyKGFuc3dlck9iaik7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBJbml0IHRoZSBxTW9kZVN3aXRjaGVyLlxyXG4gICAgdGhpcy4jaW5pdFFNb2RlU3dpdGNoZXIoKTtcclxuICB9XHJcblxyXG4gIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgZm9yIHEgbW9kZSBzd2l0Y2ggYnV0dG9ucy5cclxuICAjaW5pdFFNb2RlU3dpdGNoZXIoKSB7XHJcbiAgICBmb3IgKGxldCBtb2RlQnRuTGluayBvZiB0aGlzLnFNb2RlU3dpdGNoZXIpIHtcclxuICAgICAgY29uc3QgcU1vZGVCdG4gPSBtb2RlQnRuTGluay5idG47XHJcbiAgICAgIGNvbnN0IHFNb2RlID0gbW9kZUJ0bkxpbmsubW9kZTtcclxuXHJcbiAgICAgIHFNb2RlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHN3aXRjaCBtb2RlIGlmIGFscmVhZHkgdHJhbnNpdGlvbmluZyBiZXR3ZWVuIHR3byBvciBpZiBcclxuICAgICAgICAvLyBjbGlja2VkIG9uIGN1cnJlbnQgcU1vZGUuXHJcbiAgICAgICAgY29uc3QgZG9udFN3aXRjaE1vZGUgPSB0aGlzLiNzd2l0Y2hpbmdNb2RlIHx8ICh0aGlzLmN1cnJRdWVzdGlvbk1vZGUgPT09IHFNb2RlKTtcclxuICAgICAgICBpZiAoZG9udFN3aXRjaE1vZGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy4jc3dpdGNoaW5nTW9kZSA9IHRydWU7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zd2l0Y2hRTW9kZShxTW9kZSlcclxuICAgICAgICB0aGlzLiNzd2l0Y2hpbmdNb2RlID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcbiAgXHJcbiAgLy8gU2F2ZXMgKG9yIG92ZXJ3cml0ZXMpIG5ldyBhbnN3ZXIgdG8gbm90WWV0UG9zdGVkIGFuZCBhbGxSZWNlbnRBbnN3ZXJzIGFuZCBcclxuICAvLyB0aGVuIHNlbmRzIHRoZSB1cGRhdGVkIHJlY2VudCBhbnN3ZXJzIGFycmF5IHRvIHRoZSBjdXJyZW50IHF1ZXN0aW9ucyBtb2RlLlxyXG4gIF9oYW5kbGVOZXdBbnN3ZXIoYW5zd2VyT2JqKSB7XHJcbiAgICB0aGlzLl91cGRhdGVBbnNBcnJheVdpdGhBbnModGhpcy5ub3RZZXRQb3N0ZWRBbnN3ZXJzLCBhbnN3ZXJPYmopO1xyXG4gICAgdGhpcy5fdXBkYXRlQW5zQXJyYXlXaXRoQW5zKHRoaXMuYWxsUmVjZW50QW5zd2VycywgYW5zd2VyT2JqKTtcclxuICAgIHRoaXMuX3NldFJlY2VudEFuc3dlcnMoKTtcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZSBjdXJyZW50IHF1ZXN0aW9uIG1vZGU6IGhpZGUgaXQsIGdldCB0aGUgbGF0ZXN0IGFuc3dlcnMgYW5kIHBvc3QgXHJcbiAgLy8gdGhlbSB0byB0aGUgc2VydmVyLlxyXG4gIHJlbW92ZVFtb2RlKCkge1xyXG4gICAgdGhpcy5jdXJyUXVlc3Rpb25Nb2RlLmRlYWN0aXZhdGUoKTtcclxuICB9XHJcblxyXG4gIC8vIFNldCB0aGUgbmV3IHF1ZXN0aW9ucyBtb2RlIGFuZCBzaG93IGl0LlxyXG4gIGFzeW5jIHNldFFNb2RlKG5ld1FNb2RlKSB7XHJcbiAgICB0aGlzLmN1cnJRdWVzdGlvbk1vZGUgPSBuZXdRTW9kZTtcclxuICAgIGF3YWl0IHRoaXMuY3VyclF1ZXN0aW9uTW9kZS5hY3RpdmF0ZSgpO1xyXG5cclxuICAgIHRoaXMuX3NldFJlY2VudEFuc3dlcnMoKTtcclxuXHJcbiAgICBpZiAodGhpcy5jdXJyUXVlc3Rpb25Nb2RlIGluc3RhbmNlb2YgUU1vZGVXaXRoUXVldWVJbnB1dCkge1xyXG4gICAgICAvLyBVcGRhdGUgdGhlIHF1ZXVlIGZvciB0aGUgcXVlc3Rpb25zIG1vZGUgYW5kIHNob3cgZmlyc3QgaXRlbSBpbiB0aGUgcXVldWUuXHJcbiAgICAgIGF3YWl0IHRoaXMuY3VyclF1ZXN0aW9uTW9kZS51cGRhdGVRdWV1ZUFuZFNob3dGaXJzdCgpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIF9zZXRSZWNlbnRBbnN3ZXJzKCkge1xyXG4gICAgLy8gRG9uJ3QgbmVlZCB0byBrZWVwIGEgbGlzdCBvZiByZWNlbnQgYW5zd2VycyBmb3IgcmVjb21tZW5kYXRpb25zIG1vZGUuXHJcbiAgICBpZiAodGhpcy5jdXJyUXVlc3Rpb25Nb2RlPy5uYW1lICE9PSBcInJlY3NcIikge1xyXG4gICAgICB0aGlzLmN1cnJRdWVzdGlvbk1vZGUuc2V0UmVjZW50QW5zd2Vycyh0aGlzLmFsbFJlY2VudEFuc3dlcnMpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZXMgYW4gb3JpZ0Fuc0FycmF5IHdpdGggYSBuZXcgYW5zd2VyLCBvdmVyd3JpdGluZyB3aGVyZSBcclxuICAvLyBwcmVzZW50IGluIHRoZSBvcmlnQW5zQXJyYXkgKG90aGVyd2lzZSBhZGRpbmcpLlxyXG4gIF91cGRhdGVBbnNBcnJheVdpdGhBbnMob3JpZ0Fuc0FycmF5LCBuZXdBbnMpIHtcclxuICAgIGNvbnN0IG1hdGNoRnVuYyA9IChhcnJJdGVtLCBuZXdJdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBhcnJJdGVtLnF1ZXN0aW9uSWQgPT09IG5ld0l0ZW0ucXVlc3Rpb25JZFxyXG4gICAgfTtcclxuXHJcbiAgICBmaW5kQW5kT3ZlcndyaXRlRWxzZVB1c2gob3JpZ0Fuc0FycmF5LCBuZXdBbnMsIG1hdGNoRnVuYyk7XHJcbiAgfVxyXG5cclxuICAvLyBTd2l0Y2ggYmV0d2VlbiBxdWVzdGlvbiBtb2Rlcy5cclxuICBhc3luYyBzd2l0Y2hRTW9kZShuZXdRTW9kZSkge1xyXG4gICAgdGhpcy5yZW1vdmVRbW9kZSgpO1xyXG4gICAgYXdhaXQgZmluaXNoRmFkZU91dCh0aGlzLmN1cnJRdWVzdGlvbk1vZGUubWFpbkRpdik7XHJcbiAgICBhd2FpdCB0aGlzLnNldFFNb2RlKG5ld1FNb2RlKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gUmVzZXRzIHRoZSBuZXcgYW5kIHVwZGF0ZWQgYW5zd2VycyBmb3IgdGhpcyBxdWVzdGlvbnMgcGFnZS5cclxuICByZXNldEFuc3dlcnMoKSB7XHJcbiAgICB0aGlzLm5vdFlldFBvc3RlZEFuc3dlcnMgPSBbXTtcclxuICB9XHJcblxyXG4gIC8vIE9uY2UgdGhlIGZldGNoIFBPU1Qgb2Ygc29tZSBuZXcgYW5zd2VycyBldmVyeSAxMCBtaW5zIGhhcyBiZWVuIGNvbXBsZXRlZCwgXHJcbiAgLy8gdXBkYXRlIHRoZSBhbGxSZWNlbnRBbnN3ZXJzIHNvIHRoYXQgdGhlIHF1ZXVlIGhhcyBsZXNzIHRvIG1vZGlmeS5cclxuICBjbGVhclJlY2VudGx5UG9zdGVkQW5zd2VycyhzdWNjZXNzUG9zdGVkQW5zd2Vycykge1xyXG4gICAgLy8gUmVtb3ZlIGVhY2ggc3VjY2Vzc2Z1bGx5IFBPU1RlZCBhbnN3ZXIgZnJvbSB0aGlzIGFsbFJlY2VudEFuc3dlcnMuXHJcbiAgICBmb3IgKGxldCBzdWNjZXNzUG9zdGVkQW5zd2VyIG9mIHN1Y2Nlc3NQb3N0ZWRBbnN3ZXJzKSB7XHJcbiAgICAgIGNvbnN0IGZpbmRJbmRleCA9IGdldEZpbmRJbmRleChzdWNjZXNzUG9zdGVkQW5zd2VyLCB0aGlzLmFsbFJlY2VudEFuc3dlcnMpO1xyXG4gICAgICBpZiAoZmluZEluZGV4ID4gLTEpIHtcclxuICAgICAgICB0aGlzLmFsbFJlY2VudEFuc3dlcnMuc3BsaWNlKGZpbmRJbmRleCwgMSk7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBGaW5kcyB0aGlzIGV4YWN0IGFuc3dlciBpbiB0aGUgYWxsUmVjZW50QW5zd2VycyAoc2FtZSBcclxuICAgIC8vIHF1ZXN0aW9uSWQgbWF5IGFwcGVhciBtb3JlIHRoYW4gb25jZSBzbyBvbmx5IGZpbmQgZXhhY3QgbWF0Y2ggd2l0aCBcclxuICAgIC8vIGFuc3dlciAvIHNraXAgdmFsdWUgdG9vKS5cclxuICAgIGZ1bmN0aW9uIGdldEZpbmRJbmRleChzdWNjZXNzUG9zdGVkQW5zd2VyLCB1cGRhdGVBbnN3ZXJzQXJyYXkpIHtcclxuICAgICAgY29uc3QgZmluZEluZGV4ID0gdXBkYXRlQW5zd2Vyc0FycmF5LmZpbmRJbmRleChhbnMgPT4ge1xyXG4gICAgICAgIGxldCBpc01hdGNoID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBwcm9wc1RvQ2hlY2sgPSBbXCJxdWVzdGlvbklkXCIsIFwic2tpcFwiLCBcImFuc3dlclZhbFwiXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgcHJvcCBpbiBhbnMpIHtcclxuICAgICAgICAgIGNvbnN0IHNraXBQcm9wID0gIXByb3BzVG9DaGVjay5pbmNsdWRlcyhwcm9wKTtcclxuICAgICAgICAgIGlmIChza2lwUHJvcCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgaXNNYXRjaCA9IGFuc1twcm9wXSA9PT0gc3VjY2Vzc1Bvc3RlZEFuc3dlcltwcm9wXTtcclxuICAgICAgICAgIGlmICghaXNNYXRjaCkgYnJlYWs7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlzTWF0Y2g7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIGZpbmRJbmRleDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBQT1NUIHRoZXNlIGFuc3dlcnMgaW5mbyB0byB0aGUgc2VydmVyLlxyXG4gIGFzeW5jIF9wb3N0QW5zd2Vycyhpc0NoYW5nZU9mUGFnZSA9IGZhbHNlKSB7XHJcbiAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgYW55IGFuc3dlcnMgdG8gdXBsb2FkLlxyXG4gICAgY29uc3Qgbm9OZXdBbnN3ZXJzID0gdGhpcy5ub3RZZXRQb3N0ZWRBbnN3ZXJzLmxlbmd0aCA9PT0gMDtcclxuICAgIGlmIChub05ld0Fuc3dlcnMpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBbcG9zdFJvdXRlLCBhbnN3ZXJzVG9Qb3N0XSA9IHRoaXMuI2dldFBvc3RJbmZvKCk7XHJcblxyXG4gICAgY29uc3QgcG9zdE9iaiA9IHtcclxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgaGVhZGVyczoge1wiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwifSxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgIHR5cGU6IFwiYW5zd2Vyc1wiLCBcclxuICAgICAgICBkYXRhOiBhbnN3ZXJzVG9Qb3N0XHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBJZiBtb3Zpbmcgb2ZmIHRoZSBwYWdlLCBrZWVwIGZldGNoIHJlcXVlc3QgYWxpdmUuXHJcbiAgICBpZiAoaXNDaGFuZ2VPZlBhZ2UpIHtcclxuICAgICAgcG9zdE9iai5rZWVwYWxpdmUgPSB0cnVlO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGhpcy5yZXNldEFuc3dlcnMoKTtcclxuICAgIGF3YWl0IGZldGNoKHBvc3RSb3V0ZSwgcG9zdE9iaik7XHJcblxyXG4gICAgdGhpcy5jbGVhclJlY2VudGx5UG9zdGVkQW5zd2VycyhhbnN3ZXJzVG9Qb3N0KTtcclxuICB9XHJcblxyXG4gIC8vIEdldHMgdGhlIHJlbGV2YW50IHBvc3RSb3V0ZSBhbmQgYW5zd2Vyc1RvUG9zdCBmb3JtYXQgZm9yIHdoZXRoZXIgdXBsb2FkaW5nIFxyXG4gIC8vIGFuc3dlcnMgZm9yIGEgc2luZ2xlIGNhdGVnb3J5IChmcm9tIHF1ZXN0aW9ucyBwYWdlKSBvciBmb3IgbXVsdGlwbGUgXHJcbiAgLy8gY2F0ZWdvcmllcyAoZWcuIGZyb20gcmVjb21tZW5kYXRpb25zIHBhZ2UpLlxyXG4gICNnZXRQb3N0SW5mbygpIHtcclxuICAgIGNvbnN0IGFuc3dlcnNNaXhlZENhdGVnb3JpZXMgPSAhdGhpcy5jYXRlZ29yeU5hbWU7XHJcblxyXG4gICAgbGV0IHBvc3RSb3V0ZTtcclxuICAgIGxldCBhbnN3ZXJzVG9Qb3N0O1xyXG5cclxuICAgIGlmIChhbnN3ZXJzTWl4ZWRDYXRlZ29yaWVzKSB7XHJcbiAgICAgIHBvc3RSb3V0ZSA9IGAvcXVlc3Rpb25zL21peGVkLWNhdGVnb3JpZXNgO1xyXG4gICAgICBhbnN3ZXJzVG9Qb3N0ID0gdGhpcy4jZ2V0QW5zd2Vyc1RvUG9zdENhdEluZm8odGhpcy5ub3RZZXRQb3N0ZWRBbnN3ZXJzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBwb3N0Um91dGUgPSBgL3F1ZXN0aW9ucy8ke3RoaXMuY2F0ZWdvcnlUeXBlTmFtZX0vJHt0aGlzLmNhdGVnb3J5TmFtZX1gO1xyXG4gICAgICBhbnN3ZXJzVG9Qb3N0ID0gdGhpcy5ub3RZZXRQb3N0ZWRBbnN3ZXJzLnNsaWNlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBbcG9zdFJvdXRlLCBhbnN3ZXJzVG9Qb3N0XTtcclxuICB9XHJcblxyXG4gIC8vIE1ha2UgYSBjYXRlZ29yeSBpbmZvIG9iamVjdCB3aXRoIHRoZSBhbnN3ZXJzIGZvciBlYWNoIGNhdGVnb3J5LCBmb3Igd2hlbiBcclxuICAvLyB1cGxvYWRpbmcgYW5zd2VycyBmb3IgbXVsdGlwbGUgY2F0ZWdvcmllcyBhdCBvbmNlIChlZy4gZnJvbSByZWNvbW1lbmRhdGlvbnMgcGFnZSkuXHJcbiAgI2dldEFuc3dlcnNUb1Bvc3RDYXRJbmZvKGFuc3dlcnNUb1Bvc3QpIHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXNBbnN3ZXJzID0gW107XHJcblxyXG4gICAgLy8gUG9wdWxhdGUgY2F0ZWdvcmllc0Fuc3dlcnMgd2l0aCBhbnN3ZXJzIGZvciBlYWNoIGRpZmZlcmVudCBjYXRlZ29yeS5cclxuICAgIGZvciAobGV0IGFuc3dlciBvZiBhbnN3ZXJzVG9Qb3N0KSB7XHJcbiAgICAgIGNvbnN0IHRoaXNBbnNDYXRUeXBlID0gYW5zd2VyLnF1ZXN0aW9uRGV0YWlscy5jYXRlZ29yeVR5cGVOYW1lO1xyXG4gICAgICBjb25zdCB0aGlzQW5zQ2F0ID0gYW5zd2VyLnF1ZXN0aW9uRGV0YWlscy5jYXRlZ29yeU5hbWU7XHJcblxyXG4gICAgICBjb25zdCBmb3VuZENhdGVnb3J5SWR4ID0gY2F0ZWdvcmllc0Fuc3dlcnMuZmluZEluZGV4KGxpc3QgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhdFR5cGVNYXRjaCA9IGxpc3QuY2F0VHlwZSA9PT0gdGhpc0Fuc0NhdFR5cGU7XHJcbiAgICAgICAgY29uc3QgY2F0TWF0Y2ggPSBsaXN0LmNhdCA9PT0gdGhpc0Fuc0NhdDtcclxuICAgICAgICByZXR1cm4gKGNhdFR5cGVNYXRjaCAmJiBjYXRNYXRjaCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgZm9ybWF0dGVkQW5zID0gZm9ybWF0QW5zd2VyKGFuc3dlcik7XHJcblxyXG4gICAgICBpZiAoZm91bmRDYXRlZ29yeUlkeCA+IC0xKSB7XHJcbiAgICAgICAgY2F0ZWdvcmllc0Fuc3dlcnNbZm91bmRDYXRlZ29yeUlkeF0uYW5zd2Vycy5wdXNoKGZvcm1hdHRlZEFucyk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbmV3Q2F0ZWdvcnkgPSB7XHJcbiAgICAgICAgICBjYXRUeXBlOiB0aGlzQW5zQ2F0VHlwZSxcclxuICAgICAgICAgIGNhdDogdGhpc0Fuc0NhdCxcclxuICAgICAgICAgIGFuc3dlcnM6IFtmb3JtYXR0ZWRBbnNdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY2F0ZWdvcmllc0Fuc3dlcnMucHVzaChuZXdDYXRlZ29yeSk7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFJlbW92ZSB0aGUgY2F0ZWdvcnkgYW5kIGNhdGVnb3J5IHR5cGUgZnJvbSB0aGUgYW5zd2VyLlxyXG4gICAgZnVuY3Rpb24gZm9ybWF0QW5zd2VyKGFuc3dlcikge1xyXG4gICAgICBkZWxldGUgYW5zd2VyLnF1ZXN0aW9uRGV0YWlscy5jYXRlZ29yeU5hbWU7XHJcbiAgICAgIGRlbGV0ZSBhbnN3ZXIucXVlc3Rpb25EZXRhaWxzLmNhdGVnb3J5VHlwZU5hbWU7XHJcbiAgICAgIHJldHVybiBhbnN3ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhdGVnb3JpZXNBbnN3ZXJzO1xyXG4gIH1cclxufSIsImltcG9ydCB7IFF1ZXN0aW9uc1BhZ2UgfSBmcm9tIFwiLi4vcXVlc3Rpb25zUGFnZS5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gUXVlc3Rpb25zIHBhZ2UgdGhhdCBpbmNsdWRlZCBhIHByZXZpb3VzIGFuc3dlcnMgc2VjdGlvbiBmb3Igc2VlaW5nIHByZXZpb3VzIFxyXG4vLyBhbnN3ZXJzIG1hZGUgYnkgdGhlIHVzZXIsIGZvciB1c2Ugd2hlbiBpbiBxdWVzdGlvbnMgbW9kZSBwcm9wZXIuXHJcbmV4cG9ydCBjbGFzcyBGdWxsUXVlc3Rpb25zUGFnZSBleHRlbmRzIFF1ZXN0aW9uc1BhZ2Uge1xyXG4gIC8vIEp1c3QgdGhlIHNlc3Npb24gYW5zd2VycyBzaW5jZSBsYXN0IHRpbWUgd2FzIG9uIHRoZSBwcmV2IGFuc3dlcnMgbW9kZS5cclxuICAjbGF0ZXN0U2Vzc2lvbkFuc3dlcnMgPSBbXTtcclxuXHJcbiAgX3NldFJlY2VudEFuc3dlcnMoKSB7XHJcbiAgICAvLyBJZiBjdXJyZW50bHkgaW4gdGhlIHByZXZpb3VzIGFuc3dlcnMgbW9kZSwgcmVzZXQgdGhlIGxhdGVzdFNlc3Npb25BbnN3ZXJzIFxyXG4gICAgLy8gaW1tZWRpYXRlbHkgYWZ0ZXIgc2V0dGluZyBpdCBhcyBpdCB3aWxsIGJlIHJlZmxlY3RlZCBpbiB0aGUgcHJldiBhbnN3ZXJzIFxyXG4gICAgLy8gbGlzdCBzdHJhaWdodCBhd2F5LlxyXG4gICAgaWYgKHRoaXMuY3VyclF1ZXN0aW9uTW9kZT8ubmFtZSA9PT0gXCJwcmV2QW5zXCIpIHtcclxuICAgICAgdGhpcy5jdXJyUXVlc3Rpb25Nb2RlLnNldFJlY2VudEFuc3dlcnModGhpcy4jbGF0ZXN0U2Vzc2lvbkFuc3dlcnMpO1xyXG4gICAgICB0aGlzLiNsYXRlc3RTZXNzaW9uQW5zd2VycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VyclF1ZXN0aW9uTW9kZS5zZXRSZWNlbnRBbnN3ZXJzKHRoaXMuYWxsUmVjZW50QW5zd2Vycyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gQWRkcyBuZXcgYW5zd2VyIHRvIGxhdGVzdCBzZXNzaW9uIGFuc3dlcnMuXHJcbiAgX2hhbmRsZU5ld0Fuc3dlcihhbnN3ZXJPYmopIHtcclxuICAgIHRoaXMuX3VwZGF0ZUFuc0FycmF5V2l0aEFucyh0aGlzLiNsYXRlc3RTZXNzaW9uQW5zd2VycywgYW5zd2VyT2JqKTtcclxuICAgIHN1cGVyLl9oYW5kbGVOZXdBbnN3ZXIoYW5zd2VyT2JqKTtcclxuICB9XHJcbn0iLCIvLyBDbGFtcCBudW1iZXIgYmV0d2VlbiB0d28gdmFsdWVzLlxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAobnVtLCBtaW4sIG1heCkge1xyXG4gIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChudW0sIG1pbiksIG1heCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIHBycHJ0biA9IDAuNSkge1xyXG4gIHJldHVybiBzdGFydCArICgoZW5kIC0gc3RhcnQpICogcHJwcnRuKTtcclxufVxyXG5cclxuLy8gRm9yIGludHMsIGl0IGlzIGluY2x1c2l2ZSBvZiBzdGFydCBhbmQgbm90IGluY2x1c2l2ZSBvZiBlbmQuXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kQmV0d2VlbihzdGFydCA9IDAsIGVuZCA9IDEsIGludHMgPSBmYWxzZSkge1xyXG4gIGNvbnN0IHJhbmdlID0gZW5kIC0gc3RhcnQ7XHJcbiAgY29uc3QgcmFuZEZsb2F0ID0gKE1hdGgucmFuZG9tKCkgKiByYW5nZSkgKyBzdGFydDtcclxuICByZXR1cm4gaW50cyA/IE1hdGguZmxvb3IocmFuZEZsb2F0KSA6IHJhbmRGbG9hdDtcclxufVxyXG5cclxuLy8gUHJvYmFiaWxpdHkgc2hvdWxkIGJlIGEgZGVjaW1hbCwgcmV0dXJucyB0cnVlIG9yIGZhbHNlLlxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdFJhbmRvbShwcm9iYWJpbGl0eSkge1xyXG4gIHJldHVybiAoTWF0aC5yYW5kb20oKSA8PSBwcm9iYWJpbGl0eSkgPyB0cnVlIDogZmFsc2U7XHJcbn1cclxuXHJcbi8vIFRha2VzIGEgbGlzdCBvZiBwcm9iIG9iamVjdHMgYXMgaW5wdXQgaW4gZm9ybWF0IHtuYW1lOiBuYW1lLCBwcm9iOiBwcm9ifSBhbmQgXHJcbi8vIHJldHVybnMgbmFtZSBvZiBjaG9zZW4gcHJvYk9iaiwgb3IgZmFsc2UgaWYgbm9uZSBjaG9zZW4gKGluIGNhc2UgdGhhdCBwcm9iT2JqcyBcclxuLy8gcHJvYnMgZG9udCBzdW0gdG8gMSkuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0UmFuZE11bHQoLi4ucHJvYnMpIHtcclxuICBjb25zdCBwcm9ic09ianMgPSBbXTtcclxuICBsZXQgY3VyclByb2JTdGFydCA9IDA7XHJcblxyXG4gIHByb2JzLmZvckVhY2gocHJvYiA9PiB7XHJcbiAgICBjb25zdCB0aGlzUHJvYiA9IHtcclxuICAgICAgbmFtZTogcHJvYi5uYW1lLFxyXG4gICAgICBzdGFydDogY3VyclByb2JTdGFydCxcclxuICAgICAgZW5kOiBjdXJyUHJvYlN0YXJ0ICsgcHJvYi5wcm9iXHJcbiAgICB9O1xyXG5cclxuICAgIHByb2JzT2Jqcy5wdXNoKHRoaXNQcm9iKTtcclxuXHJcbiAgICBjdXJyUHJvYlN0YXJ0ICs9IHByb2I7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGNob3NlblZhbCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgbGV0IHJldHVyblZhbCA9IGZhbHNlO1xyXG5cclxuICBwcm9ic09ianMuZm9yRWFjaChwcm9iID0+IHtcclxuICAgIGNvbnN0IGNob3NlblRoaXNQcm9iID0gcHJvYi5zdGFydCA8PSBjaG9zZW5WYWwgJiYgcHJvYi5lbmQgPiBjaG9zZW5WYWw7XHJcbiAgICBpZiAoY2hvc2VuVGhpc1Byb2IpIHtcclxuICAgICAgcmV0dXJuVmFsID0gcHJvYi5uYW1lO1xyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHJldHVyblZhbDtcclxufVxyXG5cclxuLy8gU2VhcmNoZXMgZm9yIGEgbmV3SXRlbSBpbiBhbiBhcnJheSBnaXZlbiBhbiBlbGVtQ29tcEZ1bmMgdGhhdCBkZXRlcm1pbmVzIFxyXG4vLyB3aGV0aGVyIGl0IGlzIHByZXNlbnQgb3Igbm90IChlZy4gdG8gZmluZCBiYXNlZCBvbiBxdWVzdGlvbiBJRCkuIElmIHByZXNlbnQsIFxyXG4vLyBlbGVtZW50IGluIGFycmF5IGlzIG92ZXJ3cml0dGVuIHdpdGggbmV3SXRlbSwgb3RoZXJ3aXNlIG5ld0l0ZW0gaXMgcHVzaGVkIHRvIFxyXG4vLyBlbmQgb2YgYXJyYXkuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQW5kT3ZlcndyaXRlRWxzZVB1c2goYXJyYXksIG5ld0l0ZW0sIGVsZW1Db21wRnVuYykge1xyXG4gIGNvbnN0IGZvdW5kSW5kZXggPSBhcnJheS5maW5kSW5kZXgoYXJySXRlbSA9PiBlbGVtQ29tcEZ1bmMoYXJySXRlbSwgbmV3SXRlbSkpO1xyXG5cclxuICAvLyBJZiBmb3VuZCwgb3ZlcndyaXRlLlxyXG4gIGlmIChmb3VuZEluZGV4ID4gLTEpIHtcclxuICAgIGFycmF5LnNwbGljZShmb3VuZEluZGV4LCAxLCBuZXdJdGVtKTtcclxuICB9XHJcbiAgLy8gT3RoZXJ3aXNlIGFkZC5cclxuICBlbHNlIHtcclxuICAgIGFycmF5LnB1c2gobmV3SXRlbSk7XHJcbiAgfTtcclxufVxyXG5cclxuLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRyYW5zaXRpb24gb24gZ2l2ZW4gZWxlbWVudCBlbmRzLCBcclxuLy8gb3B0aW9uYWwgdHJhbnNpdGlvbiBwcm9wZXJ0eSBuYW1lIGNoZWNrLlxyXG5leHBvcnQgZnVuY3Rpb24gYXdhaXRUcmFuc2l0aW9uKGVsZW0sIHByb3BOYW1lID0gbnVsbCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgYXN5bmMgZXZ0ID0+IHtcclxuXHJcbiAgICAgIGlmIChwcm9wTmFtZSkge1xyXG4gICAgICAgIGlmIChldnQucHJvcGVydHlOYW1lID09PSBwcm9wTmFtZSkge1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xyXG4gIH0pXHJcbn1cclxuXHJcbi8vIEZvciB0ZXN0aW5nIGxvbmcgcnVubmluZyBmdW5jdGlvbnMuXHJcbi8vIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7IC8vLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEZ1bGxRdWVzdGlvbnNQYWdlIH0gZnJvbSBcIi4uL21vZHVsZXMvcXVlc3Rpb25zL3F1ZXN0aW9uc1BhZ2Uvc3ViLWNsYXNzZXMvZnVsbFF1ZXN0aW9uc1BhZ2UubWpzXCI7XHJcbmltcG9ydCB7IEF1dG9Nb2RlIH0gZnJvbSBcIi4uL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9zdWItY2xhc3Nlcy9xTW9kZVdpdGhRdWV1ZUlucHV0L3N1Yi1jbGFzc2VzL2F1dG9Nb2RlLm1qc1wiO1xyXG5pbXBvcnQgeyBTZWFyY2hNb2RlIH0gZnJvbSBcIi4uL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9zdWItY2xhc3Nlcy9xTW9kZVdpdGhRdWV1ZUlucHV0L3N1Yi1jbGFzc2VzL3NlYXJjaE1vZGUubWpzXCI7XHJcbmltcG9ydCB7IFByZXZBbnN3ZXJNb2RlIH0gZnJvbSBcIi4uL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9zdWItY2xhc3Nlcy9zaW5nbGVBbnN3ZXJNb2RlL3N1Yi1jbGFzc2VzL3ByZXZBbnN3ZXJNb2RlLm1qc1wiO1xyXG5pbXBvcnQgeyBQcmV2aW91c0Fuc3dlcnMgfSBmcm9tIFwiLi4vbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xU291cmNlL3N1Yi1jbGFzc2VzL3ByZXZpb3VzQW5zd2Vycy5tanNcIjtcclxuaW1wb3J0IFwiLi9sb2dnZWRJblBhZ2UuanNcIjtcclxuXHJcblxyXG5cclxuLy8gQ3VycmVudCBjYXRlZ29yeSBpbmZvLlxyXG5jb25zdCBtYWluSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWhlYWRlclwiKTtcclxuY29uc3QgY2F0ZWdvcnlUeXBlTmFtZSA9IG1haW5IZWFkZXIuZGF0YXNldC5jYXRUeXBlO1xyXG5jb25zdCBjYXRlZ29yeU5hbWUgPSBtYWluSGVhZGVyLmRhdGFzZXQuY2F0O1xyXG5cclxuLy8gUXVlc3Rpb24gbW9kZSBkaXZzLlxyXG5jb25zdCBhdXRvUU1vZGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmF1dG8tbW9kZVwiKTtcclxuY29uc3Qgc2VhcmNoUU1vZGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlYXJjaC1tb2RlXCIpO1xyXG5jb25zdCBzaW5nbGVBbnN3ZXJRTW9kZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2luZ2xlLWFuc3dlci1tb2RlXCIpO1xyXG5cclxuLy8gUHJldmlvdXMgYW5zd2Vycy5cclxuY29uc3QgcHJldkFuc3dlcnNMaXN0RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcmV2LWFuc3dlcnMtbGlzdFwiKTtcclxuY29uc3QgcHJldkFuc3dlcnNMaXN0ID0gbmV3IFByZXZpb3VzQW5zd2VycyhwcmV2QW5zd2Vyc0xpc3REaXYsIFxyXG4gIGNhdGVnb3J5VHlwZU5hbWUsIGNhdGVnb3J5TmFtZSk7XHJcblxyXG4gIC8vIFF1ZXN0aW9uIG1vZGUgYnV0dG9ucy5cclxuY29uc3QgYXV0b01vZGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmF1dG8tcXVldWUtbW9kZS1idG5cIik7XHJcbmNvbnN0IHNlYXJjaE1vZGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlYXJjaC1tb2RlLWJ0blwiKTtcclxuY29uc3QgcHJldkFuc3dlcnNNb2RlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcmV2LWFuc3dlcnMtbW9kZS1idG5cIik7XHJcblxyXG4vLyBDcmVhdGUgdGhlIHF1ZXN0aW9uIG1vZGVzLlxyXG5jb25zdCBhdXRvUU1vZGUgPSBuZXcgQXV0b01vZGUoYXV0b1FNb2RlRGl2LCBjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGF1dG9Nb2RlQnRuKTtcclxuY29uc3Qgc2VhcmNoUU1vZGUgPSBuZXcgU2VhcmNoTW9kZShzZWFyY2hRTW9kZURpdiwgY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lLCBzZWFyY2hNb2RlQnRuKTtcclxuY29uc3QgcHJldkFuc3dlclFNb2RlID0gbmV3IFByZXZBbnN3ZXJNb2RlKHNpbmdsZUFuc3dlclFNb2RlRGl2LCBcclxuICBwcmV2QW5zd2Vyc0xpc3QsIGNhdGVnb3J5VHlwZU5hbWUsIGNhdGVnb3J5TmFtZSwgcHJldkFuc3dlcnNNb2RlQnRuKTtcclxuXHJcbmNvbnN0IGFsbFFNb2RlcyA9IFthdXRvUU1vZGUsIHNlYXJjaFFNb2RlLCBwcmV2QW5zd2VyUU1vZGVdO1xyXG5cclxuLy8gQ3JlYXRlIHRoZSBxdWVzdGlvbnMgbW9kZSBzd2l0Y2hlci5cclxuY29uc3QgcU1vZGVTd2l0Y2hlciA9IFtcclxuICB7bW9kZTogYXV0b1FNb2RlLCBidG46IGF1dG9Nb2RlQnRufSxcclxuICB7bW9kZTogc2VhcmNoUU1vZGUsIGJ0bjogc2VhcmNoTW9kZUJ0bn0sXHJcbiAge21vZGU6IHByZXZBbnN3ZXJRTW9kZSwgYnRuOiBwcmV2QW5zd2Vyc01vZGVCdG59XHJcbl07XHJcblxyXG4vLyBDcmVhdGUgdGhlIHF1ZXN0aW9ucyBwYWdlLlxyXG5jb25zdCBxdWVzdGlvbnNQYWdlID0gbmV3IEZ1bGxRdWVzdGlvbnNQYWdlKGFsbFFNb2RlcywgcU1vZGVTd2l0Y2hlciwgXHJcbiAgY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lKTtcclxuXHJcbnF1ZXN0aW9uc1BhZ2UuaW5pdCgpO1xyXG5cclxuLy8gT24gcGFnZSBsb2FkLCB1cGRhdGUgdGhlIHF1ZXN0aW9ucyBxdWV1ZSBhbmQgc2hvdyB0aGUgZmlyc3QgcXVlc3Rpb24uXHJcbndpbmRvdy5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XHJcbiAgYXdhaXQgcXVlc3Rpb25zUGFnZS5zZXRRTW9kZShhdXRvUU1vZGUpO1xyXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9