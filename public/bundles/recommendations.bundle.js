/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/categoryCheckboxes.mjs":
/*!***********************************************!*\
  !*** ./src/js/modules/categoryCheckboxes.mjs ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CategoryCheckboxes": () => (/* binding */ CategoryCheckboxes)
/* harmony export */ });
/* harmony import */ var _sharedJs_categoryInfo_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../sharedJs/categoryInfo.mjs */ "./src/sharedJs/categoryInfo.mjs");




// Objects to represent checkbox selection checkboxes for all categories / 
// category types.
class CategoryCheckboxes {
    #checkboxes;
    categoryInfo;

    constructor(categoryCheckboxes) {
        this.#checkboxes = categoryCheckboxes;
    }
    
    // Given an array of checkbox DOM objects, returns a CategoryInfo object
    // containing information on all selected checkboxes.
    getSelectedCategoryInfo() {
        let selectedCategoryInfo = new _sharedJs_categoryInfo_mjs__WEBPACK_IMPORTED_MODULE_0__.CategoryInfo();
      
        this.#checkboxes.forEach(function(checkbox){
          if (checkbox.checked) {
            const catTypeAndCat = checkbox.getAttribute("name").split(".");
            selectedCategoryInfo.checkAndAddCategoryWithType(catTypeAndCat[0],
              catTypeAndCat[1]);
          };
        });
        
        this.categoryInfo = selectedCategoryInfo;
        return this.categoryInfo;
    }

    getNumSelected() {
      const checkBoxesArr = Array.from(this.#checkboxes);
      return checkBoxesArr.reduce((tot, curr) => (tot + curr.checked), 0);
    }
}

/***/ }),

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

/***/ "./src/js/modules/kindredRecsMixin.mjs":
/*!*********************************************!*\
  !*** ./src/js/modules/kindredRecsMixin.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "kindredRecsMixin": () => (/* binding */ kindredRecsMixin)
/* harmony export */ });
/* harmony import */ var _fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fadeTransitions.mjs */ "./src/js/modules/fadeTransitions.mjs");




// Used by the recommendations and find kindred pages to fade between loaders 
// and new content when refreshing recommendations / kindred.
const kindredRecsMixin = {
  _rebuildContentDiv(data) {
    this._clearContentDiv();
    this._buildContentDiv(data);
  },

  // Clear the content in the list div.
  _clearContentDiv() {
    this._contentDiv.replaceChildren();
  },

  _showLoader() {
    return (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fadeFromTo)(this._contentDiv, this._loader);
  },

  _hideLoader() {
    return (0,_fadeTransitions_mjs__WEBPACK_IMPORTED_MODULE_0__.fadeFromTo)(this._loader, this._contentDiv);
  },

  async handleUpdateBtnClick() {
    const loaderShown = this._showLoader();
    const data = await this._getUpdatedSourceData();

    // Don't hide the loader / show the content until both the loader has 
    // finished fading in AND the doStuff has been completed.
    await loaderShown;
    this._rebuildContentDiv(data);
    this._hideLoader();
  },

  // Validates and then handles the request to update, otherwise alerts with 
  // the validation message.
  validateHandleUpdate(scrollElem, failValidateMsg) {
    const isValidSelections = this._validateSelections();
    
    if (isValidSelections) {
      scrollElem.scrollIntoView({behavior: "smooth"});
      this.handleUpdateBtnClick();
    }
    else {
      alert(failValidateMsg);
    };
  }
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

/***/ "./src/js/modules/questions/components/qSource/sub-classes/recsQSource.mjs":
/*!*********************************************************************************!*\
  !*** ./src/js/modules/questions/components/qSource/sub-classes/recsQSource.mjs ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RecsQSource": () => (/* binding */ RecsQSource)
/* harmony export */ });
/* harmony import */ var _singleModeQSource_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../singleModeQSource.mjs */ "./src/js/modules/questions/components/qSource/singleModeQSource.mjs");
/* harmony import */ var _categoryCheckboxes_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../categoryCheckboxes.mjs */ "./src/js/modules/categoryCheckboxes.mjs");
/* harmony import */ var _kindredRecsMixin_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../kindredRecsMixin.mjs */ "./src/js/modules/kindredRecsMixin.mjs");






class RecsQSource extends _singleModeQSource_mjs__WEBPACK_IMPORTED_MODULE_0__.SingleModeQSource {
  // Stores the DOM row for the question that is currently being answered.
  #currQRow = null;
  #recForCategoryCheckboxes;
  #basedOnCategoryCheckboxes;
  #getRecsBtn;
  _loader;
  _qDivClass = "rec-item";

  static #INVALID_SELECTS_MSG = `At least one category must be selected from each of the "Recommend for" and "Based on" groups.`;
  static #NO_KINDRED_MSG = ["You're one of a kind!", "We couldn't find anyone similar enough to you for the selected categories. Try a different selection or answer more questions."];
  static #KINDRED_NO_RECS_MSG = ["No recommendations!", "Your Kindred spirits for the categories selected have nothing to recommend you that you haven't rated already! Try a different selection."];

  constructor(listDiv) {
    super(listDiv);

    this._loader = listDiv.querySelector(".loader");

    const recsForDiv = document.querySelector(".recommendations-for");
    const basedOnDiv = document.querySelector(".based-on");
    const recForCheckboxesArr = recsForDiv.querySelectorAll(".category-checkbox");
    const basedOnCheckboxesArr = basedOnDiv.querySelectorAll(".category-checkbox");
    
    this.#recForCategoryCheckboxes = new _categoryCheckboxes_mjs__WEBPACK_IMPORTED_MODULE_1__.CategoryCheckboxes(recForCheckboxesArr);
    this.#basedOnCategoryCheckboxes = new _categoryCheckboxes_mjs__WEBPACK_IMPORTED_MODULE_1__.CategoryCheckboxes(basedOnCheckboxesArr);

    this.#getRecsBtn = document.querySelector(".get-recs-btn");

    this.#getRecsBtn.addEventListener("click", () => {
      this.validateHandleUpdate(this._listDiv, RecsQSource.#INVALID_SELECTS_MSG);
    });
  }

  // Builds the content div with all the questions.
  _buildContentDiv(recsInfo) {
    if (recsInfo.numKindred > 0) {
      if (recsInfo.recommendList.length > 0) {
        super._buildContentDiv(recsInfo.recommendList);
      }
      else {
        this.#setNoRecsMsg(RecsQSource.#KINDRED_NO_RECS_MSG);
      };
    }
    else {
      this.#setNoRecsMsg(RecsQSource.#NO_KINDRED_MSG);
    };
  }

  // Sets a message in the recommendations list for why no recommendations were found.
  #setNoRecsMsg(msgInfo) {
    const noRecsMsgDiv = document.createElement("div");
    const noRecsHeader = document.createElement("h5");
    const noRecsTxt = document.createElement("p");

    noRecsHeader.innerText = msgInfo[0];
    noRecsTxt.innerText = msgInfo[1];
    
    noRecsMsgDiv.appendChild(noRecsHeader);
    noRecsMsgDiv.appendChild(noRecsTxt);

    noRecsMsgDiv.classList.add("no-recs-msg");
    this._contentDiv.appendChild(noRecsMsgDiv);
  }

  // Ensure at least one checkbox is selected for Rec for and Based on Groups.
  _validateSelections() {
    const numBasedOnCats = this.#recForCategoryCheckboxes.getNumSelected();
    const numRecCats = this.#basedOnCategoryCheckboxes.getNumSelected();
    const isValidSelections = (numBasedOnCats > 0) && (numRecCats > 0);
    return isValidSelections;
  }

  _addToQDiv(qInfo) {
    qInfo.qSourceItem.appendChild(qInfo.qText);
    qInfo.qSourceItem.insertBefore(qInfo.qScore, qInfo.qSourceItem.children[0]);

    const catTypeText = document.createElement("p");
    const catText = document.createElement("p");

    catTypeText.classList.add("rec-cat-type");
    catText.classList.add("rec-cat");

    [catTypeText.innerText, catText.innerText] = [qInfo.catTypeName, qInfo.catName];

    qInfo.qSourceItem.appendChild(catTypeText);
    qInfo.qSourceItem.appendChild(catText);

    return qInfo.qSourceItem;
  }

  // Get the latest recommendations from the back end.
  async getRecs() {
    const recForCategoryInfo = this.#recForCategoryCheckboxes.getSelectedCategoryInfo();
    const basedOnCategoryInfo = this.#basedOnCategoryCheckboxes.getSelectedCategoryInfo();

    const allCategoryInfo = {
      recommendationsFor: recForCategoryInfo,
      basedOn: basedOnCategoryInfo
    };

    const fetchResponse = await fetch("/recommendations", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(allCategoryInfo)
    });
    
    const recommendsInfo = await fetchResponse.json();
    return recommendsInfo;
  }

  // Set the currQRow to the question that is now being rated, so it can be 
  // easily removed once answered.
  _handleRateBtnClick(evt, question) {
    this.#currQRow  = evt.currentTarget.parentNode.parentNode;
    super._handleRateBtnClick(evt, question);
  }

  // Remove the newly answered question from the recommendations list.
  removeAnsweredQ() {
    this._contentDiv.removeChild(this.#currQRow);
  }

  _getScoreText(rec) {
    return rec.rating.strength.toFixed(1);
  }
  
  // POSTS any new answers then gets the latest recommendations.
  async #getLatestRecs() {
    this.dispatchEvent(new CustomEvent(`getRecsClick`));

    // Wait for post answers to complete before refreshing recommendations.
    await new Promise(resolve => {
      this.addEventListener('postAnswersComplete', resolve(), {once: true});
    });

    const latestRecsInfo = await this.getRecs();
    return latestRecsInfo;
  }

  // Used by the mixin to get latest recommendations.
  async _getUpdatedSourceData() {
    return await this.#getLatestRecs();
  }
  
  _getHoverText() {
    return "Rate it!";
  }
}

Object.assign(RecsQSource.prototype, _kindredRecsMixin_mjs__WEBPACK_IMPORTED_MODULE_2__.kindredRecsMixin);

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

/***/ "./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/recommendationsMode.mjs":
/*!****************************************************************************************************************************!*\
  !*** ./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/recommendationsMode.mjs ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RecommendationsMode": () => (/* binding */ RecommendationsMode)
/* harmony export */ });
/* harmony import */ var _singleAnswerMode_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../singleAnswerMode.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/singleAnswerMode.mjs");




class RecommendationsMode extends _singleAnswerMode_mjs__WEBPACK_IMPORTED_MODULE_0__.SingleAnswerMode {
  name = "recs";

  // Also remove the answered question from the recommendations list.
  answerQuestion(event) {
    const thisAns = super.answerQuestion(event);

    // Remove this answered question from the recommendations list, if user 
    // didn't skip it.
    if (!thisAns.skip) {
      this._qSource.removeAnsweredQ();
    };
  }

  // Makes a question, ready to be shown in the answerUiPanel, from the clicked 
  // on question.
  _makeQuestion(qItem) {
    const thisQ = {
      _id: qItem.questionId,
      categoryTypeName: qItem.categoryType,
      categoryName: qItem.category
    };

    for (let prop in qItem.questionDetails) {
      thisQ[prop] = qItem.questionDetails[prop]
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

/***/ "./src/js/modules/questions/questionsPage/sub-classes/recsQuestionsPage.mjs":
/*!**********************************************************************************!*\
  !*** ./src/js/modules/questions/questionsPage/sub-classes/recsQuestionsPage.mjs ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RecsQuestionsPage": () => (/* binding */ RecsQuestionsPage)
/* harmony export */ });
/* harmony import */ var _questionsPage_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../questionsPage.mjs */ "./src/js/modules/questions/questionsPage/questionsPage.mjs");




class RecsQuestionsPage extends _questionsPage_mjs__WEBPACK_IMPORTED_MODULE_0__.QuestionsPage {
  
  setQMode(newQMode) {
    super.setQMode(newQMode);

    this.currQuestionMode._qSource.addEventListener(`getRecsClick`, async () => {
      this._postAnswers();
    });
  }

  // Dispatch event to the q source so that it knows it can then refresh the 
  // recommendations.
  async _postAnswers(isChangeOfPage = false) {
    super._postAnswers(isChangeOfPage);
    this.currQuestionMode._qSource.dispatchEvent(new CustomEvent(`postAnswersComplete`));
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

/***/ "./src/sharedJs/categoryInfo.mjs":
/*!***************************************!*\
  !*** ./src/sharedJs/categoryInfo.mjs ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CategoryInfo": () => (/* binding */ CategoryInfo)
/* harmony export */ });
// Class to store category type and category info in a tree structure of nested
// objects for all categories present.
class CategoryInfo {
  catTypes = {};

  // Where catInfo is an optional category info style object (just the data, not 
  // an actual instance of this class - from when stringified and sent using fetch).
  // dbCatTypes is a list of categoryType documents as returned from doing find 
  // of category types in DB.
  constructor(catInfo = null, dbCatTypes = null) {
    if (catInfo) {
      this.catTypes = catInfo.catTypes;
    };

    if (dbCatTypes) {
      this.#constructFromCatTypes(dbCatTypes);
    };
  }

  // Construct this category info based on a given array of category types and 
  // their nested categories (as a result of a dib find on category types).
  #constructFromCatTypes(dbCatTypes) {
    for (let catType of dbCatTypes) {
      for (let cat of catType.categories) {
        const isRecData = {isRecommendable: cat.isRecommendable};
        this.checkAndAddCategoryWithType(catType.name, cat.name, isRecData);
      };
    };
  }

  // Given a category type and category, adds both, just the category, or
  // neither of them depending on what already exists in this.
  // data should be an object and all the key: value pairs from data will be
  // added in to the CategoryInfo object at the correct place.
  checkAndAddCategoryWithType(categoryTypeName, categoryName, data = null) {
    const catOrTypeExists = this._doesCategoryOrTypeExist(categoryTypeName, categoryName);
    if (catOrTypeExists === "nor"){
      this._addTypeAndCategory(categoryTypeName, categoryName, data);
    }
    else if (catOrTypeExists === "typeOnly"){
      this._addCategory(categoryTypeName, categoryName, data);
    };
  }

  // Creates a clone of this category info object and returns it, along with new 
  // data for each category which is calculated using the higher order getDataFunc and args.
  cloneWithData(getDataFunc, args) {
    const newCatInfo = new CategoryInfo();

    const allCategoriesWithTypes = this.getAllCategories();

    for (let categoryWithType of allCategoriesWithTypes) {
      const catTypeName = categoryWithType.categoryType;
      const categoryName = categoryWithType.category;
      const data = getDataFunc(catTypeName, categoryName, args);

      newCatInfo.checkAndAddCategoryWithType(catTypeName, categoryName, data);
    };

    return newCatInfo;
  }

  // Returns an array of objects where each object contains the
  // categoryTypeName and categoryName, for every unique category in this.
  getAllCategories(inclData = false) {
    const allUniqueCategories = [];

    for (let catType in this.catTypes) {
      for (let category in this.catTypes[catType]?.categories) {
        const thisCatAndType = {
          categoryType: catType,
          category: category
        };

        if (inclData) {
          const catData = this.catTypes[catType].categories[category];
          for (let key in catData) {
            thisCatAndType[key] = catData[key];
          };
        };

        allUniqueCategories.push(thisCatAndType);
      };
    };

    return allUniqueCategories;
  }

  // Returns "typeAndCat" if categoryType and category exists in the tree, "typeOnly" if only
  // the categoryType exists and "nor" if neither the category nor the categoryType exists.
  _doesCategoryOrTypeExist(categoryTypeName, categoryName){
    if (!(categoryTypeName in this.catTypes)) {
      return "nor";
    }
    else if (!(categoryName in (this.catTypes.categoryTypeName?.categories ?? []))) {
      return "typeOnly";
    }
    else {
      return "typeAndCat";
    };
  }

  _addTypeAndCategory(categoryTypeName, categoryName, data){
    this.catTypes[categoryTypeName] = {
      categories: {}
    };
    this._addCategory(categoryTypeName, categoryName, data);
  }

  _addCategory(categoryTypeName, categoryName, data){
    this.catTypes[categoryTypeName].categories[categoryName] = null;
    if (data) {
      this._setData(categoryTypeName, categoryName, data);
    };
  }

  _setData(categoryTypeName, categoryName, data) {
    this.catTypes[categoryTypeName].categories[categoryName] = {};
    for (let key in data) {
      this.catTypes[categoryTypeName].categories[categoryName][key] = data[key];
    };
  }
}

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
/*!*****************************************!*\
  !*** ./src/js/pages/recommendations.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_questions_components_questionsMode_sub_classes_singleAnswerMode_sub_classes_recommendationsMode_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/recommendationsMode.mjs */ "./src/js/modules/questions/components/questionsMode/sub-classes/singleAnswerMode/sub-classes/recommendationsMode.mjs");
/* harmony import */ var _modules_questions_components_qSource_sub_classes_recsQSource_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/questions/components/qSource/sub-classes/recsQSource.mjs */ "./src/js/modules/questions/components/qSource/sub-classes/recsQSource.mjs");
/* harmony import */ var _modules_questions_questionsPage_sub_classes_recsQuestionsPage_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/questions/questionsPage/sub-classes/recsQuestionsPage.mjs */ "./src/js/modules/questions/questionsPage/sub-classes/recsQuestionsPage.mjs");
/* harmony import */ var _loggedInPage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loggedInPage.js */ "./src/js/pages/loggedInPage.js");







const singleAnswerQModeDiv = document.querySelector(".single-answer-mode");

const recommendationsListDiv = document.querySelector(".recommendations-list");
const recommendationsList = new _modules_questions_components_qSource_sub_classes_recsQSource_mjs__WEBPACK_IMPORTED_MODULE_1__.RecsQSource(recommendationsListDiv);

const recommendationsMode = new _modules_questions_components_questionsMode_sub_classes_singleAnswerMode_sub_classes_recommendationsMode_mjs__WEBPACK_IMPORTED_MODULE_0__.RecommendationsMode(singleAnswerQModeDiv, 
  recommendationsList);

// Create the questions page.
const questionsPage = new _modules_questions_questionsPage_sub_classes_recsQuestionsPage_mjs__WEBPACK_IMPORTED_MODULE_2__.RecsQuestionsPage([recommendationsMode]);

questionsPage.init();

// On page load, update the questions queue and show the first question.
window.onload = async () => {
  await questionsPage.setQMode(recommendationsMode);
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxSEE7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELHdCQUF3QjtBQUM1RTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxHQUFHLFdBQVc7QUFDbkIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLDREQUE0RDs7Ozs7O1VDaEc1RDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnFKO0FBQ25EO0FBQ087QUFDOUU7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDBHQUFXO0FBQzNDO0FBQ0EsZ0NBQWdDLDZKQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsaUhBQWlCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvY2F0ZWdvcnlDaGVja2JveGVzLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvY2VudHJlTW9kYWwubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9mYWRlVHJhbnNpdGlvbnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9raW5kcmVkUmVjc01peGluLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcG9wQnRucy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3FTb3VyY2Uvc2luZ2xlTW9kZVFTb3VyY2UubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xU291cmNlL3N1Yi1jbGFzc2VzL3JlY3NRU291cmNlLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9jb21wb25lbnRzL2Fuc3dlclVpUGFuZWwubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL2NvbXBvbmVudHMvYmFzZVF1ZXN0aW9uc1F1ZXVlL2Jhc2VRdWVzdGlvbnNRdWV1ZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9iYXNlUXVlc3Rpb25zUXVldWUvY29tcG9uZW50cy9kb21RdWV1ZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9iYXNlUXVlc3Rpb25zUXVldWUvY29tcG9uZW50cy9zaW5nbGVEb21RdWV1ZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvY29tcG9uZW50cy9iYXNlUXVlc3Rpb25zUXVldWUvc3ViLWNsYXNzZXMvc2luZ2xlUXVlc3Rpb25RdWV1ZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvcXVlc3Rpb25zTW9kZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9jb21wb25lbnRzL3F1ZXN0aW9uc01vZGUvc3ViLWNsYXNzZXMvcU1vZGVXaXRoUXVldWVJbnB1dC9xTW9kZVdpdGhRdWV1ZUlucHV0Lm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9zdWItY2xhc3Nlcy9zaW5nbGVBbnN3ZXJNb2RlL3NpbmdsZUFuc3dlck1vZGUubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9xdWVzdGlvbnMvY29tcG9uZW50cy9xdWVzdGlvbnNNb2RlL3N1Yi1jbGFzc2VzL3NpbmdsZUFuc3dlck1vZGUvc3ViLWNsYXNzZXMvcmVjb21tZW5kYXRpb25zTW9kZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9xdWVzdGlvbnNIZWxwZXJzLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcXVlc3Rpb25zL3F1ZXN0aW9uc1BhZ2UvcXVlc3Rpb25zUGFnZS5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3F1ZXN0aW9ucy9xdWVzdGlvbnNQYWdlL3N1Yi1jbGFzc2VzL3JlY3NRdWVzdGlvbnNQYWdlLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL3NoYXJlZEpzL2NhdGVnb3J5SW5mby5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9zaGFyZWRKcy91dGlscy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvcGFnZXMvcmVjb21tZW5kYXRpb25zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhdGVnb3J5SW5mbyB9IGZyb20gXCIuLi8uLi9zaGFyZWRKcy9jYXRlZ29yeUluZm8ubWpzXCI7XHJcblxyXG5cclxuXHJcbi8vIE9iamVjdHMgdG8gcmVwcmVzZW50IGNoZWNrYm94IHNlbGVjdGlvbiBjaGVja2JveGVzIGZvciBhbGwgY2F0ZWdvcmllcyAvIFxyXG4vLyBjYXRlZ29yeSB0eXBlcy5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5Q2hlY2tib3hlcyB7XHJcbiAgICAjY2hlY2tib3hlcztcclxuICAgIGNhdGVnb3J5SW5mbztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYXRlZ29yeUNoZWNrYm94ZXMpIHtcclxuICAgICAgICB0aGlzLiNjaGVja2JveGVzID0gY2F0ZWdvcnlDaGVja2JveGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBHaXZlbiBhbiBhcnJheSBvZiBjaGVja2JveCBET00gb2JqZWN0cywgcmV0dXJucyBhIENhdGVnb3J5SW5mbyBvYmplY3RcclxuICAgIC8vIGNvbnRhaW5pbmcgaW5mb3JtYXRpb24gb24gYWxsIHNlbGVjdGVkIGNoZWNrYm94ZXMuXHJcbiAgICBnZXRTZWxlY3RlZENhdGVnb3J5SW5mbygpIHtcclxuICAgICAgICBsZXQgc2VsZWN0ZWRDYXRlZ29yeUluZm8gPSBuZXcgQ2F0ZWdvcnlJbmZvKCk7XHJcbiAgICAgIFxyXG4gICAgICAgIHRoaXMuI2NoZWNrYm94ZXMuZm9yRWFjaChmdW5jdGlvbihjaGVja2JveCl7XHJcbiAgICAgICAgICBpZiAoY2hlY2tib3guY2hlY2tlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBjYXRUeXBlQW5kQ2F0ID0gY2hlY2tib3guZ2V0QXR0cmlidXRlKFwibmFtZVwiKS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkQ2F0ZWdvcnlJbmZvLmNoZWNrQW5kQWRkQ2F0ZWdvcnlXaXRoVHlwZShjYXRUeXBlQW5kQ2F0WzBdLFxyXG4gICAgICAgICAgICAgIGNhdFR5cGVBbmRDYXRbMV0pO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNhdGVnb3J5SW5mbyA9IHNlbGVjdGVkQ2F0ZWdvcnlJbmZvO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhdGVnb3J5SW5mbztcclxuICAgIH1cclxuXHJcbiAgICBnZXROdW1TZWxlY3RlZCgpIHtcclxuICAgICAgY29uc3QgY2hlY2tCb3hlc0FyciA9IEFycmF5LmZyb20odGhpcy4jY2hlY2tib3hlcyk7XHJcbiAgICAgIHJldHVybiBjaGVja0JveGVzQXJyLnJlZHVjZSgodG90LCBjdXJyKSA9PiAodG90ICsgY3Vyci5jaGVja2VkKSwgMCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBmYWRlSW4sIGZ1bGx5RmFkZU91dCB9IGZyb20gXCIuL2ZhZGVUcmFuc2l0aW9ucy5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENlbnRyZU1vZGFsIHtcclxuICB3cmFwcGVyO1xyXG4gICNtb2RhbDtcclxuICAjY2xvc2VNb2RhbEJ0bjtcclxuXHJcbiAgY29uc3RydWN0b3Iod3JhcHBlcikge1xyXG4gICAgdGhpcy53cmFwcGVyID0gd3JhcHBlcjtcclxuICAgIHRoaXMuI21vZGFsID0gd3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmNlbnRyZS1tb2RhbFwiKTtcclxuICAgIHRoaXMuI2Nsb3NlTW9kYWxCdG4gPSB0aGlzLiNtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHVwIHRoZSBldmVudCBsaXN0ZW5lcnMuXHJcbiAgaW5pdCgpIHtcclxuICAgIGNvbnN0IGNsb3NlTW9kYWxFbGVtcyA9IFt0aGlzLiNjbG9zZU1vZGFsQnRuLCB0aGlzLndyYXBwZXJdO1xyXG5cclxuICAgIGZvciAobGV0IGNsb3NlTW9kYWxFbGVtIG9mIGNsb3NlTW9kYWxFbGVtcykge1xyXG4gICAgICBjbG9zZU1vZGFsRWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5oaWRlKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLiNtb2RhbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IGV2dC5zdG9wUHJvcGFnYXRpb24oKSk7XHJcbiAgfVxyXG5cclxuICBzaG93KCkge1xyXG4gICAgZmFkZUluKHRoaXMud3JhcHBlcik7XHJcbiAgfVxyXG5cclxuICBoaWRlKCkge1xyXG4gICAgZnVsbHlGYWRlT3V0KHRoaXMud3JhcHBlcik7XHJcbiAgfVxyXG59IiwiLy8gSGVscGVyIGZ1bmN0aW9ucyB0byBhc3Npc3Qgd2l0aCBmYWRpbmcgaW4gLyBvdXQgRE9NIGVsZW1lbnRzLlxyXG5pbXBvcnQgeyBhd2FpdFRyYW5zaXRpb24gfSBmcm9tIFwiLi4vLi4vc2hhcmVkSnMvdXRpbHMubWpzXCI7XHJcblxyXG5cclxuXHJcbi8vIEZhZGUgdHJhbnNpdGlvbiBoZWxwZXIgZnVuY3Rpb25zLCB1c2VkIHdpdGggdHJhbnNwYXJlbnQsIGZ1bGx5LWhpZGRlbiBhbmQgXHJcbi8vIGZhZGUtdHJhbnMgY3NzIGNsYXNzZXMuXHJcbi8vIE1ha2VzIGRpc3BsYXkgcHJvcGVydHkgdmlzaWJsZSBhbmQgdGhlbiByZW1vdmVzIHRyYW5zcGFyZW5jeS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVJbihlbGVtKSB7XHJcbiAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsbHktaGlkZGVuXCIpO1xyXG4gIHNldFRpbWVvdXQoKCkgPT4gZWxlbS5jbGFzc0xpc3QucmVtb3ZlKFwidHJhbnNwYXJlbnRcIiksIDEwKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmlzaEZhZGVJbihlbGVtKSB7XHJcbiAgYXdhaXQgYXdhaXRUcmFuc2l0aW9uKGVsZW0sIFwib3BhY2l0eVwiKTtcclxufVxyXG5cclxuLy8gRmluaXNoZXMgd2hlbiBmYWRlIGluIGlzIGNvbXBsZXRlZC5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZ1bGx5RmFkZUluKGVsZW0pIHtcclxuICBmYWRlSW4oZWxlbSk7XHJcbiAgYXdhaXQgZmluaXNoRmFkZUluKGVsZW0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZU91dChlbGVtKSB7XHJcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKFwidHJhbnNwYXJlbnRcIik7XHJcbn1cclxuXHJcbi8vIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIG9wYWNpdHkgdHJhbnNpdGlvbiBvbiB0aGUgXHJcbi8vIGdpdmVuIGVsZW1lbnQgaXMgY29tcGxldGVkLiBBbHNvIGZ1bGx5IGhpZGVzIHRoZSBlbGVtZW50LlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluaXNoRmFkZU91dChlbGVtKSB7XHJcbiAgYXdhaXQgYXdhaXRUcmFuc2l0aW9uKGVsZW0sIFwib3BhY2l0eVwiKTtcclxuICBlbGVtLmNsYXNzTGlzdC5hZGQoXCJmdWxseS1oaWRkZW5cIik7XHJcbn1cclxuXHJcbi8vIEZhZGUgb3V0IGFuZCBmdWxseSBoaWRlIHRoZSBnaXZlbiBlbGVtZW50LlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHlGYWRlT3V0KGVsZW0pIHtcclxuICBmYWRlT3V0KGVsZW0pO1xyXG4gIGF3YWl0IGZpbmlzaEZhZGVPdXQoZWxlbSk7XHJcbn1cclxuXHJcbi8vIEZhZGVzIG91dCBlbGVtMSBhbmQgZmFkZXMgaW4gZWxlbTIgb25jZSB0cmFuc2l0aW9uIGNvbXBsZXRlZCwgZG9lc24ndCBmaW5pc2ggXHJcbi8vIHVudGlsIGVsZW0yIGZ1bGx5IGZhZGVkIGluLiBSZXR1cm5zIHByb21pc2UuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlRnJvbVRvKGVsZW0xLCBlbGVtMikge1xyXG4gIGNvbnN0IGZhZGVDb21wbGV0ZVByb21pc2UgPSBuZXcgUHJvbWlzZShhc3luYyByZXNvbHZlID0+IHtcclxuICAgIGF3YWl0IGZ1bGx5RmFkZU91dChlbGVtMSk7XHJcbiAgICBhd2FpdCBmdWxseUZhZGVJbihlbGVtMik7XHJcbiAgICByZXNvbHZlKCk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBmYWRlQ29tcGxldGVQcm9taXNlO1xyXG59IiwiaW1wb3J0IHsgZmFkZUZyb21UbyB9IGZyb20gXCIuL2ZhZGVUcmFuc2l0aW9ucy5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gVXNlZCBieSB0aGUgcmVjb21tZW5kYXRpb25zIGFuZCBmaW5kIGtpbmRyZWQgcGFnZXMgdG8gZmFkZSBiZXR3ZWVuIGxvYWRlcnMgXHJcbi8vIGFuZCBuZXcgY29udGVudCB3aGVuIHJlZnJlc2hpbmcgcmVjb21tZW5kYXRpb25zIC8ga2luZHJlZC5cclxuZXhwb3J0IGNvbnN0IGtpbmRyZWRSZWNzTWl4aW4gPSB7XHJcbiAgX3JlYnVpbGRDb250ZW50RGl2KGRhdGEpIHtcclxuICAgIHRoaXMuX2NsZWFyQ29udGVudERpdigpO1xyXG4gICAgdGhpcy5fYnVpbGRDb250ZW50RGl2KGRhdGEpO1xyXG4gIH0sXHJcblxyXG4gIC8vIENsZWFyIHRoZSBjb250ZW50IGluIHRoZSBsaXN0IGRpdi5cclxuICBfY2xlYXJDb250ZW50RGl2KCkge1xyXG4gICAgdGhpcy5fY29udGVudERpdi5yZXBsYWNlQ2hpbGRyZW4oKTtcclxuICB9LFxyXG5cclxuICBfc2hvd0xvYWRlcigpIHtcclxuICAgIHJldHVybiBmYWRlRnJvbVRvKHRoaXMuX2NvbnRlbnREaXYsIHRoaXMuX2xvYWRlcik7XHJcbiAgfSxcclxuXHJcbiAgX2hpZGVMb2FkZXIoKSB7XHJcbiAgICByZXR1cm4gZmFkZUZyb21Ubyh0aGlzLl9sb2FkZXIsIHRoaXMuX2NvbnRlbnREaXYpO1xyXG4gIH0sXHJcblxyXG4gIGFzeW5jIGhhbmRsZVVwZGF0ZUJ0bkNsaWNrKCkge1xyXG4gICAgY29uc3QgbG9hZGVyU2hvd24gPSB0aGlzLl9zaG93TG9hZGVyKCk7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5fZ2V0VXBkYXRlZFNvdXJjZURhdGEoKTtcclxuXHJcbiAgICAvLyBEb24ndCBoaWRlIHRoZSBsb2FkZXIgLyBzaG93IHRoZSBjb250ZW50IHVudGlsIGJvdGggdGhlIGxvYWRlciBoYXMgXHJcbiAgICAvLyBmaW5pc2hlZCBmYWRpbmcgaW4gQU5EIHRoZSBkb1N0dWZmIGhhcyBiZWVuIGNvbXBsZXRlZC5cclxuICAgIGF3YWl0IGxvYWRlclNob3duO1xyXG4gICAgdGhpcy5fcmVidWlsZENvbnRlbnREaXYoZGF0YSk7XHJcbiAgICB0aGlzLl9oaWRlTG9hZGVyKCk7XHJcbiAgfSxcclxuXHJcbiAgLy8gVmFsaWRhdGVzIGFuZCB0aGVuIGhhbmRsZXMgdGhlIHJlcXVlc3QgdG8gdXBkYXRlLCBvdGhlcndpc2UgYWxlcnRzIHdpdGggXHJcbiAgLy8gdGhlIHZhbGlkYXRpb24gbWVzc2FnZS5cclxuICB2YWxpZGF0ZUhhbmRsZVVwZGF0ZShzY3JvbGxFbGVtLCBmYWlsVmFsaWRhdGVNc2cpIHtcclxuICAgIGNvbnN0IGlzVmFsaWRTZWxlY3Rpb25zID0gdGhpcy5fdmFsaWRhdGVTZWxlY3Rpb25zKCk7XHJcbiAgICBcclxuICAgIGlmIChpc1ZhbGlkU2VsZWN0aW9ucykge1xyXG4gICAgICBzY3JvbGxFbGVtLnNjcm9sbEludG9WaWV3KHtiZWhhdmlvcjogXCJzbW9vdGhcIn0pO1xyXG4gICAgICB0aGlzLmhhbmRsZVVwZGF0ZUJ0bkNsaWNrKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgYWxlcnQoZmFpbFZhbGlkYXRlTXNnKTtcclxuICAgIH07XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgZnVsbHlGYWRlSW4sIGZ1bGx5RmFkZU91dCB9IGZyb20gXCIuL2ZhZGVUcmFuc2l0aW9ucy5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gQnRuIHdpdGggYXNzb2NpYXRlZCBjb250ZW50LiBDb250ZW50IGZhZGVzIGluIHdoZW4gYnV0dG9uIGlzIGNsaWNrZWQgYW5kIFxyXG4vLyBmYWRlcyBvdXQgd2hlbiBhbnl0aGluZyBpcyBjbGlja2VkLiBVc2VkIGJ5IGluZm8gYnV0dG9ucyBhbmQgbmF2IGRyb3Bkb3duLlxyXG5jbGFzcyBQb3BCdG4ge1xyXG4gICNidG47XHJcbiAgI2NvbnRlbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBvcEJ0bkNvbnRhaW5lcikge1xyXG4gICAgdGhpcy4jYnRuID0gcG9wQnRuQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIucG9wLWJ0blwiKTtcclxuICAgIHRoaXMuI2NvbnRlbnQgPSBwb3BCdG5Db250YWluZXIucXVlcnlTZWxlY3RvcihcIi5wb3AtYnRuLWNvbnRlbnRcIik7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy4jc2V0dXBJbmZvQnRuQ2xpY2sodGhpcy4jYnRuLCB0aGlzLiNjb250ZW50KTtcclxuICB9XHJcblxyXG4gICNzZXR1cEluZm9CdG5DbGljayhidG4sIGNvbnRlbnQpIHtcclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLiNoYW5kbGVJbmZvQnRuQ2xpY2soYnRuLCBjb250ZW50KTtcclxuICAgIH0sIHtvbmNlOiB0cnVlfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyAjaGFuZGxlSW5mb0J0bkNsaWNrKGJ0biwgY29udGVudCkge1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlSW4oY29udGVudCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgZnVsbHlGYWRlT3V0KGNvbnRlbnQpO1xyXG4gICAgICB0aGlzLiNzZXR1cEluZm9CdG5DbGljayhidG4sIGNvbnRlbnQpO1xyXG4gICAgfSwge29uY2U6IHRydWV9KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIEluaXRzIGFsbCBwb3AgYnRucyBvbiBhIHBhZ2UuXHJcbmZ1bmN0aW9uIHNldHVwUG9wQnRucygpIHtcclxuICBjb25zdCBwb3BCdG5Db250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3AtYnRuLWNvbnRhaW5lclwiKTtcclxuICBcclxuICBwb3BCdG5Db250YWluZXJzLmZvckVhY2gocG9wQnRuQ29udGFpbmVyID0+IHtcclxuICAgIGNvbnN0IHBvcEJ0biA9IG5ldyBQb3BCdG4ocG9wQnRuQ29udGFpbmVyKTtcclxuICAgIHBvcEJ0bi5pbml0KCk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbnNldHVwUG9wQnRucygpOyIsImltcG9ydCB7IGNyZWF0ZVFEb21JdGVtLCBnZXRRQ2F0ZWdvcnksIGdldFFJbmZvIH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uc0hlbHBlcnMubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTaW5nbGVNb2RlUVNvdXJjZSBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcclxuICBfbGlzdERpdjtcclxuICBfY29udGVudERpdjtcclxuICBfcURpdkNsYXNzO1xyXG5cclxuICBjb25zdHJ1Y3RvcihsaXN0RGl2KSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5fbGlzdERpdiA9IGxpc3REaXY7XHJcbiAgICB0aGlzLl9jb250ZW50RGl2ID0gbGlzdERpdi5xdWVyeVNlbGVjdG9yKFwiLmNvbnRlbnRcIik7XHJcbiAgfVxyXG5cclxuICAvLyBDcmVhdGUgYSBkaXYgd2l0aCBpbmZvcm1hdGlvbiBmb3IgYSBxdWVzdGlvbiBpdGVtLlxyXG4gIF9jcmVhdGVRRGl2KHEpIHtcclxuICAgIGNvbnN0IFtjYXRUeXBlTmFtZSwgY2F0TmFtZV0gPSBnZXRRQ2F0ZWdvcnkocSwgdGhpcy5fY2F0ZWdvcnlUeXBlTmFtZSwgXHJcbiAgICAgIHRoaXMuX2NhdGVnb3J5TmFtZSk7XHJcblxyXG4gICAgY29uc3QgcVNvdXJjZUl0ZW0gPSBjcmVhdGVRRG9tSXRlbShxLnF1ZXN0aW9uRGV0YWlscywgY2F0VHlwZU5hbWUsIFxyXG4gICAgICBjYXROYW1lKTtcclxuICAgIFxyXG4gICAgcVNvdXJjZUl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLl9xRGl2Q2xhc3MpO1xyXG5cclxuICAgIGNvbnN0IHFUZXh0ID0gdGhpcy5fY3JlYXRlUVRleHRFbGVtKHEsIGNhdFR5cGVOYW1lLCBjYXROYW1lKTtcclxuICAgIGNvbnN0IHFTY29yZSA9IHRoaXMuX2NyZWF0ZXRRU2NvcmVFbGVtKHEpO1xyXG4gICAgdGhpcy5fc2V0dXBRSW1nKHEsIHFTb3VyY2VJdGVtKTtcclxuXHJcbiAgICBjb25zdCBxSW5mbyA9IHtcclxuICAgICAgcVNvdXJjZUl0ZW06IHFTb3VyY2VJdGVtLFxyXG4gICAgICBxVGV4dDogcVRleHQsXHJcbiAgICAgIHFTY29yZTogcVNjb3JlLFxyXG4gICAgICBjYXRUeXBlTmFtZTogY2F0VHlwZU5hbWUsXHJcbiAgICAgIGNhdE5hbWU6IGNhdE5hbWVcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fYWRkVG9RRGl2KHFJbmZvKTtcclxuICAgIHJldHVybiBxU291cmNlSXRlbTtcclxuICB9XHJcblxyXG4gIF9oYW5kbGVSYXRlQnRuQ2xpY2soZXZ0LCBxdWVzdGlvbikge1xyXG4gICAgdGhpcy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJhbnN3ZXJTaW5nbGVRXCIsIHtkZXRhaWw6IHtxdWVzdGlvbjogcXVlc3Rpb259fSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvLyBCdWlsZHMgdGhlIGNvbnRlbnQgZGl2IHdpdGggYWxsIHRoZSBxdWVzdGlvbnMuXHJcbiAgX2J1aWxkQ29udGVudERpdihxdWVzdGlvbnMpIHtcclxuICAgIGZvciAobGV0IHF1ZXN0aW9uIG9mIHF1ZXN0aW9ucykge1xyXG4gICAgICBjb25zdCBxU291cmNlSXRlbSA9IHRoaXMuX2NyZWF0ZVFEaXYocXVlc3Rpb24pO1xyXG4gICAgICB0aGlzLl9jb250ZW50RGl2LmFwcGVuZENoaWxkKHFTb3VyY2VJdGVtKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBfY3JlYXRlUVRleHRFbGVtKHEsIGNhdFR5cGVOYW1lLCBjYXROYW1lKSB7XHJcbiAgICBjb25zdCBxVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG5cclxuICAgIHFUZXh0LmlubmVyVGV4dCA9IGdldFFJbmZvKHEucXVlc3Rpb25EZXRhaWxzLCBcInFTb3VyY2VEaXNwbGF5VGV4dFwiLCBcclxuICAgICAgY2F0VHlwZU5hbWUsIGNhdE5hbWUpO1xyXG4gICAgXHJcbiAgICBxVGV4dC5jbGFzc0xpc3QuYWRkKFwicS10ZXh0XCIpO1xyXG4gICAgcmV0dXJuIHFUZXh0O1xyXG4gIH1cclxuXHJcbiAgX2NyZWF0ZXRRU2NvcmVFbGVtKHEpIHtcclxuICAgIGNvbnN0IHFTY29yZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgcVNjb3JlLmlubmVyVGV4dCA9IHRoaXMuX2dldFNjb3JlVGV4dChxKTtcclxuICAgIHFTY29yZS5jbGFzc0xpc3QuYWRkKFwidXNlci1zY29yZVwiKTtcclxuICAgIHJldHVybiBxU2NvcmU7XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgZm9yIGNsaWNrIHRvIHRoZSBpbWFnZSAvIHBsYWNlaG9sZGVyIGltYWdlLlxyXG4gIC8vIEFsc28gY3JlYXRlIGFuZCBhZGQgaG92ZXIgZWZmZWN0IGRpdi5cclxuICBfc2V0dXBRSW1nKHEsIHFTb3VyY2VJdGVtKSB7XHJcbiAgICBjb25zdCBxSW1nID0gcVNvdXJjZUl0ZW0ucXVlcnlTZWxlY3RvcihcImltZ1wiKSA/PyBcclxuICAgICAgcVNvdXJjZUl0ZW0ucXVlcnlTZWxlY3RvcihcIi5wbGFjZWhvbGRlci1pbWdcIik7XHJcblxyXG4gICAgcUltZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5faGFuZGxlUmF0ZUJ0bkNsaWNrKGV2dCwgcSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpbWdXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGltZ1dyYXBwZXJEaXYuY2xhc3NMaXN0LmFkZChcInEtc291cmNlLWltZy13cmFwcGVyXCIpO1xyXG5cclxuICAgIC8vIENoYW5nZSBpbWcgdG8gYmUgcGFyZW50ZWQgYnkgdGhlIGltZyB3cmFwcGVyIGRpdiBpbnN0ZWFkLlxyXG4gICAgaW1nV3JhcHBlckRpdi5hcHBlbmRDaGlsZChxSW1nKTtcclxuICAgIHFTb3VyY2VJdGVtLmluc2VydEJlZm9yZShpbWdXcmFwcGVyRGl2LCBxU291cmNlSXRlbS5jaGlsZHJlblswXSk7XHJcblxyXG4gICAgLy8gQWRkIGEgaG92ZXIgZGl2LCBhbHNvIGluIHRoZSB3cmFwcGVyIGRpdi5cclxuICAgIGNvbnN0IGhvdmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGhvdmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJxLXNvdXJjZS1pdGVtLWhvdmVyXCIpO1xyXG5cclxuICAgIGNvbnN0IGhvdmVyVHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBob3ZlclR4dC5pbm5lclRleHQgPSB0aGlzLl9nZXRIb3ZlclRleHQoKTtcclxuICAgIGhvdmVyVHh0LmNsYXNzTGlzdC5hZGQoXCJxLXNvdXJjZS1ob3Zlci10eHRcIik7XHJcblxyXG4gICAgaG92ZXJEaXYuYXBwZW5kQ2hpbGQoaG92ZXJUeHQpO1xyXG4gICAgaW1nV3JhcHBlckRpdi5hcHBlbmRDaGlsZChob3ZlckRpdik7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgU2luZ2xlTW9kZVFTb3VyY2UgfSBmcm9tIFwiLi4vc2luZ2xlTW9kZVFTb3VyY2UubWpzXCI7XHJcbmltcG9ydCB7IENhdGVnb3J5Q2hlY2tib3hlcyB9IGZyb20gXCIuLi8uLi8uLi8uLi9jYXRlZ29yeUNoZWNrYm94ZXMubWpzXCI7XHJcbmltcG9ydCB7IGtpbmRyZWRSZWNzTWl4aW4gfSBmcm9tIFwiLi4vLi4vLi4vLi4va2luZHJlZFJlY3NNaXhpbi5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFJlY3NRU291cmNlIGV4dGVuZHMgU2luZ2xlTW9kZVFTb3VyY2Uge1xyXG4gIC8vIFN0b3JlcyB0aGUgRE9NIHJvdyBmb3IgdGhlIHF1ZXN0aW9uIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIGFuc3dlcmVkLlxyXG4gICNjdXJyUVJvdyA9IG51bGw7XHJcbiAgI3JlY0ZvckNhdGVnb3J5Q2hlY2tib3hlcztcclxuICAjYmFzZWRPbkNhdGVnb3J5Q2hlY2tib3hlcztcclxuICAjZ2V0UmVjc0J0bjtcclxuICBfbG9hZGVyO1xyXG4gIF9xRGl2Q2xhc3MgPSBcInJlYy1pdGVtXCI7XHJcblxyXG4gIHN0YXRpYyAjSU5WQUxJRF9TRUxFQ1RTX01TRyA9IGBBdCBsZWFzdCBvbmUgY2F0ZWdvcnkgbXVzdCBiZSBzZWxlY3RlZCBmcm9tIGVhY2ggb2YgdGhlIFwiUmVjb21tZW5kIGZvclwiIGFuZCBcIkJhc2VkIG9uXCIgZ3JvdXBzLmA7XHJcbiAgc3RhdGljICNOT19LSU5EUkVEX01TRyA9IFtcIllvdSdyZSBvbmUgb2YgYSBraW5kIVwiLCBcIldlIGNvdWxkbid0IGZpbmQgYW55b25lIHNpbWlsYXIgZW5vdWdoIHRvIHlvdSBmb3IgdGhlIHNlbGVjdGVkIGNhdGVnb3JpZXMuIFRyeSBhIGRpZmZlcmVudCBzZWxlY3Rpb24gb3IgYW5zd2VyIG1vcmUgcXVlc3Rpb25zLlwiXTtcclxuICBzdGF0aWMgI0tJTkRSRURfTk9fUkVDU19NU0cgPSBbXCJObyByZWNvbW1lbmRhdGlvbnMhXCIsIFwiWW91ciBLaW5kcmVkIHNwaXJpdHMgZm9yIHRoZSBjYXRlZ29yaWVzIHNlbGVjdGVkIGhhdmUgbm90aGluZyB0byByZWNvbW1lbmQgeW91IHRoYXQgeW91IGhhdmVuJ3QgcmF0ZWQgYWxyZWFkeSEgVHJ5IGEgZGlmZmVyZW50IHNlbGVjdGlvbi5cIl07XHJcblxyXG4gIGNvbnN0cnVjdG9yKGxpc3REaXYpIHtcclxuICAgIHN1cGVyKGxpc3REaXYpO1xyXG5cclxuICAgIHRoaXMuX2xvYWRlciA9IGxpc3REaXYucXVlcnlTZWxlY3RvcihcIi5sb2FkZXJcIik7XHJcblxyXG4gICAgY29uc3QgcmVjc0ZvckRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVjb21tZW5kYXRpb25zLWZvclwiKTtcclxuICAgIGNvbnN0IGJhc2VkT25EaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhc2VkLW9uXCIpO1xyXG4gICAgY29uc3QgcmVjRm9yQ2hlY2tib3hlc0FyciA9IHJlY3NGb3JEaXYucXVlcnlTZWxlY3RvckFsbChcIi5jYXRlZ29yeS1jaGVja2JveFwiKTtcclxuICAgIGNvbnN0IGJhc2VkT25DaGVja2JveGVzQXJyID0gYmFzZWRPbkRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhdGVnb3J5LWNoZWNrYm94XCIpO1xyXG4gICAgXHJcbiAgICB0aGlzLiNyZWNGb3JDYXRlZ29yeUNoZWNrYm94ZXMgPSBuZXcgQ2F0ZWdvcnlDaGVja2JveGVzKHJlY0ZvckNoZWNrYm94ZXNBcnIpO1xyXG4gICAgdGhpcy4jYmFzZWRPbkNhdGVnb3J5Q2hlY2tib3hlcyA9IG5ldyBDYXRlZ29yeUNoZWNrYm94ZXMoYmFzZWRPbkNoZWNrYm94ZXNBcnIpO1xyXG5cclxuICAgIHRoaXMuI2dldFJlY3NCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdldC1yZWNzLWJ0blwiKTtcclxuXHJcbiAgICB0aGlzLiNnZXRSZWNzQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMudmFsaWRhdGVIYW5kbGVVcGRhdGUodGhpcy5fbGlzdERpdiwgUmVjc1FTb3VyY2UuI0lOVkFMSURfU0VMRUNUU19NU0cpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBCdWlsZHMgdGhlIGNvbnRlbnQgZGl2IHdpdGggYWxsIHRoZSBxdWVzdGlvbnMuXHJcbiAgX2J1aWxkQ29udGVudERpdihyZWNzSW5mbykge1xyXG4gICAgaWYgKHJlY3NJbmZvLm51bUtpbmRyZWQgPiAwKSB7XHJcbiAgICAgIGlmIChyZWNzSW5mby5yZWNvbW1lbmRMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdXBlci5fYnVpbGRDb250ZW50RGl2KHJlY3NJbmZvLnJlY29tbWVuZExpc3QpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuI3NldE5vUmVjc01zZyhSZWNzUVNvdXJjZS4jS0lORFJFRF9OT19SRUNTX01TRyk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy4jc2V0Tm9SZWNzTXNnKFJlY3NRU291cmNlLiNOT19LSU5EUkVEX01TRyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyBhIG1lc3NhZ2UgaW4gdGhlIHJlY29tbWVuZGF0aW9ucyBsaXN0IGZvciB3aHkgbm8gcmVjb21tZW5kYXRpb25zIHdlcmUgZm91bmQuXHJcbiAgI3NldE5vUmVjc01zZyhtc2dJbmZvKSB7XHJcbiAgICBjb25zdCBub1JlY3NNc2dEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29uc3Qgbm9SZWNzSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg1XCIpO1xyXG4gICAgY29uc3Qgbm9SZWNzVHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcblxyXG4gICAgbm9SZWNzSGVhZGVyLmlubmVyVGV4dCA9IG1zZ0luZm9bMF07XHJcbiAgICBub1JlY3NUeHQuaW5uZXJUZXh0ID0gbXNnSW5mb1sxXTtcclxuICAgIFxyXG4gICAgbm9SZWNzTXNnRGl2LmFwcGVuZENoaWxkKG5vUmVjc0hlYWRlcik7XHJcbiAgICBub1JlY3NNc2dEaXYuYXBwZW5kQ2hpbGQobm9SZWNzVHh0KTtcclxuXHJcbiAgICBub1JlY3NNc2dEaXYuY2xhc3NMaXN0LmFkZChcIm5vLXJlY3MtbXNnXCIpO1xyXG4gICAgdGhpcy5fY29udGVudERpdi5hcHBlbmRDaGlsZChub1JlY3NNc2dEaXYpO1xyXG4gIH1cclxuXHJcbiAgLy8gRW5zdXJlIGF0IGxlYXN0IG9uZSBjaGVja2JveCBpcyBzZWxlY3RlZCBmb3IgUmVjIGZvciBhbmQgQmFzZWQgb24gR3JvdXBzLlxyXG4gIF92YWxpZGF0ZVNlbGVjdGlvbnMoKSB7XHJcbiAgICBjb25zdCBudW1CYXNlZE9uQ2F0cyA9IHRoaXMuI3JlY0ZvckNhdGVnb3J5Q2hlY2tib3hlcy5nZXROdW1TZWxlY3RlZCgpO1xyXG4gICAgY29uc3QgbnVtUmVjQ2F0cyA9IHRoaXMuI2Jhc2VkT25DYXRlZ29yeUNoZWNrYm94ZXMuZ2V0TnVtU2VsZWN0ZWQoKTtcclxuICAgIGNvbnN0IGlzVmFsaWRTZWxlY3Rpb25zID0gKG51bUJhc2VkT25DYXRzID4gMCkgJiYgKG51bVJlY0NhdHMgPiAwKTtcclxuICAgIHJldHVybiBpc1ZhbGlkU2VsZWN0aW9ucztcclxuICB9XHJcblxyXG4gIF9hZGRUb1FEaXYocUluZm8pIHtcclxuICAgIHFJbmZvLnFTb3VyY2VJdGVtLmFwcGVuZENoaWxkKHFJbmZvLnFUZXh0KTtcclxuICAgIHFJbmZvLnFTb3VyY2VJdGVtLmluc2VydEJlZm9yZShxSW5mby5xU2NvcmUsIHFJbmZvLnFTb3VyY2VJdGVtLmNoaWxkcmVuWzBdKTtcclxuXHJcbiAgICBjb25zdCBjYXRUeXBlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgY29uc3QgY2F0VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG5cclxuICAgIGNhdFR5cGVUZXh0LmNsYXNzTGlzdC5hZGQoXCJyZWMtY2F0LXR5cGVcIik7XHJcbiAgICBjYXRUZXh0LmNsYXNzTGlzdC5hZGQoXCJyZWMtY2F0XCIpO1xyXG5cclxuICAgIFtjYXRUeXBlVGV4dC5pbm5lclRleHQsIGNhdFRleHQuaW5uZXJUZXh0XSA9IFtxSW5mby5jYXRUeXBlTmFtZSwgcUluZm8uY2F0TmFtZV07XHJcblxyXG4gICAgcUluZm8ucVNvdXJjZUl0ZW0uYXBwZW5kQ2hpbGQoY2F0VHlwZVRleHQpO1xyXG4gICAgcUluZm8ucVNvdXJjZUl0ZW0uYXBwZW5kQ2hpbGQoY2F0VGV4dCk7XHJcblxyXG4gICAgcmV0dXJuIHFJbmZvLnFTb3VyY2VJdGVtO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IHRoZSBsYXRlc3QgcmVjb21tZW5kYXRpb25zIGZyb20gdGhlIGJhY2sgZW5kLlxyXG4gIGFzeW5jIGdldFJlY3MoKSB7XHJcbiAgICBjb25zdCByZWNGb3JDYXRlZ29yeUluZm8gPSB0aGlzLiNyZWNGb3JDYXRlZ29yeUNoZWNrYm94ZXMuZ2V0U2VsZWN0ZWRDYXRlZ29yeUluZm8oKTtcclxuICAgIGNvbnN0IGJhc2VkT25DYXRlZ29yeUluZm8gPSB0aGlzLiNiYXNlZE9uQ2F0ZWdvcnlDaGVja2JveGVzLmdldFNlbGVjdGVkQ2F0ZWdvcnlJbmZvKCk7XHJcblxyXG4gICAgY29uc3QgYWxsQ2F0ZWdvcnlJbmZvID0ge1xyXG4gICAgICByZWNvbW1lbmRhdGlvbnNGb3I6IHJlY0ZvckNhdGVnb3J5SW5mbyxcclxuICAgICAgYmFzZWRPbjogYmFzZWRPbkNhdGVnb3J5SW5mb1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBmZXRjaFJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvcmVjb21tZW5kYXRpb25zXCIsIHtcclxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShhbGxDYXRlZ29yeUluZm8pXHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY29uc3QgcmVjb21tZW5kc0luZm8gPSBhd2FpdCBmZXRjaFJlc3BvbnNlLmpzb24oKTtcclxuICAgIHJldHVybiByZWNvbW1lbmRzSW5mbztcclxuICB9XHJcblxyXG4gIC8vIFNldCB0aGUgY3VyclFSb3cgdG8gdGhlIHF1ZXN0aW9uIHRoYXQgaXMgbm93IGJlaW5nIHJhdGVkLCBzbyBpdCBjYW4gYmUgXHJcbiAgLy8gZWFzaWx5IHJlbW92ZWQgb25jZSBhbnN3ZXJlZC5cclxuICBfaGFuZGxlUmF0ZUJ0bkNsaWNrKGV2dCwgcXVlc3Rpb24pIHtcclxuICAgIHRoaXMuI2N1cnJRUm93ICA9IGV2dC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICAgIHN1cGVyLl9oYW5kbGVSYXRlQnRuQ2xpY2soZXZ0LCBxdWVzdGlvbik7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgdGhlIG5ld2x5IGFuc3dlcmVkIHF1ZXN0aW9uIGZyb20gdGhlIHJlY29tbWVuZGF0aW9ucyBsaXN0LlxyXG4gIHJlbW92ZUFuc3dlcmVkUSgpIHtcclxuICAgIHRoaXMuX2NvbnRlbnREaXYucmVtb3ZlQ2hpbGQodGhpcy4jY3VyclFSb3cpO1xyXG4gIH1cclxuXHJcbiAgX2dldFNjb3JlVGV4dChyZWMpIHtcclxuICAgIHJldHVybiByZWMucmF0aW5nLnN0cmVuZ3RoLnRvRml4ZWQoMSk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFBPU1RTIGFueSBuZXcgYW5zd2VycyB0aGVuIGdldHMgdGhlIGxhdGVzdCByZWNvbW1lbmRhdGlvbnMuXHJcbiAgYXN5bmMgI2dldExhdGVzdFJlY3MoKSB7XHJcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBnZXRSZWNzQ2xpY2tgKSk7XHJcblxyXG4gICAgLy8gV2FpdCBmb3IgcG9zdCBhbnN3ZXJzIHRvIGNvbXBsZXRlIGJlZm9yZSByZWZyZXNoaW5nIHJlY29tbWVuZGF0aW9ucy5cclxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3Bvc3RBbnN3ZXJzQ29tcGxldGUnLCByZXNvbHZlKCksIHtvbmNlOiB0cnVlfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBsYXRlc3RSZWNzSW5mbyA9IGF3YWl0IHRoaXMuZ2V0UmVjcygpO1xyXG4gICAgcmV0dXJuIGxhdGVzdFJlY3NJbmZvO1xyXG4gIH1cclxuXHJcbiAgLy8gVXNlZCBieSB0aGUgbWl4aW4gdG8gZ2V0IGxhdGVzdCByZWNvbW1lbmRhdGlvbnMuXHJcbiAgYXN5bmMgX2dldFVwZGF0ZWRTb3VyY2VEYXRhKCkge1xyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuI2dldExhdGVzdFJlY3MoKTtcclxuICB9XHJcbiAgXHJcbiAgX2dldEhvdmVyVGV4dCgpIHtcclxuICAgIHJldHVybiBcIlJhdGUgaXQhXCI7XHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3QuYXNzaWduKFJlY3NRU291cmNlLnByb3RvdHlwZSwga2luZHJlZFJlY3NNaXhpbik7IiwiZXhwb3J0IGNsYXNzIEFuc3dlclVJUGFuZWwge1xyXG4gIG1haW5EaXY7XHJcbiAgcmF0ZVBhbmVsO1xyXG4gIHJhdGVCdG47XHJcbiAgc2tpcEJ0bjtcclxuICBzY29yZVNsaWRlcjtcclxuICBzY29yZVNsaWRlcklucHV0O1xyXG4gIGN1cnJRdWVzdGlvblRleHQ7XHJcbiAgcHJldkFuc0RpdjtcclxuICBwcmV2QW5zVmFsO1xyXG4gIGxvYWRlcjtcclxuICBkZXRhaWxzO1xyXG5cclxuICBjb25zdHJ1Y3RvcihxTW9kZURpdikge1xyXG4gICAgdGhpcy5tYWluRGl2ID0gcU1vZGVEaXYucXVlcnlTZWxlY3RvcihcIi5hbnN3ZXItcGFuZWxcIik7XHJcbiAgICB0aGlzLnJhdGVQYW5lbCA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnJhdGUtcGFuZWxcIik7XHJcbiAgICB0aGlzLnJhdGVCdG4gPSB0aGlzLm1haW5EaXYucXVlcnlTZWxlY3RvcihcIi5yYXRlLWJ0blwiKTtcclxuICAgIHRoaXMuc2tpcEJ0biA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnNraXAtYnRuXCIpO1xyXG4gICAgdGhpcy5zY29yZVNsaWRlciA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnNjb3JlLXNsaWRlclwiKTtcclxuICAgIHRoaXMuc2NvcmVTbGlkZXJJbnB1dCA9IHRoaXMuc2NvcmVTbGlkZXIucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgdGhpcy5jdXJyUXVlc3Rpb25UZXh0ID0gdGhpcy5tYWluRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuY3Vyci1xdWVzdGlvblwiKTtcclxuICAgIHRoaXMucHJldkFuc0RpdiA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLnByZXYtYW5zLWluZm9cIik7XHJcbiAgICB0aGlzLnByZXZBbnNWYWwgPSB0aGlzLm1haW5EaXYucXVlcnlTZWxlY3RvcihcIi5wcmV2LWFucy12YWxcIik7XHJcbiAgICB0aGlzLmxvYWRlciA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLmxvYWRlclwiKTtcclxuICAgIHRoaXMuZGV0YWlscyA9IHRoaXMubWFpbkRpdi5xdWVyeVNlbGVjdG9yKFwiLmRldGFpbHNcIik7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFVwZGF0ZXMgdGhlIGRpc3BsYXllZCBxdWVzdGlvbiB3aXRoIHRoZSBuZXcgZmlyc3QgcXVldWUgaXRlbS5cclxuICBkaXNwbGF5Q3VyclEobmV3UUluZm8sIGluY2x1ZGVBbHJlYWR5QW5zd2VyZWQpIHtcclxuICAgIHRoaXMuI3Nob3dPckhpZGVQYW5lbChuZXdRSW5mbyk7XHJcblxyXG4gICAgLy8gU2hvdyBjdXJyZW50IHF1ZXN0aW9uIHRleHQgYW5kIHJlc2V0IHByZXZpb3VzIGFuc3dlciBpbmZvLlxyXG4gICAgdGhpcy5jdXJyUXVlc3Rpb25UZXh0LmlubmVySFRNTCA9IG5ld1FJbmZvLmN1cnJRVGV4dDtcclxuICAgIHRoaXMucHJldkFuc1ZhbC5pbm5lclRleHQgPSBcIlwiO1xyXG5cclxuICAgIGNvbnN0IHByZXZTY29yZSA9IHRoaXMuI2ZpbGxQcmV2QW5zKG5ld1FJbmZvLCBpbmNsdWRlQWxyZWFkeUFuc3dlcmVkKTtcclxuXHJcbiAgICAvLyBSZXNldCAvIHNldCB0aGUgc2NvcmUgYW5kIHNlbmQgaW5wdXQgZXZlbnQgZm9yIHRoZSBjdXN0b20gc2xpZGVyIHRvIFxyXG4gICAgLy8gY2F1c2UgdGhlIHdyYXBwZXIgZWxlbWVudCB0byB1cGRhdGUgYWxzby5cclxuICAgIHRoaXMuc2NvcmVTbGlkZXJJbnB1dC52YWx1ZSA9IHByZXZTY29yZTtcclxuICAgIHRoaXMuc2NvcmVTbGlkZXJJbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIpKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHNob3dMb2FkZXIoKSB7XHJcbiAgICB0aGlzLmxvYWRlci5jbGFzc0xpc3QucmVtb3ZlKFwiZnVsbHktaGlkZGVuXCIpO1xyXG4gICAgdGhpcy5kZXRhaWxzLmNsYXNzTGlzdC5hZGQoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgICB0aGlzLmRldGFpbHMuY2xhc3NMaXN0LmFkZChcInRyYW5zcGFyZW50XCIpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgaGlkZUxvYWRlcigpIHtcclxuICAgIHRoaXMubG9hZGVyLmNsYXNzTGlzdC5hZGQoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgICB0aGlzLmRldGFpbHMuY2xhc3NMaXN0LnJlbW92ZShcImZ1bGx5LWhpZGRlblwiKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5kZXRhaWxzLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc3BhcmVudFwiKSwgMTApO1xyXG4gIH1cclxuXHJcbiAgLy8gU2hvd3MgLyBoaWRlcyByYXRlIHBhbmVsIGRlcGVuZGVudCBvbiB3aGV0aGVyIGVuZCBvZiBxdWV1ZSByZWFjaGVkLlxyXG4gICNzaG93T3JIaWRlUGFuZWwobmV3UUluZm8pIHtcclxuICAgIC8vIFNob3cgb3IgaGlkZSB0aGUgc2NvcmluZyBzbGlkZXIgYW5kIGJ1dHRvbnMgYXMgbmVjZXNzYXJ5LlxyXG4gICAgaWYgKG5ld1FJbmZvLmVuZE9mUXVldWUpIHtcclxuICAgICAgdGhpcy5yYXRlUGFuZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnJhdGVQYW5lbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIFNob3dzIG9yIGhpZGVzIHByZXZpb3VzIGFuc3dlciBpbmZvIGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZXJlIGlzIG9uZSBmb3IgXHJcbiAgLy8gdGhpcyBxdWVzdGlvbiBhbmQgc2V0cyB0aGUgcHJldiBhbnMgdGV4dC4gUmV0dXJucyB0aGUgcHJldiBhbnMgc2NvcmUgXHJcbiAgLy8gdmFsdWUsIHVzZWQgdG8gc2V0IHRoZSBzbGlkZXIgc2NvcmUuXHJcbiAgI2ZpbGxQcmV2QW5zKG5ld1FJbmZvLCBpbmNsdWRlQWxyZWFkeUFuc3dlcmVkKSB7XHJcbiAgICBsZXQgcHJldkFuc1Njb3JlID0gNTtcclxuXHJcbiAgICAvLyBJZiBjdXJyZW50IHF1ZXN0aW9uIGhhcyBhIHByZXZpb3VzIGFuc3dlciBieSB0aGUgdXNlciwgc2hvdyB0aGUgcHJldmlvdXMgXHJcbiAgICAvLyBhbnN3ZXIgZGV0YWlscy5cclxuICAgIGlmIChpbmNsdWRlQWxyZWFkeUFuc3dlcmVkICYmIG5ld1FJbmZvLmN1cnJRQW5zKSB7XHJcbiAgICAgIHRoaXMucHJldkFuc0Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpOyAgICAgIFxyXG4gICAgICB0aGlzLnByZXZBbnNWYWwuaW5uZXJUZXh0ID0gXCJTa2lwcGVkXCI7XHJcblxyXG4gICAgICBpZiAoIW5ld1FJbmZvLmN1cnJRQW5zLnNraXApIHtcclxuICAgICAgICBwcmV2QW5zU2NvcmUgPSBuZXdRSW5mby5jdXJyUUFucy5hbnN3ZXJWYWw7XHJcbiAgICAgICAgdGhpcy5wcmV2QW5zVmFsLmlubmVyVGV4dCA9IHByZXZBbnNTY29yZTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnByZXZBbnNEaXYuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHByZXZBbnNTY29yZTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBnZXRRQ2F0ZWdvcnksIGdldFFJbmZvIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3F1ZXN0aW9uc0hlbHBlcnMubWpzXCI7XHJcbmltcG9ydCB7IERvbVF1ZXVlIH0gZnJvbSBcIi4vY29tcG9uZW50cy9kb21RdWV1ZS5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2VRdWVzdGlvbnNRdWV1ZSB7XHJcbiAgX2NhdGVnb3J5VHlwZU5hbWU7XHJcbiAgX2NhdGVnb3J5TmFtZTtcclxuICBxdWV1ZSA9IFtdO1xyXG4gIHF1ZXVlVHlwZTtcclxuICBfZG9tUXVldWU7XHJcbiAgX3F1ZXVlUHJldlFzID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHFNb2RlTWFpbkRpdiwgY2F0ZWdvcnlUeXBlID0gbnVsbCwgY2F0ZWdvcnkgPSBudWxsKSB7XHJcbiAgICB0aGlzLl9jYXRlZ29yeVR5cGVOYW1lID0gY2F0ZWdvcnlUeXBlO1xyXG4gICAgdGhpcy5fY2F0ZWdvcnlOYW1lID0gY2F0ZWdvcnk7XHJcbiAgICB0aGlzLl9kb21RdWV1ZSA9IG5ldyBEb21RdWV1ZShxTW9kZU1haW5EaXYsIGNhdGVnb3J5VHlwZSwgY2F0ZWdvcnkpO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0cyB0aGUgdGV4dCB0byBkaXNwbGF5IG9mIHRoZSBjdXJyZW50IGZpcnN0IGl0ZW0gaW4gdGhlIHF1ZXN0aW9ucyBxdWV1ZS5cclxuICBnZXRDdXJyUUluZm8oKSB7XHJcbiAgICBsZXQgY3VyclFUZXh0O1xyXG4gICAgbGV0IGN1cnJRQW5zO1xyXG4gICAgbGV0IGVuZE9mUXVldWUgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBIaWRlIHF1ZXN0aW9uIGFuc3dlciBwYW5lbCBpZiBydW4gb3V0IG9mIHF1ZXN0aW9ucyBhbmQgZGlzcGxheSBhIG1lc3NhZ2UuXHJcbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgY3VyclFUZXh0ID0gdGhpcy5fZ2V0RW5kUXVldWVNc2coKTtcclxuICAgICAgZW5kT2ZRdWV1ZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc3QgY3VyclEgPSB0aGlzLnF1ZXVlWzBdO1xyXG4gICAgICBjb25zdCBbY2F0VHlwZU5hbWUsIGNhdE5hbWVdID0gZ2V0UUNhdGVnb3J5KGN1cnJRLCB0aGlzLl9jYXRlZ29yeVR5cGVOYW1lLCBcclxuICAgICAgICB0aGlzLl9jYXRlZ29yeU5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICBjdXJyUVRleHQgPSBnZXRRSW5mbyhjdXJyUSwgXCJxRGlzcGxheVRleHRcIiwgY2F0VHlwZU5hbWUsIGNhdE5hbWUpO1xyXG4gICAgICBjdXJyUUFucyA9IGN1cnJRLmN1cnJBbnM7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7ZW5kT2ZRdWV1ZSwgY3VyclFUZXh0LCBjdXJyUUFuc307XHJcbiAgfVxyXG5cclxuICBfZ2V0RW5kUXVldWVNc2coKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbmRRdWV1ZU1zZztcclxuICB9XHJcblxyXG4gIC8vIFJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBxdWV1ZSBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgaXRlbSBmcm9tIHRoZSBET00gXHJcbiAgLy8gcXVldWUuIFJldHVybnMgdGhlIHJlbW92ZWQgcXVldWUgaXRlbS5cclxuICByZW1vdmVRdWV1ZUl0ZW0oaWR4LCBkb1RyYW5zKSB7XHJcbiAgICBjb25zdCB0aGlzUXVldWVJdGVtID0gdGhpcy5xdWV1ZVtpZHhdO1xyXG4gICAgdGhpcy5xdWV1ZS5zcGxpY2UoaWR4LCAxKTtcclxuICAgIHRoaXMuX2RvbVF1ZXVlLnJlbW92ZVF1ZXVlSXRlbShpZHgsIGRvVHJhbnMpO1xyXG5cclxuICAgIHJldHVybiB0aGlzUXVldWVJdGVtO1xyXG4gIH1cclxuXHJcbiAgLy8gQWRkcyBhcnJheSBvZiBxdWVzdGlvbnMgdG8gcXVldWUgYW5kIGFkZHMgY29ycmVzcG9uZGluZyBuZXcgZWxlbWVudHMgdG8gXHJcbiAgLy8gRE9NIHF1ZXVlIHRvby5cclxuICBfYWRkVG9RdWV1ZShxcykge1xyXG4gICAgdGhpcy5xdWV1ZSA9IHRoaXMucXVldWUuY29uY2F0KHFzKTtcclxuICAgIHRoaXMuX2RvbVF1ZXVlLmFkZFRvUXVldWUocXMpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ2xlYXJzIHRoZSBET00gaXRlbXMgcXVldWUuXHJcbiAgX3Jlc2V0UXVldWUoKSB7XHJcbiAgICB0aGlzLnF1ZXVlID0gW107XHJcbiAgICB0aGlzLl9kb21RdWV1ZS5yZXNldFF1ZXVlKCk7XHJcbiAgICB0aGlzLl9xdWV1ZVByZXZRcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgc2F2ZVByZXZRKHFJZCkge1xyXG4gICAgdGhpcy5fcXVldWVQcmV2UXMucHVzaChxSWQpO1xyXG4gIH1cclxufSIsIi8vIEhlbHBlciBjbGFzcyBmb3IgdGhlIGJhc2UgcXVlc3Rpb25zIHF1ZXVlLCB0byByZXByZXNlbnQgdGhlIERPTSBxdWV1ZSBpdGVtcy5cclxuaW1wb3J0IHsgY3JlYXRlUURvbUl0ZW0sIGdldFFDYXRlZ29yeSB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9xdWVzdGlvbnNIZWxwZXJzLm1qc1wiO1xyXG5cclxuXHJcblxyXG4vLyAoZWcuIHBvc3RlciBpbWFnZXMpIGFuZCBoYW5kbGUgdGhlaXIgdHJhbnNpdGlvbnMgd2hlbiBhbnN3ZXJpbmcgcXVlc3Rpb25zLlxyXG5leHBvcnQgY2xhc3MgRG9tUXVldWUge1xyXG4gIF9xdWV1ZSA9IFtdO1xyXG4gICNudW1UcmFuc2l0aW9ucyA9IDA7XHJcbiAgI2NhdGVnb3J5VHlwZU5hbWU7XHJcbiAgI2NhdGVnb3J5TmFtZTtcclxuXHJcbiAgc3RhdGljIExBWllfTE9BRF9TVEFSVF9JRFggPSA0O1xyXG5cclxuICBjb25zdHJ1Y3RvcihxTW9kZU1haW5EaXYsIGNhdGVnb3J5VHlwZSwgY2F0ZWdvcnkpIHtcclxuICAgIHRoaXMuX3F1ZXVlID0gcU1vZGVNYWluRGl2LnF1ZXJ5U2VsZWN0b3IoXCIucXVldWUtaW1nc1wiKTtcclxuICAgIHRoaXMuI2NhdGVnb3J5VHlwZU5hbWUgPSBjYXRlZ29yeVR5cGU7XHJcbiAgICB0aGlzLiNjYXRlZ29yeU5hbWUgPSBjYXRlZ29yeTtcclxuXHJcbiAgICB0aGlzLl9xdWV1ZS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLiNlbmRUcmFuc2l0aW9uKGV2dCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIE9uY2UgRE9NIHF1ZXVlIGhhcyBkb25lIHRoZSB0cmFuc2l0aW9uIGZvciBhbnN3ZXJpbmcgYSBxdWVzdGlvbiwgZGVsZXRlIFxyXG4gIC8vIHRoZSBkb20gcXVlc3Rpb24uIENoZWNrIGluIGNhc2UgYW55IG1vcmUgdHJhbnNpdGlvbnMgYXJlIHF1ZXVlZCBhbmQgY2FycnkgXHJcbiAgLy8gdGhlbSBvdXQgaWYgc28uXHJcbiAgI2VuZFRyYW5zaXRpb24oZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LnByb3BlcnR5TmFtZSAhPT0gXCJsZWZ0XCIpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLiNudW1UcmFuc2l0aW9ucy0tO1xyXG4gICAgdGhpcy5fZGVsZXRlRG9tUSgwKTtcclxuICAgIHRoaXMuX3F1ZXVlLmNsYXNzTGlzdC5yZW1vdmUoXCJxdWV1ZS1pbWdzLXRyYW5zaXRpb25pbmdcIik7XHJcbiAgICBcclxuICAgIC8vIElmIHVzZXIgaGFzIGNsaWNrZWQgbXVsdGlwbGUgYW5zd2VycyBxdWlja2x5LCB0aGVuIGNhcnJ5IG91dCBhbnkgXHJcbiAgICAvLyBxdWV1ZWQgdHJhbnNpdGlvbnMgZm9yIGZ1cnRoZXIgYW5zd2Vycy5cclxuICAgIGlmICh0aGlzLiNudW1UcmFuc2l0aW9ucyA+IDApIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLiNkb1RyYW5zaXRpb24oKSwgMCk7XHJcbiAgICB9OyAgICBcclxuICB9XHJcblxyXG4gIC8vIENyZWF0ZSBET00gcXVldWUgaW1hZ2VzIGFuZCBhdWRpbyAod2hlcmUgcHJlc2VudCkgZnJvbSBsaXN0IG9mIHF1ZXN0aW9ucy5cclxuICBhZGRUb1F1ZXVlKHFzKSB7XHJcbiAgICBmb3IgKGxldCBxIG9mIHFzKSB7XHJcbiAgICAgIGNvbnN0IFtjYXRUeXBlTmFtZSwgY2F0TmFtZV0gPSBnZXRRQ2F0ZWdvcnkocSwgXHJcbiAgICAgICAgdGhpcy4jY2F0ZWdvcnlUeXBlTmFtZSwgdGhpcy4jY2F0ZWdvcnlOYW1lKTtcclxuICAgICAgXHJcbiAgICAgIGNvbnN0IGxhenlMb2FkID0gdGhpcy5fcXVldWUuY2hpbGRFbGVtZW50Q291bnQgPj0gRG9tUXVldWUuTEFaWV9MT0FEX1NUQVJUX0lEWDtcclxuXHJcbiAgICAgIGNvbnN0IG5ld0RvbVEgPSBjcmVhdGVRRG9tSXRlbShxLCBjYXRUeXBlTmFtZSwgY2F0TmFtZSwgbGF6eUxvYWQpO1xyXG4gICAgICBuZXdEb21RLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgcS5faWQpO1xyXG4gICAgICB0aGlzLl9xdWV1ZS5hcHBlbmRDaGlsZChuZXdEb21RKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSBET00gaW1hZ2VzIHF1ZXVlIGFuZCBoYW5kbGUgdGhlIHRyYW5zaXRpb24uXHJcbiAgcmVtb3ZlUXVldWVJdGVtKGlkeCwgZG9UcmFucykge1xyXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICAvLyBJZiBmaXJzdCBpdGVtIGluIHF1ZXVlIChpZS4gaGF2ZSBhbnN3ZXJlZCBhIHF1ZXN0aW9uKSwgdGhlbiBuZWVkIHRvIFxyXG4gICAgICAvLyBoYW5kbGUgdGhlIHRyYW5zaXRpb24gb2YgaW1hZ2VzLlxyXG4gICAgICBpZiAoaWR4ID09PSAwICYmIGRvVHJhbnMpIHtcclxuICAgICAgICB0aGlzLiNudW1UcmFuc2l0aW9ucysrO1xyXG4gICAgICAgIHRoaXMuI2RvVHJhbnNpdGlvbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBPdGhlcndpc2UganVzdCBkZWxldGUgdGhlIERPTSBxdWV1ZSBpdGVtLlxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLl9kZWxldGVEb21RKGlkeCk7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gRGVsZXRlcyBhbiBpbmRpdmlkdWFsIERPTSBxdWV1ZSBpdGVtLlxyXG4gIF9kZWxldGVEb21RKGlkeCkge1xyXG4gICAgLy8gSWYgcmVtb3Zpbmcgb3V0ZGF0ZWQgcXVldWUgaXRlbXMgZnJvbSBtaWRkbGUgb2YgcXVldWUgYnV0IHF1ZXVlIGlzIHN0aWxsIFxyXG4gICAgLy8gdHJhbnNpdGlvbmluZywgYm9vc3QgdGhlIGluZGV4IGJ5IDEgdG8gZmFjdG9yIGluIHRoYXQgdGhlIHByZXZpb3VzbHkgXHJcbiAgICAvLyBhbnN3ZXJlZCBxIHdpbGwgaGF2ZSBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgcXVldWUgYnV0IG5vdCB0aGUgZG9tIHF1ZXVlIHlldCBcclxuICAgIC8vIGFzIHRoZSB0cmFuc2l0aW9uIGhhc24ndCB5ZXQgY29tcGxldGVkLlxyXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmNsYXNzTGlzdC5jb250YWlucyhcInF1ZXVlLWltZ3MtdHJhbnNpdGlvbmluZ1wiKSAmJiBpZHggPiAwKSB7XHJcbiAgICAgIGlkeCsrO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl9xdWV1ZS5yZW1vdmVDaGlsZCh0aGlzLl9xdWV1ZS5jaGlsZHJlbltpZHhdKTtcclxuICB9XHJcblxyXG4gIC8vIENhdXNlcyB0cmFuc2l0aW9uaW5nIG9mIHBvc3RlciBpbWFnZXMgd2hlbiBhbnN3ZXJpbmcgYSBxdWVzdGlvbi5cclxuICAjZG9UcmFuc2l0aW9uKCkge1xyXG4gICAgdGhpcy5fcXVldWUuY2xhc3NMaXN0LmFkZChcInF1ZXVlLWltZ3MtdHJhbnNpdGlvbmluZ1wiKTtcclxuICB9XHJcblxyXG4gIHJlc2V0UXVldWUoKSB7XHJcbiAgICB0aGlzLl9xdWV1ZS5pbm5lclRleHQgPSBcIlwiO1xyXG4gIH1cclxufSIsImltcG9ydCB7IERvbVF1ZXVlIH0gZnJvbSBcIi4vZG9tUXVldWUubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTaW5nbGVEb21RdWV1ZSBleHRlbmRzIERvbVF1ZXVlIHtcclxuICAvLyBSZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSBET00gaW1hZ2VzIHF1ZXVlIGFuZCBoYW5kbGUgdGhlIHRyYW5zaXRpb24uXHJcbiAgcmVtb3ZlUXVldWVJdGVtKGlkeCwgZG9UcmFucykge1xyXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICBpZiAoaWR4ID09PSAwKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsZXRlRG9tUShpZHgpO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBCYXNlUXVlc3Rpb25zUXVldWUgfSBmcm9tIFwiLi4vYmFzZVF1ZXN0aW9uc1F1ZXVlLm1qc1wiO1xyXG5pbXBvcnQgeyBTaW5nbGVEb21RdWV1ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL3NpbmdsZURvbVF1ZXVlLm1qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2luZ2xlUXVlc3Rpb25RdWV1ZSBleHRlbmRzIEJhc2VRdWVzdGlvbnNRdWV1ZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHFNb2RlTWFpbkRpdiwgY2F0ZWdvcnlUeXBlID0gbnVsbCwgY2F0ZWdvcnkgPSBudWxsKSB7XHJcbiAgICBzdXBlcihxTW9kZU1haW5EaXYsIGNhdGVnb3J5VHlwZSwgY2F0ZWdvcnkpO1xyXG5cclxuICAgIHRoaXMuX2RvbVF1ZXVlID0gbmV3IFNpbmdsZURvbVF1ZXVlKHFNb2RlTWFpbkRpdiwgY2F0ZWdvcnlUeXBlLCBjYXRlZ29yeSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUocXVlc3Rpb24pIHtcclxuICAgIHRoaXMuX3Jlc2V0UXVldWUoKTtcclxuICAgIHRoaXMuX2FkZFRvUXVldWUoW3F1ZXN0aW9uXSk7XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgZmFkZUluLCBmYWRlT3V0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhZGVUcmFuc2l0aW9ucy5tanNcIjtcclxuaW1wb3J0IHsgQW5zd2VyVUlQYW5lbCB9IGZyb20gXCIuL2NvbXBvbmVudHMvYW5zd2VyVWlQYW5lbC5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uc01vZGUgZXh0ZW5kcyBFdmVudFRhcmdldCB7XHJcbiAgbWFpbkRpdjtcclxuICBhbnN3ZXJVaVBhbmVsO1xyXG4gIHF1ZXN0aW9uc1F1ZXVlO1xyXG4gIGJ0bjtcclxuXHJcbiAgY29uc3RydWN0b3IobWFpbkRpdiwgYnRuID0gbnVsbCkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMubWFpbkRpdiA9IG1haW5EaXY7XHJcbiAgICB0aGlzLmJ0biA9IGJ0bjtcclxuICAgIHRoaXMuYW5zd2VyVWlQYW5lbCA9IG5ldyBBbnN3ZXJVSVBhbmVsKG1haW5EaXYpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyB1cCB0aGUgYW5zd2VyIFVJIHBhbmVsIGJ1dHRvbiBldmVudCBsaXN0ZW5lcnMuXHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMuYW5zd2VyVWlQYW5lbC5yYXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLmFuc3dlclF1ZXN0aW9uKGV2dCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuYW5zd2VyVWlQYW5lbC5za2lwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLmFuc3dlclF1ZXN0aW9uKGV2dCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFBhc3NlcyB0aGUgYWxsUmVjZW50QW5zd2VycyBvbiB0byB0aGUgcXVlc3Rpb25zIHF1ZXVlLlxyXG4gIHNldFJlY2VudEFuc3dlcnMoYWxsUmVjZW50QW5zd2Vycykge1xyXG4gICAgdGhpcy5xdWVzdGlvbnNRdWV1ZS5zZXRSZWNlbnRBbnN3ZXJzKGFsbFJlY2VudEFuc3dlcnMpO1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlcyB0aGUgZGlzcGxheWVkIHF1ZXN0aW9uIGluIHRoZSBhbnN3ZXIgVUkgcGFuZWwgd2l0aCB0aGUgbmV3IGZpcnN0IFxyXG4gIC8vIHF1ZXVlIGl0ZW0uXHJcbiAgX3Nob3dDdXJyUShpbmNsQWxyZWFkeUFuc3dlcmVkID0gdHJ1ZSkge1xyXG4gICAgLy8gR2V0cyBpbmZvcm1hdGlvbiBvbiB3aGV0aGVyIHF1ZXVlIGlzIG5vdyBlbXB0eSwgb3Igd2hhdCB0aGUgbmV4dCAxMCBcclxuICAgIC8vIHF1ZXVlIGl0ZW1zIChhbmQgZmlyc3QgcXVlc3Rpb24gdXNlciBhbnN3ZXIsIGlmIG5lY2Vzc2FyeSkgc2hvdWxkIGJlLlxyXG4gICAgY29uc3QgbmV3Q3VyclFJbmZvID0gdGhpcy5xdWVzdGlvbnNRdWV1ZS5nZXRDdXJyUUluZm8oKTtcclxuXHJcbiAgICB0aGlzLmFuc3dlclVpUGFuZWwuZGlzcGxheUN1cnJRKG5ld0N1cnJRSW5mbywgaW5jbEFscmVhZHlBbnN3ZXJlZCk7XHJcbiAgfVxyXG5cclxuICAvLyBHZXRzIGN1cnJlbnQgYW5zd2VyIHRvIGN1cnJlbnQgcXVlc3Rpb24gYXMgYW4gb2JqZWN0IGZvciBEQi5cclxuICBnZXRBbnN3ZXJPYmooZXZlbnQsIGN1cnJRdWVzdGlvbikge1xyXG4gICAgY29uc3QgdXNlclNraXBwZWQgPSAoZXZlbnQuY3VycmVudFRhcmdldCA9PT0gdGhpcy5hbnN3ZXJVaVBhbmVsLnNraXBCdG4pO1xyXG4gICAgY29uc3QgdGhpc1Njb3JlID0gKHVzZXJTa2lwcGVkID8gbnVsbCA6IE51bWJlcih0aGlzLmFuc3dlclVpUGFuZWwuXHJcbiAgICAgIHNjb3JlU2xpZGVySW5wdXQudmFsdWUpKTtcclxuICAgICAgXHJcbiAgICBjb25zdCBxdWVzdGlvbkRldGFpbHMgPSB0aGlzLl9nZXRRdWVzdGlvbkRldGFpbHMoY3VyclF1ZXN0aW9uKTtcclxuXHJcbiAgICBjb25zdCBhbnN3ZXJJbmZvID0ge1xyXG4gICAgICBxdWVzdGlvbklkOiBjdXJyUXVlc3Rpb24uX2lkLFxyXG4gICAgICBza2lwOiB1c2VyU2tpcHBlZCxcclxuICAgICAgcXVlc3Rpb25EZXRhaWxzOiBxdWVzdGlvbkRldGFpbHNcclxuICAgIH07XHJcbiAgXHJcbiAgICBpZiAoIXVzZXJTa2lwcGVkKSB7XHJcbiAgICAgIGFuc3dlckluZm8uYW5zd2VyVmFsID0gdGhpc1Njb3JlO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYW5zd2VySW5mbztcclxuICB9XHJcblxyXG4gIC8vIEdldHMgYWxsIHRoZSBxdWVzdGlvbiBkZXRhaWxzIChlZy4gdGl0bGUsIHJlbGVhc2UgZGF0ZSBldGMuKSBmb3IgdGhlIGN1cnJlbnQgXHJcbiAgLy8gcXVlc3Rpb24gaW4gYW4gb2JqZWN0IHRvIGJlIGFkZGVkIHRvIHRoZSBhbnN3ZXJzIG9iamVjdCwgdG8gYmUgYWRkZWQgdG8gdGhlIERCLlxyXG4gIF9nZXRRdWVzdGlvbkRldGFpbHMoY3VyclF1ZXN0aW9uKSB7XHJcbiAgICBjb25zdCBxdWVzdGlvbkRldGFpbHMgPSB7fTtcclxuICAgIGNvbnN0IHByb3BzVG9JZ25vcmUgPSBbXCJfaWRcIiwgXCJhcGlQYWdlTnVtXCIsIFwiYWxyZWFkeUluRGJcIiwgXCJjdXJyQW5zXCJdO1xyXG5cclxuICAgIGZvciAobGV0IHByb3AgaW4gY3VyclF1ZXN0aW9uKSB7XHJcbiAgICAgIGNvbnN0IGlnbm9yZVByb3AgPSBwcm9wc1RvSWdub3JlLmluY2x1ZGVzKHByb3ApO1xyXG4gICAgICBpZiAoaWdub3JlUHJvcCkgY29udGludWU7XHJcbiAgICAgIHF1ZXN0aW9uRGV0YWlsc1twcm9wXSA9IGN1cnJRdWVzdGlvbltwcm9wXTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHF1ZXN0aW9uRGV0YWlscztcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKCkge1xyXG4gICAgaWYgKHRoaXMuYnRuKSB7XHJcbiAgICAgIHRoaXMuYnRuLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmUtcS1tb2RlXCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmYWRlSW4odGhpcy5tYWluRGl2KTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoKSB7XHJcbiAgICBpZiAodGhpcy5idG4pIHtcclxuICAgICAgdGhpcy5idG4uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZS1xLW1vZGVcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIGZhZGVPdXQodGhpcy5tYWluRGl2KTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBRdWVzdGlvbnNNb2RlIH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uc01vZGUubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBRTW9kZVdpdGhRdWV1ZUlucHV0IGV4dGVuZHMgUXVlc3Rpb25zTW9kZSB7XHJcbiAgcXVldWVJbnB1dFBhbmVsO1xyXG5cclxuICAvLyBTYXZlIGFuc3dlciBpbmZvcm1hdGlvbiwgdXBkYXRlIHRoZSBxdWV1ZSBpZiBuZWNlc3NhcnkuXHJcbiAgYXN5bmMgYW5zd2VyUXVlc3Rpb24oZXZlbnQpIHtcclxuICAgIGNvbnN0IGN1cnJRdWVzdGlvbiA9IHRoaXMucXVlc3Rpb25zUXVldWUucmVtb3ZlUXVldWVJdGVtKDAsIHRydWUpO1xyXG5cclxuICAgIHRoaXMucXVlc3Rpb25zUXVldWUuc2F2ZVByZXZRKGN1cnJRdWVzdGlvbi5faWQpO1xyXG5cclxuICAgIC8vIEdldCB0aGUgYW5zd2VyIG9iamVjdCBhcyBpdCBzaG91bGQgYmUgc3RvcmVkIGluIHRoZSBEQi5cclxuICAgIGNvbnN0IGFuc3dlck9iaiA9IHRoaXMuZ2V0QW5zd2VyT2JqKGV2ZW50LCBjdXJyUXVlc3Rpb24pO1xyXG5cclxuICAgIC8vIEVtaXQgZXZlbnQgdG8gYmUgcGlja2VkIHVwIGJ5IHRoZSBxdWVzdGlvbnMgcGFnZS5cclxuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChcclxuICAgICAgbmV3IEN1c3RvbUV2ZW50KFwiYW5zd2VyZWRRXCIsIHtkZXRhaWw6IHthbnN3ZXJPYmo6IGFuc3dlck9ian19KVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBVcGRhdGVzIHRoZSBkaXNwbGF5ZWQgcXVlc3Rpb24gaW4gdGhlIGFuc3dlciBVSSBwYW5lbCB3aXRoIHRoZSBuZXcgZmlyc3QgXHJcbiAgICAvLyBxdWV1ZSBpdGVtLlxyXG4gICAgdGhpcy5fc2hvd0N1cnJRKCk7XHJcblxyXG4gICAgLy8gQWRkcyBtb3JlIHF1ZXN0aW9ucyB0byB0aGUgcXVlc3Rpb25zIHF1ZXVlIGlmIG5lY2Vzc2FyeS5cclxuICAgIGxldCBxdWV1ZVVwZGF0ZWQgPSBhd2FpdCB0aGlzLnF1ZXN0aW9uc1F1ZXVlLnVwZGF0ZSgpO1xyXG4gICAgaWYgKHF1ZXVlVXBkYXRlZCkge1xyXG4gICAgICB0aGlzLnF1ZXN0aW9uc1F1ZXVlLmNoZWNrRm9yT3V0ZGF0ZWRRcyh0cnVlKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGVzIHRoZSBkaXNwbGF5ZWQgcXVlc3Rpb24gaW4gdGhlIGFuc3dlciBVSSBwYW5lbCB3aXRoIHRoZSBuZXcgZmlyc3QgXHJcbiAgLy8gcXVldWUgaXRlbS4gXHJcbiAgX3Nob3dDdXJyUSgpIHtcclxuICAgIGNvbnN0IGluY2xBbHJlYWR5QW5zd2VyZWQgPSB0aGlzLnF1ZXVlSW5wdXRQYW5lbD8uXHJcbiAgICAgIGluY2x1ZGVBbHJlYWR5QW5zd2VyZWRDaGVja2JveC5jaGVja2VkO1xyXG5cclxuICAgIHN1cGVyLl9zaG93Q3VyclEoaW5jbEFscmVhZHlBbnN3ZXJlZCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBhY3RpdmF0ZSgpIHtcclxuICAgIHN1cGVyLmFjdGl2YXRlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGVzIHRoZSBxdWVzdGlvbnMgcXVldWUgYW5kIHRoZW4gZGlzcGxheXMgdGhlIGZpcnN0IHF1ZXN0aW9uIG9mIGl0LCBcclxuICAvLyBjYWxsZWQgd2hlbiBzd2l0Y2hpbmcgdG8gdGhpcyBxdWVzdGlvbnMgbW9kZS5cclxuICBhc3luYyB1cGRhdGVRdWV1ZUFuZFNob3dGaXJzdChpc05ld1F1ZXVlID0gZmFsc2UpIHtcclxuICAgIHRoaXMuYW5zd2VyVWlQYW5lbC5zaG93TG9hZGVyKCk7XHJcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZVF1ZXVlKGlzTmV3UXVldWUpO1xyXG4gICAgdGhpcy5hbnN3ZXJVaVBhbmVsLmhpZGVMb2FkZXIoKTtcclxuICAgIHRoaXMuX3Nob3dDdXJyUSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlcyB0aGUgcXVlc3Rpb25zIHF1ZXVlLlxyXG4gIGFzeW5jIHVwZGF0ZVF1ZXVlKGlzTmV3UXVldWUpIHtcclxuICAgIC8vIFF1ZXVlIHdpbGwgb25seSB1cGRhdGUgaWYgaXQncyBzaG9ydCBvbiBhbnN3ZXJzLlxyXG4gICAgYXdhaXQgdGhpcy5xdWVzdGlvbnNRdWV1ZS51cGRhdGUoaXNOZXdRdWV1ZSk7XHJcblxyXG4gICAgLy8gQ2hlY2tzIHRoZSBxdWV1ZSB0byBzZWUgaWYgYW55IHF1ZXN0aW9ucyBpbiBpdCBhcmUgbm93IG91dGRhdGVkIGJhc2VkIG9uIFxyXG4gICAgLy8gcmVjZW50bHkgUE9TVGVkIGFuc3dlcnMgb3IgcmVjZW50IGFuc3dlcnMgZnJvbSBvdGhlciBxdWVzdGlvbnMgbW9kZXMgdGhhdCBcclxuICAgIC8vIGhhdmVuJ3QgeWV0IGJlZW4gUE9TVGVkLlxyXG4gICAgdGhpcy5xdWVzdGlvbnNRdWV1ZS5jaGVja0Zvck91dGRhdGVkUXMoKTtcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBRdWVzdGlvbnNNb2RlIH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uc01vZGUubWpzXCI7XHJcblxyXG5pbXBvcnQgeyBTaW5nbGVRdWVzdGlvblF1ZXVlIH0gZnJvbSBcIi4uLy4uL2NvbXBvbmVudHMvYmFzZVF1ZXN0aW9uc1F1ZXVlL1xcXHJcbnN1Yi1jbGFzc2VzL3NpbmdsZVF1ZXN0aW9uUXVldWUubWpzXCI7XHJcblxyXG5pbXBvcnQgeyBDZW50cmVNb2RhbCB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9jZW50cmVNb2RhbC5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNpbmdsZUFuc3dlck1vZGUgZXh0ZW5kcyBRdWVzdGlvbnNNb2RlIHtcclxuICBuYW1lID0gXCJzaW5nbGVcIjtcclxuICBfcVNvdXJjZTtcclxuICBfYW5zd2VyVWlNb2RhbDtcclxuXHJcbiAgY29uc3RydWN0b3IobWFpbkRpdiwgcVNvdXJjZSwgYnRuID0gbnVsbCkge1xyXG4gICAgc3VwZXIobWFpbkRpdiwgYnRuKTtcclxuICAgIHRoaXMucXVlc3Rpb25zUXVldWUgPSBuZXcgU2luZ2xlUXVlc3Rpb25RdWV1ZShtYWluRGl2KTtcclxuICAgIHRoaXMuX3FTb3VyY2UgPSBxU291cmNlO1xyXG5cclxuICAgIGNvbnN0IG1vZGFsV3JhcHBlciA9IG1haW5EaXYucXVlcnlTZWxlY3RvcihcIi5jZW50cmUtbW9kYWwtd3JhcHBlclwiKTtcclxuICAgIHRoaXMuX2Fuc3dlclVpTW9kYWwgPSBuZXcgQ2VudHJlTW9kYWwobW9kYWxXcmFwcGVyKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICBzdXBlci5pbml0KCk7XHJcblxyXG4gICAgdGhpcy5fcVNvdXJjZS5hZGRFdmVudExpc3RlbmVyKFwiYW5zd2VyU2luZ2xlUVwiLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLl9oYW5kbGVDbGlja1NpbmdsZVEoZXZ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX2Fuc3dlclVpTW9kYWwuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2F2ZSBhbnN3ZXIgaW5mb3JtYXRpb24uXHJcbiAgYW5zd2VyUXVlc3Rpb24oZXZlbnQpIHtcclxuICAgIGNvbnN0IGN1cnJRdWVzdGlvbiA9IHRoaXMucXVlc3Rpb25zUXVldWUucmVtb3ZlUXVldWVJdGVtKDAsIHRydWUpO1xyXG5cclxuICAgIC8vIEdldCB0aGUgYW5zd2VyIG9iamVjdCBhcyBpdCBzaG91bGQgYmUgc3RvcmVkIGluIHRoZSBEQi5cclxuICAgIGNvbnN0IGFuc3dlck9iaiA9IHRoaXMuZ2V0QW5zd2VyT2JqKGV2ZW50LCBjdXJyUXVlc3Rpb24pOyBcclxuXHJcbiAgICAvLyBFbWl0IGV2ZW50IHRvIGJlIHBpY2tlZCB1cCBieSB0aGUgcXVlc3Rpb25zIHBhZ2UuXHJcbiAgICB0aGlzLmRpc3BhdGNoRXZlbnQoXHJcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImFuc3dlcmVkUVwiLCB7ZGV0YWlsOiB7YW5zd2VyT2JqOiBhbnN3ZXJPYmp9fSlcclxuICAgICk7XHJcblxyXG4gICAgLy8gSGlkZSB0aGUgYW5zd2VyIHVpIHBhbmVsLlxyXG4gICAgdGhpcy5fYW5zd2VyVWlNb2RhbC5oaWRlKCk7XHJcblxyXG4gICAgcmV0dXJuIGFuc3dlck9iajtcclxuICB9XHJcblxyXG4gIF9oYW5kbGVDbGlja1NpbmdsZVEoZXZ0KSB7XHJcbiAgICAvLyBHZXQgdGhlIHF1ZXN0aW9uIGZyb20gdGhpcyBpdGVtIGFuZCBtYWtlIGl0IHRoZSBxdWV1ZSBjb250ZW50cy5cclxuICAgIGNvbnN0IHRoaXNRSXRlbSA9IGV2dC5kZXRhaWwucXVlc3Rpb247XHJcbiAgICBjb25zdCB0aGlzUXVlc3Rpb24gPSB0aGlzLl9tYWtlUXVlc3Rpb24odGhpc1FJdGVtKTtcclxuICAgIHRoaXMucXVlc3Rpb25zUXVldWUudXBkYXRlKHRoaXNRdWVzdGlvbik7XHJcblxyXG4gICAgLy8gU2hvdyB0aGUgYW5zd2VyIHVpIHBhbmVsLlxyXG4gICAgdGhpcy5fYW5zd2VyVWlNb2RhbC5zaG93KCk7XHJcblxyXG4gICAgLy8gVXBkYXRlcyB0aGUgZGlzcGxheWVkIHF1ZXN0aW9uIGluIHRoZSBhbnN3ZXIgVUkgcGFuZWwgd2l0aCB0aGUgbmV3IGZpcnN0IFxyXG4gICAgLy8gcXVldWUgaXRlbS5cclxuICAgIHRoaXMuX3Nob3dDdXJyUSgpO1xyXG4gIH1cclxufSIsImltcG9ydCB7IFNpbmdsZUFuc3dlck1vZGUgfSBmcm9tIFwiLi4vc2luZ2xlQW5zd2VyTW9kZS5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFJlY29tbWVuZGF0aW9uc01vZGUgZXh0ZW5kcyBTaW5nbGVBbnN3ZXJNb2RlIHtcclxuICBuYW1lID0gXCJyZWNzXCI7XHJcblxyXG4gIC8vIEFsc28gcmVtb3ZlIHRoZSBhbnN3ZXJlZCBxdWVzdGlvbiBmcm9tIHRoZSByZWNvbW1lbmRhdGlvbnMgbGlzdC5cclxuICBhbnN3ZXJRdWVzdGlvbihldmVudCkge1xyXG4gICAgY29uc3QgdGhpc0FucyA9IHN1cGVyLmFuc3dlclF1ZXN0aW9uKGV2ZW50KTtcclxuXHJcbiAgICAvLyBSZW1vdmUgdGhpcyBhbnN3ZXJlZCBxdWVzdGlvbiBmcm9tIHRoZSByZWNvbW1lbmRhdGlvbnMgbGlzdCwgaWYgdXNlciBcclxuICAgIC8vIGRpZG4ndCBza2lwIGl0LlxyXG4gICAgaWYgKCF0aGlzQW5zLnNraXApIHtcclxuICAgICAgdGhpcy5fcVNvdXJjZS5yZW1vdmVBbnN3ZXJlZFEoKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBNYWtlcyBhIHF1ZXN0aW9uLCByZWFkeSB0byBiZSBzaG93biBpbiB0aGUgYW5zd2VyVWlQYW5lbCwgZnJvbSB0aGUgY2xpY2tlZCBcclxuICAvLyBvbiBxdWVzdGlvbi5cclxuICBfbWFrZVF1ZXN0aW9uKHFJdGVtKSB7XHJcbiAgICBjb25zdCB0aGlzUSA9IHtcclxuICAgICAgX2lkOiBxSXRlbS5xdWVzdGlvbklkLFxyXG4gICAgICBjYXRlZ29yeVR5cGVOYW1lOiBxSXRlbS5jYXRlZ29yeVR5cGUsXHJcbiAgICAgIGNhdGVnb3J5TmFtZTogcUl0ZW0uY2F0ZWdvcnlcclxuICAgIH07XHJcblxyXG4gICAgZm9yIChsZXQgcHJvcCBpbiBxSXRlbS5xdWVzdGlvbkRldGFpbHMpIHtcclxuICAgICAgdGhpc1FbcHJvcF0gPSBxSXRlbS5xdWVzdGlvbkRldGFpbHNbcHJvcF1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRoaXNRO1xyXG4gIH1cclxufSIsIi8vIFJldHVybnMgdGhlIGNhdGVnb3J5IGFuZCB0eXBlIGZvciBhIGdpdmVuIHF1ZXN0aW9uIGFuZCBvYmplY3QuIElmIG9iamVjdCBoYXMgXHJcbi8vIG5vIGNhdGVnb3J5IHRoZW4gdXNlIHRoYXQgb2YgdGhlIHF1ZXN0aW9uLiBVc2VkIG9uIGJhc2VRdWVzdGlvbnMgUXVldWUgYW5kIFxyXG4vLyBzaW5nbGVNb2RlUVNvdXJjZS5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFFDYXRlZ29yeShxLCBvYmpDYXRUeXBlLCBvYmpDYXQpIHtcclxuICByZXR1cm4gKG9iakNhdCkgPyBbb2JqQ2F0VHlwZSwgb2JqQ2F0XSA6IFxyXG4gICAgW3EuY2F0ZWdvcnlUeXBlTmFtZSA/PyBxLmNhdGVnb3J5VHlwZSwgcS5jYXRlZ29yeU5hbWUgPz8gcS5jYXRlZ29yeV07XHJcbn1cclxuXHJcbi8vIEdldHMgdGhlIGNvcnJlY3QgaW1hZ2UgcGF0aCwgZGVwZW5kaW5nIG9uIHRoZSBjYXRlZ29yeS5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFFJbmZvKHEsIGRldGFpbCwgY2F0VHlwZU5hbWUsIGNhdE5hbWUpIHtcclxuICBsZXQgaW5mbztcclxuXHJcbiAgc3dpdGNoKGNhdFR5cGVOYW1lLCBjYXROYW1lKSB7XHJcblxyXG4gICAgY2FzZSAoXCJJbnRlcmVzdHNcIiwgXCJGaWxtc1wiKSA6XHJcbiAgICAgIGluZm8gPSB7XHJcbiAgICAgICAgaW1nUGF0aDogcT8ucG9zdGVyUGF0aCA/IGBodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LyR7cS5wb3N0ZXJQYXRofWAgOiBudWxsLFxyXG4gICAgICAgIHFEaXNwbGF5VGV4dDogYCR7cT8udGl0bGV9ICgke2dldERpc3BsYXlSZWxlYXNlRGF0ZShxPy5yZWxlYXNlRGF0ZSl9KWAsXHJcbiAgICAgICAgcVNvdXJjZURpc3BsYXlUZXh0OiBgJHtxPy50aXRsZX1gLFxyXG4gICAgICAgIGltZ1BsYWNlSG9sZGVyVHh0OiBgJHtxPy50aXRsZX1gXHJcbiAgICAgIH07XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGNhc2UgKFwiSW50ZXJlc3RzXCIsIFwiVFZcIikgOlxyXG4gICAgICBpbmZvID0ge1xyXG4gICAgICAgIGltZ1BhdGg6IHE/LnBvc3RlclBhdGggPyBgaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzE4NS8ke3EucG9zdGVyUGF0aH1gIDogbnVsbCxcclxuICAgICAgICBxRGlzcGxheVRleHQ6IGAke3E/LnRpdGxlfSAoJHtnZXREaXNwbGF5UmVsZWFzZURhdGUocT8ucmVsZWFzZURhdGUpfSlgLFxyXG4gICAgICAgIHFTb3VyY2VEaXNwbGF5VGV4dDogYCR7cT8udGl0bGV9YCxcclxuICAgICAgICBpbWdQbGFjZUhvbGRlclR4dDogYCR7cT8udGl0bGV9YFxyXG4gICAgICB9O1xyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBjYXNlIChcIkludGVyZXN0c1wiLCBcIk11c2ljXCIpOlxyXG4gICAgICBpbmZvID0ge1xyXG4gICAgICAgIGltZ1BhdGg6IHE/LmltYWdlLFxyXG4gICAgICAgIHFEaXNwbGF5VGV4dDogYCR7cT8udHJhY2tOYW1lfSAtICR7cT8uYXJ0aXN0fSAoJHtxPy5hbGJ1bX0gLSAke25ldyBEYXRlKHE/LnJlbGVhc2VEYXRlKS5nZXRGdWxsWWVhcigpfSlgLFxyXG4gICAgICAgIHFTb3VyY2VEaXNwbGF5VGV4dDogYCR7cT8udHJhY2tOYW1lfSAtICR7cT8uYXJ0aXN0fWAsXHJcbiAgICAgICAgaW1nUGxhY2VIb2xkZXJUeHQ6IGAke3E/LnRyYWNrTmFtZX1gXHJcbiAgICAgIH07XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGNhc2UgKFwiSW50ZXJlc3RzXCIsIFwiVmlkZW8gR2FtZXNcIik6XHJcbiAgICAgIGluZm8gPSB7XHJcbiAgICAgICAgaW1nUGF0aDogcT8uaW1hZ2UgPyBgaHR0cHM6Ly9pbWFnZXMuaWdkYi5jb20vaWdkYi9pbWFnZS91cGxvYWQvdF9jb3Zlcl9iaWcvJHtxLmltYWdlfS5qcGdgIDogbnVsbCxcclxuICAgICAgICBxRGlzcGxheVRleHQ6IGAke3E/LnRpdGxlfSAoJHtnZXREaXNwbGF5UmVsZWFzZURhdGUocT8ucmVsZWFzZURhdGUpfSkgKCR7cS5wbGF0Zm9ybXN9KWAsXHJcbiAgICAgICAgcVNvdXJjZURpc3BsYXlUZXh0OiBgJHtxPy50aXRsZX1gLFxyXG4gICAgICAgIGltZ1BsYWNlSG9sZGVyVHh0OiBgJHtxPy50aXRsZX1gXHJcbiAgICAgIH07XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGNhc2UgKFwiSW50ZXJlc3RzXCIsIFwiQm9va3NcIik6XHJcbiAgICAgIGluZm8gPSB7XHJcbiAgICAgICAgaW1nUGF0aDogcT8uaW1hZ2UgPyBgaHR0cHM6Ly9jb3ZlcnMub3BlbmxpYnJhcnkub3JnL2IvaWQvJHtxLmltYWdlfS1NLmpwZ2AgOiBudWxsLFxyXG4gICAgICAgIHFEaXNwbGF5VGV4dDogYCR7cT8udGl0bGV9ICgke3E/LmF1dGhvcn0pYCxcclxuICAgICAgICBxU291cmNlRGlzcGxheVRleHQ6IGAke3E/LnRpdGxlfWAsXHJcbiAgICAgICAgaW1nUGxhY2VIb2xkZXJUeHQ6IGAke3E/LnRpdGxlfWBcclxuICAgICAgfTtcclxuICAgICAgYnJlYWs7XHJcblxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgaW5mbyA9IHtcclxuICAgICAgICBpbWdQYXRoOiBudWxsLFxyXG4gICAgICAgIHFEaXNwbGF5VGV4dDogcT8udGV4dCxcclxuICAgICAgICBxU291cmNlRGlzcGxheVRleHQ6IHE/LnNob3J0VGV4dCxcclxuICAgICAgICBpbWdQbGFjZUhvbGRlclR4dDogcT8uc2hvcnRUZXh0ID8/IHEudGV4dFxyXG4gICAgICB9O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBpbmZvW2RldGFpbF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERpc3BsYXlSZWxlYXNlRGF0ZShyZWxlYXNlRGF0ZSkge1xyXG4gIHJldHVybiByZWxlYXNlRGF0ZSA/IG5ldyBEYXRlKHJlbGVhc2VEYXRlKS5nZXRGdWxsWWVhcigpIDogXCJVbmtub3duXCI7XHJcbn1cclxuXHJcbi8vIFVzZWQgaW4gdGhlIGRvbSBxdWV1ZSBmb3IgYW5zd2VyaW5nIHF1ZXN0aW9ucyAoc2VhcmNoIGFuZCBhdXRvKSBhbmQgYWxzbyBpbiBcclxuLy8gcHJldiBhbnN3ZXJzIGFuZCByZWNvbW1lbmRhdGlvbnMgcGFnZXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVRRG9tSXRlbShxLCBjYXRUeXBlTmFtZSwgY2F0TmFtZSwgbGF6eUxvYWQgPSB0cnVlKSB7XHJcbiAgY29uc3QgbmV3RG9tUSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7O1xyXG5cclxuICBjb25zdCBpbWdQYXRoID0gZ2V0UUluZm8ocSwgXCJpbWdQYXRoXCIsIGNhdFR5cGVOYW1lLCBjYXROYW1lKTtcclxuICBcclxuICBpZiAoaW1nUGF0aCkge1xyXG4gICAgY29uc3QgZG9tSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgIGRvbUltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgaW1nUGF0aCk7XHJcbiAgICBpZiAobGF6eUxvYWQpIGRvbUltZy5zZXRBdHRyaWJ1dGUoXCJsb2FkaW5nXCIsIFwibGF6eVwiKTtcclxuXHJcbiAgICBkb21JbWcuc2V0QXR0cmlidXRlKFwiYWx0XCIsIHE/LnRpdGxlKTtcclxuICAgIG5ld0RvbVEuYXBwZW5kQ2hpbGQoZG9tSW1nKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBjb25zdCBub0ltZ0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBub0ltZ0Rpdi5jbGFzc0xpc3QuYWRkKFwicGxhY2Vob2xkZXItaW1nXCIpO1xyXG4gICAgY29uc3Qgbm9JbWdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBjb25zdCBwbGFjZWhvbGRlclRleHQgPSBnZXRRSW5mbyhxLCBcImltZ1BsYWNlSG9sZGVyVHh0XCIsIGNhdFR5cGVOYW1lLCBjYXROYW1lKTtcclxuICAgIG5vSW1nVGV4dC5pbm5lclRleHQgPSBwbGFjZWhvbGRlclRleHQ7XHJcblxyXG4gICAgbm9JbWdEaXYuYXBwZW5kQ2hpbGQobm9JbWdUZXh0KTtcclxuICAgIG5ld0RvbVEuYXBwZW5kQ2hpbGQobm9JbWdEaXYpO1xyXG4gIH07XHJcblxyXG4gIGlmIChxLnByZXZpZXdVcmwpIHtcclxuICAgIGNvbnN0IGRvbU11c2ljUGxheWVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpO1xyXG4gICAgZG9tTXVzaWNQbGF5ZXIuc2V0QXR0cmlidXRlKFwiY29udHJvbHNcIiwgXCJ0cnVlXCIpO1xyXG4gICAgZG9tTXVzaWNQbGF5ZXIuc2V0QXR0cmlidXRlKFwic3JjXCIsIHEucHJldmlld1VybCk7XHJcbiAgICBuZXdEb21RLmFwcGVuZENoaWxkKGRvbU11c2ljUGxheWVyKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gbmV3RG9tUTtcclxufSIsImltcG9ydCB7IGZpbmlzaEZhZGVPdXQgfSBmcm9tIFwiLi4vLi4vZmFkZVRyYW5zaXRpb25zLm1qc1wiO1xyXG5pbXBvcnQgeyBmaW5kQW5kT3ZlcndyaXRlRWxzZVB1c2ggfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2hhcmVkSnMvdXRpbHMubWpzXCI7XHJcblxyXG5pbXBvcnQgeyBRTW9kZVdpdGhRdWV1ZUlucHV0IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9zdWItY2xhc3Nlcy9cXFxyXG5xTW9kZVdpdGhRdWV1ZUlucHV0L3FNb2RlV2l0aFF1ZXVlSW5wdXQubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbnNQYWdlIHtcclxuICAjc3dpdGNoaW5nTW9kZSA9IGZhbHNlO1xyXG4gIHF1ZXN0aW9uc01vZGVzO1xyXG4gIHFNb2RlU3dpdGNoZXI7XHJcbiAgY3VyclF1ZXN0aW9uTW9kZTtcclxuICBjYXRlZ29yeVR5cGVOYW1lO1xyXG4gIGNhdGVnb3J5TmFtZTtcclxuICAvLyBOZXcgYW5zd2VycyB0aGF0IGhhdmUgbm90IHlldCBiZWVuIFBPU1RlZCB0byBzZXJ2ZXIuXHJcbiAgbm90WWV0UG9zdGVkQW5zd2VycyA9IFtdO1xyXG4gIC8vIFRoZSBub3QgeWV0IFBPU1RlZCBhbnN3ZXJzIHBsdXMgYW55IGFuc3dlcnMgdGhhdCBhcmUgUE9TVGVkIGJ1dCB0aGUgc2F2ZSBcclxuICAvLyBvbiBiYWNrIGVuZCBoYXNuJ3QgY29tcGxldGVkIHlldC5cclxuICBhbGxSZWNlbnRBbnN3ZXJzID0gW107XHJcbiAgc3RhdGljICNzdWJtaXRBbnN3ZXJzSW50ZXJ2YWwgPSA2MDAwMDA7IC8vIDEwIG1pbnNcclxuXHJcbiAgY29uc3RydWN0b3IocU1vZGVzLCBxTW9kZVN3aXRjaGVyID0gW10sIGNhdGVnb3J5VHlwZU5hbWUgPSBudWxsLCBcclxuICAgIGNhdGVnb3J5TmFtZSA9IG51bGwpIHtcclxuXHJcbiAgICB0aGlzLnF1ZXN0aW9uc01vZGVzID0gcU1vZGVzO1xyXG4gICAgdGhpcy5xTW9kZVN3aXRjaGVyID0gcU1vZGVTd2l0Y2hlcjtcclxuICAgIHRoaXMuY2F0ZWdvcnlUeXBlTmFtZSA9IGNhdGVnb3J5VHlwZU5hbWU7XHJcbiAgICB0aGlzLmNhdGVnb3J5TmFtZSA9IGNhdGVnb3J5TmFtZTtcclxuICB9XHJcblxyXG4gIC8vIFNldCB1cCB0aGUgZXZlbnQgbGlzdGVuZXJzIGZvciBhbGwgYnV0dG9ucyBhbmQgcHJvdG9jb2wgZm9yIHVwbG9hZGluZyBcclxuICAvLyBhbnN3ZXJzIGRhdGEuXHJcbiAgaW5pdCgpIHtcclxuICAgIC8vIFNldCB1cCBldmVudCBsaXN0ZW5lcnMgZm9yIGJ1dHRvbnMgd2l0aGluIGVhY2ggcXVlc3Rpb25zIG1vZGUuXHJcbiAgICBmb3IgKGxldCBxTW9kZSBvZiB0aGlzLnF1ZXN0aW9uc01vZGVzKSB7XHJcbiAgICAgIHFNb2RlLmluaXQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gV2hlbiBxdWVzdGlvbnMgcGFnZSBpcyBsZWZ0IC8gdGFiIGNsb3NlZCwgcG9zdCBhbnkgYW5zd2VycyB0byB0aGUgc2VydmVyLlxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLl9wb3N0QW5zd2Vycyh0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFN1Ym1pdCBhbnN3ZXJzIGV2ZXJ5IDEwIG1pbnMsIGlmIHRoZXJlIGFyZSBhbnkuXHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuX3Bvc3RBbnN3ZXJzKGZhbHNlKTtcclxuICAgIH0sIFF1ZXN0aW9uc1BhZ2UuI3N1Ym1pdEFuc3dlcnNJbnRlcnZhbCk7XHJcblxyXG4gICAgLy8gTGlzdGVuIGZvciBldmVudHMgZW1pdHRlZCBieSBhbnkgcSBtb2RlIHdoZW4gYSBxdWVzdGlvbiBpcyBhbnN3ZXJlZC5cclxuICAgIGZvciAobGV0IHFNb2RlIG9mIHRoaXMucXVlc3Rpb25zTW9kZXMpIHtcclxuICAgICAgcU1vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImFuc3dlcmVkUVwiLCBldnQgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFuc3dlck9iaiA9IGV2dC5kZXRhaWwuYW5zd2VyT2JqO1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZU5ld0Fuc3dlcihhbnN3ZXJPYmopO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gSW5pdCB0aGUgcU1vZGVTd2l0Y2hlci5cclxuICAgIHRoaXMuI2luaXRRTW9kZVN3aXRjaGVyKCk7XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBxIG1vZGUgc3dpdGNoIGJ1dHRvbnMuXHJcbiAgI2luaXRRTW9kZVN3aXRjaGVyKCkge1xyXG4gICAgZm9yIChsZXQgbW9kZUJ0bkxpbmsgb2YgdGhpcy5xTW9kZVN3aXRjaGVyKSB7XHJcbiAgICAgIGNvbnN0IHFNb2RlQnRuID0gbW9kZUJ0bkxpbmsuYnRuO1xyXG4gICAgICBjb25zdCBxTW9kZSA9IG1vZGVCdG5MaW5rLm1vZGU7XHJcblxyXG4gICAgICBxTW9kZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIC8vIERvbid0IHRyeSB0byBzd2l0Y2ggbW9kZSBpZiBhbHJlYWR5IHRyYW5zaXRpb25pbmcgYmV0d2VlbiB0d28gb3IgaWYgXHJcbiAgICAgICAgLy8gY2xpY2tlZCBvbiBjdXJyZW50IHFNb2RlLlxyXG4gICAgICAgIGNvbnN0IGRvbnRTd2l0Y2hNb2RlID0gdGhpcy4jc3dpdGNoaW5nTW9kZSB8fCAodGhpcy5jdXJyUXVlc3Rpb25Nb2RlID09PSBxTW9kZSk7XHJcbiAgICAgICAgaWYgKGRvbnRTd2l0Y2hNb2RlKSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuI3N3aXRjaGluZ01vZGUgPSB0cnVlO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc3dpdGNoUU1vZGUocU1vZGUpXHJcbiAgICAgICAgdGhpcy4jc3dpdGNoaW5nTW9kZSA9IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFNhdmVzIChvciBvdmVyd3JpdGVzKSBuZXcgYW5zd2VyIHRvIG5vdFlldFBvc3RlZCBhbmQgYWxsUmVjZW50QW5zd2VycyBhbmQgXHJcbiAgLy8gdGhlbiBzZW5kcyB0aGUgdXBkYXRlZCByZWNlbnQgYW5zd2VycyBhcnJheSB0byB0aGUgY3VycmVudCBxdWVzdGlvbnMgbW9kZS5cclxuICBfaGFuZGxlTmV3QW5zd2VyKGFuc3dlck9iaikge1xyXG4gICAgdGhpcy5fdXBkYXRlQW5zQXJyYXlXaXRoQW5zKHRoaXMubm90WWV0UG9zdGVkQW5zd2VycywgYW5zd2VyT2JqKTtcclxuICAgIHRoaXMuX3VwZGF0ZUFuc0FycmF5V2l0aEFucyh0aGlzLmFsbFJlY2VudEFuc3dlcnMsIGFuc3dlck9iaik7XHJcbiAgICB0aGlzLl9zZXRSZWNlbnRBbnN3ZXJzKCk7XHJcbiAgfVxyXG5cclxuICAvLyBSZW1vdmUgY3VycmVudCBxdWVzdGlvbiBtb2RlOiBoaWRlIGl0LCBnZXQgdGhlIGxhdGVzdCBhbnN3ZXJzIGFuZCBwb3N0IFxyXG4gIC8vIHRoZW0gdG8gdGhlIHNlcnZlci5cclxuICByZW1vdmVRbW9kZSgpIHtcclxuICAgIHRoaXMuY3VyclF1ZXN0aW9uTW9kZS5kZWFjdGl2YXRlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdGhlIG5ldyBxdWVzdGlvbnMgbW9kZSBhbmQgc2hvdyBpdC5cclxuICBhc3luYyBzZXRRTW9kZShuZXdRTW9kZSkge1xyXG4gICAgdGhpcy5jdXJyUXVlc3Rpb25Nb2RlID0gbmV3UU1vZGU7XHJcbiAgICBhd2FpdCB0aGlzLmN1cnJRdWVzdGlvbk1vZGUuYWN0aXZhdGUoKTtcclxuXHJcbiAgICB0aGlzLl9zZXRSZWNlbnRBbnN3ZXJzKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuY3VyclF1ZXN0aW9uTW9kZSBpbnN0YW5jZW9mIFFNb2RlV2l0aFF1ZXVlSW5wdXQpIHtcclxuICAgICAgLy8gVXBkYXRlIHRoZSBxdWV1ZSBmb3IgdGhlIHF1ZXN0aW9ucyBtb2RlIGFuZCBzaG93IGZpcnN0IGl0ZW0gaW4gdGhlIHF1ZXVlLlxyXG4gICAgICBhd2FpdCB0aGlzLmN1cnJRdWVzdGlvbk1vZGUudXBkYXRlUXVldWVBbmRTaG93Rmlyc3QoKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBfc2V0UmVjZW50QW5zd2VycygpIHtcclxuICAgIC8vIERvbid0IG5lZWQgdG8ga2VlcCBhIGxpc3Qgb2YgcmVjZW50IGFuc3dlcnMgZm9yIHJlY29tbWVuZGF0aW9ucyBtb2RlLlxyXG4gICAgaWYgKHRoaXMuY3VyclF1ZXN0aW9uTW9kZT8ubmFtZSAhPT0gXCJyZWNzXCIpIHtcclxuICAgICAgdGhpcy5jdXJyUXVlc3Rpb25Nb2RlLnNldFJlY2VudEFuc3dlcnModGhpcy5hbGxSZWNlbnRBbnN3ZXJzKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGVzIGFuIG9yaWdBbnNBcnJheSB3aXRoIGEgbmV3IGFuc3dlciwgb3ZlcndyaXRpbmcgd2hlcmUgXHJcbiAgLy8gcHJlc2VudCBpbiB0aGUgb3JpZ0Fuc0FycmF5IChvdGhlcndpc2UgYWRkaW5nKS5cclxuICBfdXBkYXRlQW5zQXJyYXlXaXRoQW5zKG9yaWdBbnNBcnJheSwgbmV3QW5zKSB7XHJcbiAgICBjb25zdCBtYXRjaEZ1bmMgPSAoYXJySXRlbSwgbmV3SXRlbSkgPT4ge1xyXG4gICAgICByZXR1cm4gYXJySXRlbS5xdWVzdGlvbklkID09PSBuZXdJdGVtLnF1ZXN0aW9uSWRcclxuICAgIH07XHJcblxyXG4gICAgZmluZEFuZE92ZXJ3cml0ZUVsc2VQdXNoKG9yaWdBbnNBcnJheSwgbmV3QW5zLCBtYXRjaEZ1bmMpO1xyXG4gIH1cclxuXHJcbiAgLy8gU3dpdGNoIGJldHdlZW4gcXVlc3Rpb24gbW9kZXMuXHJcbiAgYXN5bmMgc3dpdGNoUU1vZGUobmV3UU1vZGUpIHtcclxuICAgIHRoaXMucmVtb3ZlUW1vZGUoKTtcclxuICAgIGF3YWl0IGZpbmlzaEZhZGVPdXQodGhpcy5jdXJyUXVlc3Rpb25Nb2RlLm1haW5EaXYpO1xyXG4gICAgYXdhaXQgdGhpcy5zZXRRTW9kZShuZXdRTW9kZSk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFJlc2V0cyB0aGUgbmV3IGFuZCB1cGRhdGVkIGFuc3dlcnMgZm9yIHRoaXMgcXVlc3Rpb25zIHBhZ2UuXHJcbiAgcmVzZXRBbnN3ZXJzKCkge1xyXG4gICAgdGhpcy5ub3RZZXRQb3N0ZWRBbnN3ZXJzID0gW107XHJcbiAgfVxyXG5cclxuICAvLyBPbmNlIHRoZSBmZXRjaCBQT1NUIG9mIHNvbWUgbmV3IGFuc3dlcnMgZXZlcnkgMTAgbWlucyBoYXMgYmVlbiBjb21wbGV0ZWQsIFxyXG4gIC8vIHVwZGF0ZSB0aGUgYWxsUmVjZW50QW5zd2VycyBzbyB0aGF0IHRoZSBxdWV1ZSBoYXMgbGVzcyB0byBtb2RpZnkuXHJcbiAgY2xlYXJSZWNlbnRseVBvc3RlZEFuc3dlcnMoc3VjY2Vzc1Bvc3RlZEFuc3dlcnMpIHtcclxuICAgIC8vIFJlbW92ZSBlYWNoIHN1Y2Nlc3NmdWxseSBQT1NUZWQgYW5zd2VyIGZyb20gdGhpcyBhbGxSZWNlbnRBbnN3ZXJzLlxyXG4gICAgZm9yIChsZXQgc3VjY2Vzc1Bvc3RlZEFuc3dlciBvZiBzdWNjZXNzUG9zdGVkQW5zd2Vycykge1xyXG4gICAgICBjb25zdCBmaW5kSW5kZXggPSBnZXRGaW5kSW5kZXgoc3VjY2Vzc1Bvc3RlZEFuc3dlciwgdGhpcy5hbGxSZWNlbnRBbnN3ZXJzKTtcclxuICAgICAgaWYgKGZpbmRJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgdGhpcy5hbGxSZWNlbnRBbnN3ZXJzLnNwbGljZShmaW5kSW5kZXgsIDEpO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gRmluZHMgdGhpcyBleGFjdCBhbnN3ZXIgaW4gdGhlIGFsbFJlY2VudEFuc3dlcnMgKHNhbWUgXHJcbiAgICAvLyBxdWVzdGlvbklkIG1heSBhcHBlYXIgbW9yZSB0aGFuIG9uY2Ugc28gb25seSBmaW5kIGV4YWN0IG1hdGNoIHdpdGggXHJcbiAgICAvLyBhbnN3ZXIgLyBza2lwIHZhbHVlIHRvbykuXHJcbiAgICBmdW5jdGlvbiBnZXRGaW5kSW5kZXgoc3VjY2Vzc1Bvc3RlZEFuc3dlciwgdXBkYXRlQW5zd2Vyc0FycmF5KSB7XHJcbiAgICAgIGNvbnN0IGZpbmRJbmRleCA9IHVwZGF0ZUFuc3dlcnNBcnJheS5maW5kSW5kZXgoYW5zID0+IHtcclxuICAgICAgICBsZXQgaXNNYXRjaCA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgcHJvcHNUb0NoZWNrID0gW1wicXVlc3Rpb25JZFwiLCBcInNraXBcIiwgXCJhbnN3ZXJWYWxcIl07XHJcblxyXG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gYW5zKSB7XHJcbiAgICAgICAgICBjb25zdCBza2lwUHJvcCA9ICFwcm9wc1RvQ2hlY2suaW5jbHVkZXMocHJvcCk7XHJcbiAgICAgICAgICBpZiAoc2tpcFByb3ApIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgIGlzTWF0Y2ggPSBhbnNbcHJvcF0gPT09IHN1Y2Nlc3NQb3N0ZWRBbnN3ZXJbcHJvcF07XHJcbiAgICAgICAgICBpZiAoIWlzTWF0Y2gpIGJyZWFrO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBpc01hdGNoO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBmaW5kSW5kZXg7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gUE9TVCB0aGVzZSBhbnN3ZXJzIGluZm8gdG8gdGhlIHNlcnZlci5cclxuICBhc3luYyBfcG9zdEFuc3dlcnMoaXNDaGFuZ2VPZlBhZ2UgPSBmYWxzZSkge1xyXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSBhbnN3ZXJzIHRvIHVwbG9hZC5cclxuICAgIGNvbnN0IG5vTmV3QW5zd2VycyA9IHRoaXMubm90WWV0UG9zdGVkQW5zd2Vycy5sZW5ndGggPT09IDA7XHJcbiAgICBpZiAobm9OZXdBbnN3ZXJzKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgW3Bvc3RSb3V0ZSwgYW5zd2Vyc1RvUG9zdF0gPSB0aGlzLiNnZXRQb3N0SW5mbygpO1xyXG5cclxuICAgIGNvbnN0IHBvc3RPYmogPSB7XHJcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgIGhlYWRlcnM6IHtcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIn0sXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICB0eXBlOiBcImFuc3dlcnNcIiwgXHJcbiAgICAgICAgZGF0YTogYW5zd2Vyc1RvUG9zdFxyXG4gICAgICB9KVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gSWYgbW92aW5nIG9mZiB0aGUgcGFnZSwga2VlcCBmZXRjaCByZXF1ZXN0IGFsaXZlLlxyXG4gICAgaWYgKGlzQ2hhbmdlT2ZQYWdlKSB7XHJcbiAgICAgIHBvc3RPYmoua2VlcGFsaXZlID0gdHJ1ZTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucmVzZXRBbnN3ZXJzKCk7XHJcbiAgICBhd2FpdCBmZXRjaChwb3N0Um91dGUsIHBvc3RPYmopO1xyXG5cclxuICAgIHRoaXMuY2xlYXJSZWNlbnRseVBvc3RlZEFuc3dlcnMoYW5zd2Vyc1RvUG9zdCk7XHJcbiAgfVxyXG5cclxuICAvLyBHZXRzIHRoZSByZWxldmFudCBwb3N0Um91dGUgYW5kIGFuc3dlcnNUb1Bvc3QgZm9ybWF0IGZvciB3aGV0aGVyIHVwbG9hZGluZyBcclxuICAvLyBhbnN3ZXJzIGZvciBhIHNpbmdsZSBjYXRlZ29yeSAoZnJvbSBxdWVzdGlvbnMgcGFnZSkgb3IgZm9yIG11bHRpcGxlIFxyXG4gIC8vIGNhdGVnb3JpZXMgKGVnLiBmcm9tIHJlY29tbWVuZGF0aW9ucyBwYWdlKS5cclxuICAjZ2V0UG9zdEluZm8oKSB7XHJcbiAgICBjb25zdCBhbnN3ZXJzTWl4ZWRDYXRlZ29yaWVzID0gIXRoaXMuY2F0ZWdvcnlOYW1lO1xyXG5cclxuICAgIGxldCBwb3N0Um91dGU7XHJcbiAgICBsZXQgYW5zd2Vyc1RvUG9zdDtcclxuXHJcbiAgICBpZiAoYW5zd2Vyc01peGVkQ2F0ZWdvcmllcykge1xyXG4gICAgICBwb3N0Um91dGUgPSBgL3F1ZXN0aW9ucy9taXhlZC1jYXRlZ29yaWVzYDtcclxuICAgICAgYW5zd2Vyc1RvUG9zdCA9IHRoaXMuI2dldEFuc3dlcnNUb1Bvc3RDYXRJbmZvKHRoaXMubm90WWV0UG9zdGVkQW5zd2Vycyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcG9zdFJvdXRlID0gYC9xdWVzdGlvbnMvJHt0aGlzLmNhdGVnb3J5VHlwZU5hbWV9LyR7dGhpcy5jYXRlZ29yeU5hbWV9YDtcclxuICAgICAgYW5zd2Vyc1RvUG9zdCA9IHRoaXMubm90WWV0UG9zdGVkQW5zd2Vycy5zbGljZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gW3Bvc3RSb3V0ZSwgYW5zd2Vyc1RvUG9zdF07XHJcbiAgfVxyXG5cclxuICAvLyBNYWtlIGEgY2F0ZWdvcnkgaW5mbyBvYmplY3Qgd2l0aCB0aGUgYW5zd2VycyBmb3IgZWFjaCBjYXRlZ29yeSwgZm9yIHdoZW4gXHJcbiAgLy8gdXBsb2FkaW5nIGFuc3dlcnMgZm9yIG11bHRpcGxlIGNhdGVnb3JpZXMgYXQgb25jZSAoZWcuIGZyb20gcmVjb21tZW5kYXRpb25zIHBhZ2UpLlxyXG4gICNnZXRBbnN3ZXJzVG9Qb3N0Q2F0SW5mbyhhbnN3ZXJzVG9Qb3N0KSB7XHJcbiAgICBjb25zdCBjYXRlZ29yaWVzQW5zd2VycyA9IFtdO1xyXG5cclxuICAgIC8vIFBvcHVsYXRlIGNhdGVnb3JpZXNBbnN3ZXJzIHdpdGggYW5zd2VycyBmb3IgZWFjaCBkaWZmZXJlbnQgY2F0ZWdvcnkuXHJcbiAgICBmb3IgKGxldCBhbnN3ZXIgb2YgYW5zd2Vyc1RvUG9zdCkge1xyXG4gICAgICBjb25zdCB0aGlzQW5zQ2F0VHlwZSA9IGFuc3dlci5xdWVzdGlvbkRldGFpbHMuY2F0ZWdvcnlUeXBlTmFtZTtcclxuICAgICAgY29uc3QgdGhpc0Fuc0NhdCA9IGFuc3dlci5xdWVzdGlvbkRldGFpbHMuY2F0ZWdvcnlOYW1lO1xyXG5cclxuICAgICAgY29uc3QgZm91bmRDYXRlZ29yeUlkeCA9IGNhdGVnb3JpZXNBbnN3ZXJzLmZpbmRJbmRleChsaXN0ID0+IHtcclxuICAgICAgICBjb25zdCBjYXRUeXBlTWF0Y2ggPSBsaXN0LmNhdFR5cGUgPT09IHRoaXNBbnNDYXRUeXBlO1xyXG4gICAgICAgIGNvbnN0IGNhdE1hdGNoID0gbGlzdC5jYXQgPT09IHRoaXNBbnNDYXQ7XHJcbiAgICAgICAgcmV0dXJuIChjYXRUeXBlTWF0Y2ggJiYgY2F0TWF0Y2gpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGZvcm1hdHRlZEFucyA9IGZvcm1hdEFuc3dlcihhbnN3ZXIpO1xyXG5cclxuICAgICAgaWYgKGZvdW5kQ2F0ZWdvcnlJZHggPiAtMSkge1xyXG4gICAgICAgIGNhdGVnb3JpZXNBbnN3ZXJzW2ZvdW5kQ2F0ZWdvcnlJZHhdLmFuc3dlcnMucHVzaChmb3JtYXR0ZWRBbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG5ld0NhdGVnb3J5ID0ge1xyXG4gICAgICAgICAgY2F0VHlwZTogdGhpc0Fuc0NhdFR5cGUsXHJcbiAgICAgICAgICBjYXQ6IHRoaXNBbnNDYXQsXHJcbiAgICAgICAgICBhbnN3ZXJzOiBbZm9ybWF0dGVkQW5zXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNhdGVnb3JpZXNBbnN3ZXJzLnB1c2gobmV3Q2F0ZWdvcnkpO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBSZW1vdmUgdGhlIGNhdGVnb3J5IGFuZCBjYXRlZ29yeSB0eXBlIGZyb20gdGhlIGFuc3dlci5cclxuICAgIGZ1bmN0aW9uIGZvcm1hdEFuc3dlcihhbnN3ZXIpIHtcclxuICAgICAgZGVsZXRlIGFuc3dlci5xdWVzdGlvbkRldGFpbHMuY2F0ZWdvcnlOYW1lO1xyXG4gICAgICBkZWxldGUgYW5zd2VyLnF1ZXN0aW9uRGV0YWlscy5jYXRlZ29yeVR5cGVOYW1lO1xyXG4gICAgICByZXR1cm4gYW5zd2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXRlZ29yaWVzQW5zd2VycztcclxuICB9XHJcbn0iLCJpbXBvcnQgeyBRdWVzdGlvbnNQYWdlIH0gZnJvbSBcIi4uL3F1ZXN0aW9uc1BhZ2UubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWNzUXVlc3Rpb25zUGFnZSBleHRlbmRzIFF1ZXN0aW9uc1BhZ2Uge1xyXG4gIFxyXG4gIHNldFFNb2RlKG5ld1FNb2RlKSB7XHJcbiAgICBzdXBlci5zZXRRTW9kZShuZXdRTW9kZSk7XHJcblxyXG4gICAgdGhpcy5jdXJyUXVlc3Rpb25Nb2RlLl9xU291cmNlLmFkZEV2ZW50TGlzdGVuZXIoYGdldFJlY3NDbGlja2AsIGFzeW5jICgpID0+IHtcclxuICAgICAgdGhpcy5fcG9zdEFuc3dlcnMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gRGlzcGF0Y2ggZXZlbnQgdG8gdGhlIHEgc291cmNlIHNvIHRoYXQgaXQga25vd3MgaXQgY2FuIHRoZW4gcmVmcmVzaCB0aGUgXHJcbiAgLy8gcmVjb21tZW5kYXRpb25zLlxyXG4gIGFzeW5jIF9wb3N0QW5zd2Vycyhpc0NoYW5nZU9mUGFnZSA9IGZhbHNlKSB7XHJcbiAgICBzdXBlci5fcG9zdEFuc3dlcnMoaXNDaGFuZ2VPZlBhZ2UpO1xyXG4gICAgdGhpcy5jdXJyUXVlc3Rpb25Nb2RlLl9xU291cmNlLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGBwb3N0QW5zd2Vyc0NvbXBsZXRlYCkpO1xyXG4gIH1cclxufSIsIi8vIENsYXNzIHRvIHN0b3JlIGNhdGVnb3J5IHR5cGUgYW5kIGNhdGVnb3J5IGluZm8gaW4gYSB0cmVlIHN0cnVjdHVyZSBvZiBuZXN0ZWRcclxuLy8gb2JqZWN0cyBmb3IgYWxsIGNhdGVnb3JpZXMgcHJlc2VudC5cclxuZXhwb3J0IGNsYXNzIENhdGVnb3J5SW5mbyB7XHJcbiAgY2F0VHlwZXMgPSB7fTtcclxuXHJcbiAgLy8gV2hlcmUgY2F0SW5mbyBpcyBhbiBvcHRpb25hbCBjYXRlZ29yeSBpbmZvIHN0eWxlIG9iamVjdCAoanVzdCB0aGUgZGF0YSwgbm90IFxyXG4gIC8vIGFuIGFjdHVhbCBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIC0gZnJvbSB3aGVuIHN0cmluZ2lmaWVkIGFuZCBzZW50IHVzaW5nIGZldGNoKS5cclxuICAvLyBkYkNhdFR5cGVzIGlzIGEgbGlzdCBvZiBjYXRlZ29yeVR5cGUgZG9jdW1lbnRzIGFzIHJldHVybmVkIGZyb20gZG9pbmcgZmluZCBcclxuICAvLyBvZiBjYXRlZ29yeSB0eXBlcyBpbiBEQi5cclxuICBjb25zdHJ1Y3RvcihjYXRJbmZvID0gbnVsbCwgZGJDYXRUeXBlcyA9IG51bGwpIHtcclxuICAgIGlmIChjYXRJbmZvKSB7XHJcbiAgICAgIHRoaXMuY2F0VHlwZXMgPSBjYXRJbmZvLmNhdFR5cGVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZGJDYXRUeXBlcykge1xyXG4gICAgICB0aGlzLiNjb25zdHJ1Y3RGcm9tQ2F0VHlwZXMoZGJDYXRUeXBlcyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gQ29uc3RydWN0IHRoaXMgY2F0ZWdvcnkgaW5mbyBiYXNlZCBvbiBhIGdpdmVuIGFycmF5IG9mIGNhdGVnb3J5IHR5cGVzIGFuZCBcclxuICAvLyB0aGVpciBuZXN0ZWQgY2F0ZWdvcmllcyAoYXMgYSByZXN1bHQgb2YgYSBkaWIgZmluZCBvbiBjYXRlZ29yeSB0eXBlcykuXHJcbiAgI2NvbnN0cnVjdEZyb21DYXRUeXBlcyhkYkNhdFR5cGVzKSB7XHJcbiAgICBmb3IgKGxldCBjYXRUeXBlIG9mIGRiQ2F0VHlwZXMpIHtcclxuICAgICAgZm9yIChsZXQgY2F0IG9mIGNhdFR5cGUuY2F0ZWdvcmllcykge1xyXG4gICAgICAgIGNvbnN0IGlzUmVjRGF0YSA9IHtpc1JlY29tbWVuZGFibGU6IGNhdC5pc1JlY29tbWVuZGFibGV9O1xyXG4gICAgICAgIHRoaXMuY2hlY2tBbmRBZGRDYXRlZ29yeVdpdGhUeXBlKGNhdFR5cGUubmFtZSwgY2F0Lm5hbWUsIGlzUmVjRGF0YSk7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gR2l2ZW4gYSBjYXRlZ29yeSB0eXBlIGFuZCBjYXRlZ29yeSwgYWRkcyBib3RoLCBqdXN0IHRoZSBjYXRlZ29yeSwgb3JcclxuICAvLyBuZWl0aGVyIG9mIHRoZW0gZGVwZW5kaW5nIG9uIHdoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhpcy5cclxuICAvLyBkYXRhIHNob3VsZCBiZSBhbiBvYmplY3QgYW5kIGFsbCB0aGUga2V5OiB2YWx1ZSBwYWlycyBmcm9tIGRhdGEgd2lsbCBiZVxyXG4gIC8vIGFkZGVkIGluIHRvIHRoZSBDYXRlZ29yeUluZm8gb2JqZWN0IGF0IHRoZSBjb3JyZWN0IHBsYWNlLlxyXG4gIGNoZWNrQW5kQWRkQ2F0ZWdvcnlXaXRoVHlwZShjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGRhdGEgPSBudWxsKSB7XHJcbiAgICBjb25zdCBjYXRPclR5cGVFeGlzdHMgPSB0aGlzLl9kb2VzQ2F0ZWdvcnlPclR5cGVFeGlzdChjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUpO1xyXG4gICAgaWYgKGNhdE9yVHlwZUV4aXN0cyA9PT0gXCJub3JcIil7XHJcbiAgICAgIHRoaXMuX2FkZFR5cGVBbmRDYXRlZ29yeShjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoY2F0T3JUeXBlRXhpc3RzID09PSBcInR5cGVPbmx5XCIpe1xyXG4gICAgICB0aGlzLl9hZGRDYXRlZ29yeShjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGRhdGEpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGlzIGNhdGVnb3J5IGluZm8gb2JqZWN0IGFuZCByZXR1cm5zIGl0LCBhbG9uZyB3aXRoIG5ldyBcclxuICAvLyBkYXRhIGZvciBlYWNoIGNhdGVnb3J5IHdoaWNoIGlzIGNhbGN1bGF0ZWQgdXNpbmcgdGhlIGhpZ2hlciBvcmRlciBnZXREYXRhRnVuYyBhbmQgYXJncy5cclxuICBjbG9uZVdpdGhEYXRhKGdldERhdGFGdW5jLCBhcmdzKSB7XHJcbiAgICBjb25zdCBuZXdDYXRJbmZvID0gbmV3IENhdGVnb3J5SW5mbygpO1xyXG5cclxuICAgIGNvbnN0IGFsbENhdGVnb3JpZXNXaXRoVHlwZXMgPSB0aGlzLmdldEFsbENhdGVnb3JpZXMoKTtcclxuXHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeVdpdGhUeXBlIG9mIGFsbENhdGVnb3JpZXNXaXRoVHlwZXMpIHtcclxuICAgICAgY29uc3QgY2F0VHlwZU5hbWUgPSBjYXRlZ29yeVdpdGhUeXBlLmNhdGVnb3J5VHlwZTtcclxuICAgICAgY29uc3QgY2F0ZWdvcnlOYW1lID0gY2F0ZWdvcnlXaXRoVHlwZS5jYXRlZ29yeTtcclxuICAgICAgY29uc3QgZGF0YSA9IGdldERhdGFGdW5jKGNhdFR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGFyZ3MpO1xyXG5cclxuICAgICAgbmV3Q2F0SW5mby5jaGVja0FuZEFkZENhdGVnb3J5V2l0aFR5cGUoY2F0VHlwZU5hbWUsIGNhdGVnb3J5TmFtZSwgZGF0YSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBuZXdDYXRJbmZvO1xyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJucyBhbiBhcnJheSBvZiBvYmplY3RzIHdoZXJlIGVhY2ggb2JqZWN0IGNvbnRhaW5zIHRoZVxyXG4gIC8vIGNhdGVnb3J5VHlwZU5hbWUgYW5kIGNhdGVnb3J5TmFtZSwgZm9yIGV2ZXJ5IHVuaXF1ZSBjYXRlZ29yeSBpbiB0aGlzLlxyXG4gIGdldEFsbENhdGVnb3JpZXMoaW5jbERhdGEgPSBmYWxzZSkge1xyXG4gICAgY29uc3QgYWxsVW5pcXVlQ2F0ZWdvcmllcyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGNhdFR5cGUgaW4gdGhpcy5jYXRUeXBlcykge1xyXG4gICAgICBmb3IgKGxldCBjYXRlZ29yeSBpbiB0aGlzLmNhdFR5cGVzW2NhdFR5cGVdPy5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgY29uc3QgdGhpc0NhdEFuZFR5cGUgPSB7XHJcbiAgICAgICAgICBjYXRlZ29yeVR5cGU6IGNhdFR5cGUsXHJcbiAgICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoaW5jbERhdGEpIHtcclxuICAgICAgICAgIGNvbnN0IGNhdERhdGEgPSB0aGlzLmNhdFR5cGVzW2NhdFR5cGVdLmNhdGVnb3JpZXNbY2F0ZWdvcnldO1xyXG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIGNhdERhdGEpIHtcclxuICAgICAgICAgICAgdGhpc0NhdEFuZFR5cGVba2V5XSA9IGNhdERhdGFba2V5XTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgYWxsVW5pcXVlQ2F0ZWdvcmllcy5wdXNoKHRoaXNDYXRBbmRUeXBlKTtcclxuICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGFsbFVuaXF1ZUNhdGVnb3JpZXM7XHJcbiAgfVxyXG5cclxuICAvLyBSZXR1cm5zIFwidHlwZUFuZENhdFwiIGlmIGNhdGVnb3J5VHlwZSBhbmQgY2F0ZWdvcnkgZXhpc3RzIGluIHRoZSB0cmVlLCBcInR5cGVPbmx5XCIgaWYgb25seVxyXG4gIC8vIHRoZSBjYXRlZ29yeVR5cGUgZXhpc3RzIGFuZCBcIm5vclwiIGlmIG5laXRoZXIgdGhlIGNhdGVnb3J5IG5vciB0aGUgY2F0ZWdvcnlUeXBlIGV4aXN0cy5cclxuICBfZG9lc0NhdGVnb3J5T3JUeXBlRXhpc3QoY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lKXtcclxuICAgIGlmICghKGNhdGVnb3J5VHlwZU5hbWUgaW4gdGhpcy5jYXRUeXBlcykpIHtcclxuICAgICAgcmV0dXJuIFwibm9yXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghKGNhdGVnb3J5TmFtZSBpbiAodGhpcy5jYXRUeXBlcy5jYXRlZ29yeVR5cGVOYW1lPy5jYXRlZ29yaWVzID8/IFtdKSkpIHtcclxuICAgICAgcmV0dXJuIFwidHlwZU9ubHlcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICByZXR1cm4gXCJ0eXBlQW5kQ2F0XCI7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgX2FkZFR5cGVBbmRDYXRlZ29yeShjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGRhdGEpe1xyXG4gICAgdGhpcy5jYXRUeXBlc1tjYXRlZ29yeVR5cGVOYW1lXSA9IHtcclxuICAgICAgY2F0ZWdvcmllczoge31cclxuICAgIH07XHJcbiAgICB0aGlzLl9hZGRDYXRlZ29yeShjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgX2FkZENhdGVnb3J5KGNhdGVnb3J5VHlwZU5hbWUsIGNhdGVnb3J5TmFtZSwgZGF0YSl7XHJcbiAgICB0aGlzLmNhdFR5cGVzW2NhdGVnb3J5VHlwZU5hbWVdLmNhdGVnb3JpZXNbY2F0ZWdvcnlOYW1lXSA9IG51bGw7XHJcbiAgICBpZiAoZGF0YSkge1xyXG4gICAgICB0aGlzLl9zZXREYXRhKGNhdGVnb3J5VHlwZU5hbWUsIGNhdGVnb3J5TmFtZSwgZGF0YSk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgX3NldERhdGEoY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lLCBkYXRhKSB7XHJcbiAgICB0aGlzLmNhdFR5cGVzW2NhdGVnb3J5VHlwZU5hbWVdLmNhdGVnb3JpZXNbY2F0ZWdvcnlOYW1lXSA9IHt9O1xyXG4gICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuICAgICAgdGhpcy5jYXRUeXBlc1tjYXRlZ29yeVR5cGVOYW1lXS5jYXRlZ29yaWVzW2NhdGVnb3J5TmFtZV1ba2V5XSA9IGRhdGFba2V5XTtcclxuICAgIH07XHJcbiAgfVxyXG59IiwiLy8gQ2xhbXAgbnVtYmVyIGJldHdlZW4gdHdvIHZhbHVlcy5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKG51bSwgbWluLCBtYXgpIHtcclxuICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobnVtLCBtaW4pLCBtYXgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCBwcnBydG4gPSAwLjUpIHtcclxuICByZXR1cm4gc3RhcnQgKyAoKGVuZCAtIHN0YXJ0KSAqIHBycHJ0bik7XHJcbn1cclxuXHJcbi8vIEZvciBpbnRzLCBpdCBpcyBpbmNsdXNpdmUgb2Ygc3RhcnQgYW5kIG5vdCBpbmNsdXNpdmUgb2YgZW5kLlxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZEJldHdlZW4oc3RhcnQgPSAwLCBlbmQgPSAxLCBpbnRzID0gZmFsc2UpIHtcclxuICBjb25zdCByYW5nZSA9IGVuZCAtIHN0YXJ0O1xyXG4gIGNvbnN0IHJhbmRGbG9hdCA9IChNYXRoLnJhbmRvbSgpICogcmFuZ2UpICsgc3RhcnQ7XHJcbiAgcmV0dXJuIGludHMgPyBNYXRoLmZsb29yKHJhbmRGbG9hdCkgOiByYW5kRmxvYXQ7XHJcbn1cclxuXHJcbi8vIFByb2JhYmlsaXR5IHNob3VsZCBiZSBhIGRlY2ltYWwsIHJldHVybnMgdHJ1ZSBvciBmYWxzZS5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RSYW5kb20ocHJvYmFiaWxpdHkpIHtcclxuICByZXR1cm4gKE1hdGgucmFuZG9tKCkgPD0gcHJvYmFiaWxpdHkpID8gdHJ1ZSA6IGZhbHNlO1xyXG59XHJcblxyXG4vLyBUYWtlcyBhIGxpc3Qgb2YgcHJvYiBvYmplY3RzIGFzIGlucHV0IGluIGZvcm1hdCB7bmFtZTogbmFtZSwgcHJvYjogcHJvYn0gYW5kIFxyXG4vLyByZXR1cm5zIG5hbWUgb2YgY2hvc2VuIHByb2JPYmosIG9yIGZhbHNlIGlmIG5vbmUgY2hvc2VuIChpbiBjYXNlIHRoYXQgcHJvYk9ianMgXHJcbi8vIHByb2JzIGRvbnQgc3VtIHRvIDEpLlxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdFJhbmRNdWx0KC4uLnByb2JzKSB7XHJcbiAgY29uc3QgcHJvYnNPYmpzID0gW107XHJcbiAgbGV0IGN1cnJQcm9iU3RhcnQgPSAwO1xyXG5cclxuICBwcm9icy5mb3JFYWNoKHByb2IgPT4ge1xyXG4gICAgY29uc3QgdGhpc1Byb2IgPSB7XHJcbiAgICAgIG5hbWU6IHByb2IubmFtZSxcclxuICAgICAgc3RhcnQ6IGN1cnJQcm9iU3RhcnQsXHJcbiAgICAgIGVuZDogY3VyclByb2JTdGFydCArIHByb2IucHJvYlxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9ic09ianMucHVzaCh0aGlzUHJvYik7XHJcblxyXG4gICAgY3VyclByb2JTdGFydCArPSBwcm9iO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBjaG9zZW5WYWwgPSBNYXRoLnJhbmRvbSgpO1xyXG4gIGxldCByZXR1cm5WYWwgPSBmYWxzZTtcclxuXHJcbiAgcHJvYnNPYmpzLmZvckVhY2gocHJvYiA9PiB7XHJcbiAgICBjb25zdCBjaG9zZW5UaGlzUHJvYiA9IHByb2Iuc3RhcnQgPD0gY2hvc2VuVmFsICYmIHByb2IuZW5kID4gY2hvc2VuVmFsO1xyXG4gICAgaWYgKGNob3NlblRoaXNQcm9iKSB7XHJcbiAgICAgIHJldHVyblZhbCA9IHByb2IubmFtZTtcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByZXR1cm5WYWw7XHJcbn1cclxuXHJcbi8vIFNlYXJjaGVzIGZvciBhIG5ld0l0ZW0gaW4gYW4gYXJyYXkgZ2l2ZW4gYW4gZWxlbUNvbXBGdW5jIHRoYXQgZGV0ZXJtaW5lcyBcclxuLy8gd2hldGhlciBpdCBpcyBwcmVzZW50IG9yIG5vdCAoZWcuIHRvIGZpbmQgYmFzZWQgb24gcXVlc3Rpb24gSUQpLiBJZiBwcmVzZW50LCBcclxuLy8gZWxlbWVudCBpbiBhcnJheSBpcyBvdmVyd3JpdHRlbiB3aXRoIG5ld0l0ZW0sIG90aGVyd2lzZSBuZXdJdGVtIGlzIHB1c2hlZCB0byBcclxuLy8gZW5kIG9mIGFycmF5LlxyXG5leHBvcnQgZnVuY3Rpb24gZmluZEFuZE92ZXJ3cml0ZUVsc2VQdXNoKGFycmF5LCBuZXdJdGVtLCBlbGVtQ29tcEZ1bmMpIHtcclxuICBjb25zdCBmb3VuZEluZGV4ID0gYXJyYXkuZmluZEluZGV4KGFyckl0ZW0gPT4gZWxlbUNvbXBGdW5jKGFyckl0ZW0sIG5ld0l0ZW0pKTtcclxuXHJcbiAgLy8gSWYgZm91bmQsIG92ZXJ3cml0ZS5cclxuICBpZiAoZm91bmRJbmRleCA+IC0xKSB7XHJcbiAgICBhcnJheS5zcGxpY2UoZm91bmRJbmRleCwgMSwgbmV3SXRlbSk7XHJcbiAgfVxyXG4gIC8vIE90aGVyd2lzZSBhZGQuXHJcbiAgZWxzZSB7XHJcbiAgICBhcnJheS5wdXNoKG5ld0l0ZW0pO1xyXG4gIH07XHJcbn1cclxuXHJcbi8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0cmFuc2l0aW9uIG9uIGdpdmVuIGVsZW1lbnQgZW5kcywgXHJcbi8vIG9wdGlvbmFsIHRyYW5zaXRpb24gcHJvcGVydHkgbmFtZSBjaGVjay5cclxuZXhwb3J0IGZ1bmN0aW9uIGF3YWl0VHJhbnNpdGlvbihlbGVtLCBwcm9wTmFtZSA9IG51bGwpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGFzeW5jIGV2dCA9PiB7XHJcblxyXG4gICAgICBpZiAocHJvcE5hbWUpIHtcclxuICAgICAgICBpZiAoZXZ0LnByb3BlcnR5TmFtZSA9PT0gcHJvcE5hbWUpIHtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgYXdhaXQgYXdhaXRUcmFuc2l0aW9uKGVsZW0sIHByb3BOYW1lKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfSwge29uY2U6IHRydWV9KTtcclxuICB9KVxyXG59XHJcblxyXG4vLyBGb3IgdGVzdGluZyBsb25nIHJ1bm5pbmcgZnVuY3Rpb25zLlxyXG4vLyBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzAwMCkpOyAvLy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBSZWNvbW1lbmRhdGlvbnNNb2RlIH0gZnJvbSBcIi4uL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcXVlc3Rpb25zTW9kZS9zdWItY2xhc3Nlcy9zaW5nbGVBbnN3ZXJNb2RlL3N1Yi1jbGFzc2VzL3JlY29tbWVuZGF0aW9uc01vZGUubWpzXCI7XHJcbmltcG9ydCB7IFJlY3NRU291cmNlIH0gZnJvbSBcIi4uL21vZHVsZXMvcXVlc3Rpb25zL2NvbXBvbmVudHMvcVNvdXJjZS9zdWItY2xhc3Nlcy9yZWNzUVNvdXJjZS5tanNcIjtcclxuaW1wb3J0IHsgUmVjc1F1ZXN0aW9uc1BhZ2UgfSBmcm9tIFwiLi4vbW9kdWxlcy9xdWVzdGlvbnMvcXVlc3Rpb25zUGFnZS9zdWItY2xhc3Nlcy9yZWNzUXVlc3Rpb25zUGFnZS5tanNcIjtcclxuaW1wb3J0IFwiLi9sb2dnZWRJblBhZ2UuanNcIjtcclxuXHJcblxyXG5cclxuY29uc3Qgc2luZ2xlQW5zd2VyUU1vZGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNpbmdsZS1hbnN3ZXItbW9kZVwiKTtcclxuXHJcbmNvbnN0IHJlY29tbWVuZGF0aW9uc0xpc3REaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlY29tbWVuZGF0aW9ucy1saXN0XCIpO1xyXG5jb25zdCByZWNvbW1lbmRhdGlvbnNMaXN0ID0gbmV3IFJlY3NRU291cmNlKHJlY29tbWVuZGF0aW9uc0xpc3REaXYpO1xyXG5cclxuY29uc3QgcmVjb21tZW5kYXRpb25zTW9kZSA9IG5ldyBSZWNvbW1lbmRhdGlvbnNNb2RlKHNpbmdsZUFuc3dlclFNb2RlRGl2LCBcclxuICByZWNvbW1lbmRhdGlvbnNMaXN0KTtcclxuXHJcbi8vIENyZWF0ZSB0aGUgcXVlc3Rpb25zIHBhZ2UuXHJcbmNvbnN0IHF1ZXN0aW9uc1BhZ2UgPSBuZXcgUmVjc1F1ZXN0aW9uc1BhZ2UoW3JlY29tbWVuZGF0aW9uc01vZGVdKTtcclxuXHJcbnF1ZXN0aW9uc1BhZ2UuaW5pdCgpO1xyXG5cclxuLy8gT24gcGFnZSBsb2FkLCB1cGRhdGUgdGhlIHF1ZXN0aW9ucyBxdWV1ZSBhbmQgc2hvdyB0aGUgZmlyc3QgcXVlc3Rpb24uXHJcbndpbmRvdy5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XHJcbiAgYXdhaXQgcXVlc3Rpb25zUGFnZS5zZXRRTW9kZShyZWNvbW1lbmRhdGlvbnNNb2RlKTtcclxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==