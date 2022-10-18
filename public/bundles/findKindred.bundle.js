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

/***/ "./src/js/modules/findKindred/findKindredList.mjs":
/*!********************************************************!*\
  !*** ./src/js/modules/findKindred/findKindredList.mjs ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FindKindredList": () => (/* binding */ FindKindredList)
/* harmony export */ });
/* harmony import */ var _kindredRecsMixin_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../kindredRecsMixin.mjs */ "./src/js/modules/kindredRecsMixin.mjs");
/* harmony import */ var _categoryCheckboxes_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../categoryCheckboxes.mjs */ "./src/js/modules/categoryCheckboxes.mjs");





class FindKindredList {
  _mainDiv;
  _contentDiv;
  #findKindredBtn;
  #categoryCheckboxes;
  _loader;

  static #INVALID_SELECTS_MSG = `At least one category must be selected.`;

  constructor(mainDiv) {
    this._mainDiv = mainDiv;
    this._contentDiv = mainDiv.querySelector(".content");
    this.#findKindredBtn = document.querySelector(".find-kindred-btn");

    const domCatCheckboxes = document.querySelectorAll(".category-checkbox");
    this.#categoryCheckboxes = new _categoryCheckboxes_mjs__WEBPACK_IMPORTED_MODULE_1__.CategoryCheckboxes(domCatCheckboxes);

    this._loader = mainDiv.querySelector(".loader");
  }
  
  init() {
    this.#findKindredBtn.addEventListener("click", () => {
      this.validateHandleUpdate(this._contentDiv, 
        FindKindredList.#INVALID_SELECTS_MSG);
    });
  }

  // Ensure at least one checkbox is selected for Rec for and Based on Groups.
  _validateSelections() {
    const numCats = this.#categoryCheckboxes.getNumSelected();
    return (numCats > 0);
  }

  _buildContentDiv(simRatingList) {
    for (let kindred of simRatingList) {
      const kindredRow = this._createRow(kindred);
      this._contentDiv.appendChild(kindredRow);
    };
  }

  _createRow(kindred) {   
    const kindredRow = document.createElement("div");
    kindredRow.classList.add("kindred-item");

    const simScore = document.createElement("p");
    const username = document.createElement("p");
    const loc = document.createElement("p");
    const posDiff = document.createElement("p");

    simScore.innerText = kindred.simInfo.simScore.toFixed(1);
    username.innerText = kindred.profileName;
    loc.innerText = `${kindred.location.placeName}, ${kindred.location.country.long}`;
    posDiff.innerText = kindred.simInfo.scoreDiff.toFixed(1);

    simScore.classList.add("sim-score");

    kindredRow.append(simScore, username, loc, posDiff);

    return kindredRow;
  }

  async _findKindred() {
    const selectedCategoryInfo = this.#categoryCheckboxes.getSelectedCategoryInfo();
  
    const fetchResponse = await fetch("/find-kindred", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(selectedCategoryInfo)
    });
  
    const kindredList = await fetchResponse.json();
  
    return kindredList;  
  }

  // Used by the mixin to get latest kindred.
  async _getUpdatedSourceData() {
    return await this._findKindred();  
  }
}

Object.assign(FindKindredList.prototype, _kindredRecsMixin_mjs__WEBPACK_IMPORTED_MODULE_0__.kindredRecsMixin);

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
/*!*************************************!*\
  !*** ./src/js/pages/findKindred.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_findKindred_findKindredList_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/findKindred/findKindredList.mjs */ "./src/js/modules/findKindred/findKindredList.mjs");
/* harmony import */ var _loggedInPage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loggedInPage.js */ "./src/js/pages/loggedInPage.js");





const mainKindredDiv = document.querySelector(".kindred-list");
const thisKindredList = new _modules_findKindred_findKindredList_mjs__WEBPACK_IMPORTED_MODULE_0__.FindKindredList(mainKindredDiv);
thisKindredList.init();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFIQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxvREFBb0Qsd0JBQXdCO0FBQzVFO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLEdBQUcsV0FBVztBQUNuQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsNERBQTREOzs7Ozs7VUNoRzVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjZFO0FBQ2xEO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHFGQUFlO0FBQzNDLHVCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2NhdGVnb3J5Q2hlY2tib3hlcy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2ZhZGVUcmFuc2l0aW9ucy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2ZpbmRLaW5kcmVkL2ZpbmRLaW5kcmVkTGlzdC5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2tpbmRyZWRSZWNzTWl4aW4ubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9wb3BCdG5zLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL3NoYXJlZEpzL2NhdGVnb3J5SW5mby5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9zaGFyZWRKcy91dGlscy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvcGFnZXMvZmluZEtpbmRyZWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2F0ZWdvcnlJbmZvIH0gZnJvbSBcIi4uLy4uL3NoYXJlZEpzL2NhdGVnb3J5SW5mby5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gT2JqZWN0cyB0byByZXByZXNlbnQgY2hlY2tib3ggc2VsZWN0aW9uIGNoZWNrYm94ZXMgZm9yIGFsbCBjYXRlZ29yaWVzIC8gXHJcbi8vIGNhdGVnb3J5IHR5cGVzLlxyXG5leHBvcnQgY2xhc3MgQ2F0ZWdvcnlDaGVja2JveGVzIHtcclxuICAgICNjaGVja2JveGVzO1xyXG4gICAgY2F0ZWdvcnlJbmZvO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhdGVnb3J5Q2hlY2tib3hlcykge1xyXG4gICAgICAgIHRoaXMuI2NoZWNrYm94ZXMgPSBjYXRlZ29yeUNoZWNrYm94ZXM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEdpdmVuIGFuIGFycmF5IG9mIGNoZWNrYm94IERPTSBvYmplY3RzLCByZXR1cm5zIGEgQ2F0ZWdvcnlJbmZvIG9iamVjdFxyXG4gICAgLy8gY29udGFpbmluZyBpbmZvcm1hdGlvbiBvbiBhbGwgc2VsZWN0ZWQgY2hlY2tib3hlcy5cclxuICAgIGdldFNlbGVjdGVkQ2F0ZWdvcnlJbmZvKCkge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZENhdGVnb3J5SW5mbyA9IG5ldyBDYXRlZ29yeUluZm8oKTtcclxuICAgICAgXHJcbiAgICAgICAgdGhpcy4jY2hlY2tib3hlcy5mb3JFYWNoKGZ1bmN0aW9uKGNoZWNrYm94KXtcclxuICAgICAgICAgIGlmIChjaGVja2JveC5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhdFR5cGVBbmRDYXQgPSBjaGVja2JveC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRDYXRlZ29yeUluZm8uY2hlY2tBbmRBZGRDYXRlZ29yeVdpdGhUeXBlKGNhdFR5cGVBbmRDYXRbMF0sXHJcbiAgICAgICAgICAgICAgY2F0VHlwZUFuZENhdFsxXSk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2F0ZWdvcnlJbmZvID0gc2VsZWN0ZWRDYXRlZ29yeUluZm87XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2F0ZWdvcnlJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE51bVNlbGVjdGVkKCkge1xyXG4gICAgICBjb25zdCBjaGVja0JveGVzQXJyID0gQXJyYXkuZnJvbSh0aGlzLiNjaGVja2JveGVzKTtcclxuICAgICAgcmV0dXJuIGNoZWNrQm94ZXNBcnIucmVkdWNlKCh0b3QsIGN1cnIpID0+ICh0b3QgKyBjdXJyLmNoZWNrZWQpLCAwKTtcclxuICAgIH1cclxufSIsIi8vIEhlbHBlciBmdW5jdGlvbnMgdG8gYXNzaXN0IHdpdGggZmFkaW5nIGluIC8gb3V0IERPTSBlbGVtZW50cy5cclxuaW1wb3J0IHsgYXdhaXRUcmFuc2l0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZEpzL3V0aWxzLm1qc1wiO1xyXG5cclxuXHJcblxyXG4vLyBGYWRlIHRyYW5zaXRpb24gaGVscGVyIGZ1bmN0aW9ucywgdXNlZCB3aXRoIHRyYW5zcGFyZW50LCBmdWxseS1oaWRkZW4gYW5kIFxyXG4vLyBmYWRlLXRyYW5zIGNzcyBjbGFzc2VzLlxyXG4vLyBNYWtlcyBkaXNwbGF5IHByb3BlcnR5IHZpc2libGUgYW5kIHRoZW4gcmVtb3ZlcyB0cmFuc3BhcmVuY3kuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlSW4oZWxlbSkge1xyXG4gIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImZ1bGx5LWhpZGRlblwiKTtcclxuICBzZXRUaW1lb3V0KCgpID0+IGVsZW0uY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zcGFyZW50XCIpLCAxMCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5pc2hGYWRlSW4oZWxlbSkge1xyXG4gIGF3YWl0IGF3YWl0VHJhbnNpdGlvbihlbGVtLCBcIm9wYWNpdHlcIik7XHJcbn1cclxuXHJcbi8vIEZpbmlzaGVzIHdoZW4gZmFkZSBpbiBpcyBjb21wbGV0ZWQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmdWxseUZhZGVJbihlbGVtKSB7XHJcbiAgZmFkZUluKGVsZW0pO1xyXG4gIGF3YWl0IGZpbmlzaEZhZGVJbihlbGVtKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVPdXQoZWxlbSkge1xyXG4gIGVsZW0uY2xhc3NMaXN0LmFkZChcInRyYW5zcGFyZW50XCIpO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBvcGFjaXR5IHRyYW5zaXRpb24gb24gdGhlIFxyXG4vLyBnaXZlbiBlbGVtZW50IGlzIGNvbXBsZXRlZC4gQWxzbyBmdWxseSBoaWRlcyB0aGUgZWxlbWVudC5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmlzaEZhZGVPdXQoZWxlbSkge1xyXG4gIGF3YWl0IGF3YWl0VHJhbnNpdGlvbihlbGVtLCBcIm9wYWNpdHlcIik7XHJcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKFwiZnVsbHktaGlkZGVuXCIpO1xyXG59XHJcblxyXG4vLyBGYWRlIG91dCBhbmQgZnVsbHkgaGlkZSB0aGUgZ2l2ZW4gZWxlbWVudC5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZ1bGx5RmFkZU91dChlbGVtKSB7XHJcbiAgZmFkZU91dChlbGVtKTtcclxuICBhd2FpdCBmaW5pc2hGYWRlT3V0KGVsZW0pO1xyXG59XHJcblxyXG4vLyBGYWRlcyBvdXQgZWxlbTEgYW5kIGZhZGVzIGluIGVsZW0yIG9uY2UgdHJhbnNpdGlvbiBjb21wbGV0ZWQsIGRvZXNuJ3QgZmluaXNoIFxyXG4vLyB1bnRpbCBlbGVtMiBmdWxseSBmYWRlZCBpbi4gUmV0dXJucyBwcm9taXNlLlxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZUZyb21UbyhlbGVtMSwgZWxlbTIpIHtcclxuICBjb25zdCBmYWRlQ29tcGxldGVQcm9taXNlID0gbmV3IFByb21pc2UoYXN5bmMgcmVzb2x2ZSA9PiB7XHJcbiAgICBhd2FpdCBmdWxseUZhZGVPdXQoZWxlbTEpO1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlSW4oZWxlbTIpO1xyXG4gICAgcmVzb2x2ZSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZmFkZUNvbXBsZXRlUHJvbWlzZTtcclxufSIsImltcG9ydCB7IGtpbmRyZWRSZWNzTWl4aW4gfSBmcm9tIFwiLi4va2luZHJlZFJlY3NNaXhpbi5tanNcIjtcclxuaW1wb3J0IHsgQ2F0ZWdvcnlDaGVja2JveGVzIH0gZnJvbSBcIi4uL2NhdGVnb3J5Q2hlY2tib3hlcy5tanNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEZpbmRLaW5kcmVkTGlzdCB7XHJcbiAgX21haW5EaXY7XHJcbiAgX2NvbnRlbnREaXY7XHJcbiAgI2ZpbmRLaW5kcmVkQnRuO1xyXG4gICNjYXRlZ29yeUNoZWNrYm94ZXM7XHJcbiAgX2xvYWRlcjtcclxuXHJcbiAgc3RhdGljICNJTlZBTElEX1NFTEVDVFNfTVNHID0gYEF0IGxlYXN0IG9uZSBjYXRlZ29yeSBtdXN0IGJlIHNlbGVjdGVkLmA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG1haW5EaXYpIHtcclxuICAgIHRoaXMuX21haW5EaXYgPSBtYWluRGl2O1xyXG4gICAgdGhpcy5fY29udGVudERpdiA9IG1haW5EaXYucXVlcnlTZWxlY3RvcihcIi5jb250ZW50XCIpO1xyXG4gICAgdGhpcy4jZmluZEtpbmRyZWRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbmQta2luZHJlZC1idG5cIik7XHJcblxyXG4gICAgY29uc3QgZG9tQ2F0Q2hlY2tib3hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2F0ZWdvcnktY2hlY2tib3hcIik7XHJcbiAgICB0aGlzLiNjYXRlZ29yeUNoZWNrYm94ZXMgPSBuZXcgQ2F0ZWdvcnlDaGVja2JveGVzKGRvbUNhdENoZWNrYm94ZXMpO1xyXG5cclxuICAgIHRoaXMuX2xvYWRlciA9IG1haW5EaXYucXVlcnlTZWxlY3RvcihcIi5sb2FkZXJcIik7XHJcbiAgfVxyXG4gIFxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLiNmaW5kS2luZHJlZEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICB0aGlzLnZhbGlkYXRlSGFuZGxlVXBkYXRlKHRoaXMuX2NvbnRlbnREaXYsIFxyXG4gICAgICAgIEZpbmRLaW5kcmVkTGlzdC4jSU5WQUxJRF9TRUxFQ1RTX01TRyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIEVuc3VyZSBhdCBsZWFzdCBvbmUgY2hlY2tib3ggaXMgc2VsZWN0ZWQgZm9yIFJlYyBmb3IgYW5kIEJhc2VkIG9uIEdyb3Vwcy5cclxuICBfdmFsaWRhdGVTZWxlY3Rpb25zKCkge1xyXG4gICAgY29uc3QgbnVtQ2F0cyA9IHRoaXMuI2NhdGVnb3J5Q2hlY2tib3hlcy5nZXROdW1TZWxlY3RlZCgpO1xyXG4gICAgcmV0dXJuIChudW1DYXRzID4gMCk7XHJcbiAgfVxyXG5cclxuICBfYnVpbGRDb250ZW50RGl2KHNpbVJhdGluZ0xpc3QpIHtcclxuICAgIGZvciAobGV0IGtpbmRyZWQgb2Ygc2ltUmF0aW5nTGlzdCkge1xyXG4gICAgICBjb25zdCBraW5kcmVkUm93ID0gdGhpcy5fY3JlYXRlUm93KGtpbmRyZWQpO1xyXG4gICAgICB0aGlzLl9jb250ZW50RGl2LmFwcGVuZENoaWxkKGtpbmRyZWRSb3cpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIF9jcmVhdGVSb3coa2luZHJlZCkgeyAgIFxyXG4gICAgY29uc3Qga2luZHJlZFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBraW5kcmVkUm93LmNsYXNzTGlzdC5hZGQoXCJraW5kcmVkLWl0ZW1cIik7XHJcblxyXG4gICAgY29uc3Qgc2ltU2NvcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgIGNvbnN0IHVzZXJuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICBjb25zdCBsb2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgIGNvbnN0IHBvc0RpZmYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuXHJcbiAgICBzaW1TY29yZS5pbm5lclRleHQgPSBraW5kcmVkLnNpbUluZm8uc2ltU2NvcmUudG9GaXhlZCgxKTtcclxuICAgIHVzZXJuYW1lLmlubmVyVGV4dCA9IGtpbmRyZWQucHJvZmlsZU5hbWU7XHJcbiAgICBsb2MuaW5uZXJUZXh0ID0gYCR7a2luZHJlZC5sb2NhdGlvbi5wbGFjZU5hbWV9LCAke2tpbmRyZWQubG9jYXRpb24uY291bnRyeS5sb25nfWA7XHJcbiAgICBwb3NEaWZmLmlubmVyVGV4dCA9IGtpbmRyZWQuc2ltSW5mby5zY29yZURpZmYudG9GaXhlZCgxKTtcclxuXHJcbiAgICBzaW1TY29yZS5jbGFzc0xpc3QuYWRkKFwic2ltLXNjb3JlXCIpO1xyXG5cclxuICAgIGtpbmRyZWRSb3cuYXBwZW5kKHNpbVNjb3JlLCB1c2VybmFtZSwgbG9jLCBwb3NEaWZmKTtcclxuXHJcbiAgICByZXR1cm4ga2luZHJlZFJvdztcclxuICB9XHJcblxyXG4gIGFzeW5jIF9maW5kS2luZHJlZCgpIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkQ2F0ZWdvcnlJbmZvID0gdGhpcy4jY2F0ZWdvcnlDaGVja2JveGVzLmdldFNlbGVjdGVkQ2F0ZWdvcnlJbmZvKCk7XHJcbiAgXHJcbiAgICBjb25zdCBmZXRjaFJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvZmluZC1raW5kcmVkXCIsIHtcclxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzZWxlY3RlZENhdGVnb3J5SW5mbylcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgY29uc3Qga2luZHJlZExpc3QgPSBhd2FpdCBmZXRjaFJlc3BvbnNlLmpzb24oKTtcclxuICBcclxuICAgIHJldHVybiBraW5kcmVkTGlzdDsgIFxyXG4gIH1cclxuXHJcbiAgLy8gVXNlZCBieSB0aGUgbWl4aW4gdG8gZ2V0IGxhdGVzdCBraW5kcmVkLlxyXG4gIGFzeW5jIF9nZXRVcGRhdGVkU291cmNlRGF0YSgpIHtcclxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9maW5kS2luZHJlZCgpOyAgXHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3QuYXNzaWduKEZpbmRLaW5kcmVkTGlzdC5wcm90b3R5cGUsIGtpbmRyZWRSZWNzTWl4aW4pOyIsImltcG9ydCB7IGZhZGVGcm9tVG8gfSBmcm9tIFwiLi9mYWRlVHJhbnNpdGlvbnMubWpzXCI7XHJcblxyXG5cclxuXHJcbi8vIFVzZWQgYnkgdGhlIHJlY29tbWVuZGF0aW9ucyBhbmQgZmluZCBraW5kcmVkIHBhZ2VzIHRvIGZhZGUgYmV0d2VlbiBsb2FkZXJzIFxyXG4vLyBhbmQgbmV3IGNvbnRlbnQgd2hlbiByZWZyZXNoaW5nIHJlY29tbWVuZGF0aW9ucyAvIGtpbmRyZWQuXHJcbmV4cG9ydCBjb25zdCBraW5kcmVkUmVjc01peGluID0ge1xyXG4gIF9yZWJ1aWxkQ29udGVudERpdihkYXRhKSB7XHJcbiAgICB0aGlzLl9jbGVhckNvbnRlbnREaXYoKTtcclxuICAgIHRoaXMuX2J1aWxkQ29udGVudERpdihkYXRhKTtcclxuICB9LFxyXG5cclxuICAvLyBDbGVhciB0aGUgY29udGVudCBpbiB0aGUgbGlzdCBkaXYuXHJcbiAgX2NsZWFyQ29udGVudERpdigpIHtcclxuICAgIHRoaXMuX2NvbnRlbnREaXYucmVwbGFjZUNoaWxkcmVuKCk7XHJcbiAgfSxcclxuXHJcbiAgX3Nob3dMb2FkZXIoKSB7XHJcbiAgICByZXR1cm4gZmFkZUZyb21Ubyh0aGlzLl9jb250ZW50RGl2LCB0aGlzLl9sb2FkZXIpO1xyXG4gIH0sXHJcblxyXG4gIF9oaWRlTG9hZGVyKCkge1xyXG4gICAgcmV0dXJuIGZhZGVGcm9tVG8odGhpcy5fbG9hZGVyLCB0aGlzLl9jb250ZW50RGl2KTtcclxuICB9LFxyXG5cclxuICBhc3luYyBoYW5kbGVVcGRhdGVCdG5DbGljaygpIHtcclxuICAgIGNvbnN0IGxvYWRlclNob3duID0gdGhpcy5fc2hvd0xvYWRlcigpO1xyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMuX2dldFVwZGF0ZWRTb3VyY2VEYXRhKCk7XHJcblxyXG4gICAgLy8gRG9uJ3QgaGlkZSB0aGUgbG9hZGVyIC8gc2hvdyB0aGUgY29udGVudCB1bnRpbCBib3RoIHRoZSBsb2FkZXIgaGFzIFxyXG4gICAgLy8gZmluaXNoZWQgZmFkaW5nIGluIEFORCB0aGUgZG9TdHVmZiBoYXMgYmVlbiBjb21wbGV0ZWQuXHJcbiAgICBhd2FpdCBsb2FkZXJTaG93bjtcclxuICAgIHRoaXMuX3JlYnVpbGRDb250ZW50RGl2KGRhdGEpO1xyXG4gICAgdGhpcy5faGlkZUxvYWRlcigpO1xyXG4gIH0sXHJcblxyXG4gIC8vIFZhbGlkYXRlcyBhbmQgdGhlbiBoYW5kbGVzIHRoZSByZXF1ZXN0IHRvIHVwZGF0ZSwgb3RoZXJ3aXNlIGFsZXJ0cyB3aXRoIFxyXG4gIC8vIHRoZSB2YWxpZGF0aW9uIG1lc3NhZ2UuXHJcbiAgdmFsaWRhdGVIYW5kbGVVcGRhdGUoc2Nyb2xsRWxlbSwgZmFpbFZhbGlkYXRlTXNnKSB7XHJcbiAgICBjb25zdCBpc1ZhbGlkU2VsZWN0aW9ucyA9IHRoaXMuX3ZhbGlkYXRlU2VsZWN0aW9ucygpO1xyXG4gICAgXHJcbiAgICBpZiAoaXNWYWxpZFNlbGVjdGlvbnMpIHtcclxuICAgICAgc2Nyb2xsRWxlbS5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6IFwic21vb3RoXCJ9KTtcclxuICAgICAgdGhpcy5oYW5kbGVVcGRhdGVCdG5DbGljaygpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGFsZXJ0KGZhaWxWYWxpZGF0ZU1zZyk7XHJcbiAgICB9O1xyXG4gIH1cclxufSIsImltcG9ydCB7IGZ1bGx5RmFkZUluLCBmdWxseUZhZGVPdXQgfSBmcm9tIFwiLi9mYWRlVHJhbnNpdGlvbnMubWpzXCI7XHJcblxyXG5cclxuXHJcbi8vIEJ0biB3aXRoIGFzc29jaWF0ZWQgY29udGVudC4gQ29udGVudCBmYWRlcyBpbiB3aGVuIGJ1dHRvbiBpcyBjbGlja2VkIGFuZCBcclxuLy8gZmFkZXMgb3V0IHdoZW4gYW55dGhpbmcgaXMgY2xpY2tlZC4gVXNlZCBieSBpbmZvIGJ1dHRvbnMgYW5kIG5hdiBkcm9wZG93bi5cclxuY2xhc3MgUG9wQnRuIHtcclxuICAjYnRuO1xyXG4gICNjb250ZW50O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwb3BCdG5Db250YWluZXIpIHtcclxuICAgIHRoaXMuI2J0biA9IHBvcEJ0bkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnBvcC1idG5cIik7XHJcbiAgICB0aGlzLiNjb250ZW50ID0gcG9wQnRuQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIucG9wLWJ0bi1jb250ZW50XCIpO1xyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMuI3NldHVwSW5mb0J0bkNsaWNrKHRoaXMuI2J0biwgdGhpcy4jY29udGVudCk7XHJcbiAgfVxyXG5cclxuICAjc2V0dXBJbmZvQnRuQ2xpY2soYnRuLCBjb250ZW50KSB7XHJcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgdGhpcy4jaGFuZGxlSW5mb0J0bkNsaWNrKGJ0biwgY29udGVudCk7XHJcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgI2hhbmRsZUluZm9CdG5DbGljayhidG4sIGNvbnRlbnQpIHtcclxuICAgIGF3YWl0IGZ1bGx5RmFkZUluKGNvbnRlbnQpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGF3YWl0IGZ1bGx5RmFkZU91dChjb250ZW50KTtcclxuICAgICAgdGhpcy4jc2V0dXBJbmZvQnRuQ2xpY2soYnRuLCBjb250ZW50KTtcclxuICAgIH0sIHtvbmNlOiB0cnVlfSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBJbml0cyBhbGwgcG9wIGJ0bnMgb24gYSBwYWdlLlxyXG5mdW5jdGlvbiBzZXR1cFBvcEJ0bnMoKSB7XHJcbiAgY29uc3QgcG9wQnRuQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wLWJ0bi1jb250YWluZXJcIik7XHJcbiAgXHJcbiAgcG9wQnRuQ29udGFpbmVycy5mb3JFYWNoKHBvcEJ0bkNvbnRhaW5lciA9PiB7XHJcbiAgICBjb25zdCBwb3BCdG4gPSBuZXcgUG9wQnRuKHBvcEJ0bkNvbnRhaW5lcik7XHJcbiAgICBwb3BCdG4uaW5pdCgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5zZXR1cFBvcEJ0bnMoKTsiLCIvLyBDbGFzcyB0byBzdG9yZSBjYXRlZ29yeSB0eXBlIGFuZCBjYXRlZ29yeSBpbmZvIGluIGEgdHJlZSBzdHJ1Y3R1cmUgb2YgbmVzdGVkXHJcbi8vIG9iamVjdHMgZm9yIGFsbCBjYXRlZ29yaWVzIHByZXNlbnQuXHJcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeUluZm8ge1xyXG4gIGNhdFR5cGVzID0ge307XHJcblxyXG4gIC8vIFdoZXJlIGNhdEluZm8gaXMgYW4gb3B0aW9uYWwgY2F0ZWdvcnkgaW5mbyBzdHlsZSBvYmplY3QgKGp1c3QgdGhlIGRhdGEsIG5vdCBcclxuICAvLyBhbiBhY3R1YWwgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyAtIGZyb20gd2hlbiBzdHJpbmdpZmllZCBhbmQgc2VudCB1c2luZyBmZXRjaCkuXHJcbiAgLy8gZGJDYXRUeXBlcyBpcyBhIGxpc3Qgb2YgY2F0ZWdvcnlUeXBlIGRvY3VtZW50cyBhcyByZXR1cm5lZCBmcm9tIGRvaW5nIGZpbmQgXHJcbiAgLy8gb2YgY2F0ZWdvcnkgdHlwZXMgaW4gREIuXHJcbiAgY29uc3RydWN0b3IoY2F0SW5mbyA9IG51bGwsIGRiQ2F0VHlwZXMgPSBudWxsKSB7XHJcbiAgICBpZiAoY2F0SW5mbykge1xyXG4gICAgICB0aGlzLmNhdFR5cGVzID0gY2F0SW5mby5jYXRUeXBlcztcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGRiQ2F0VHlwZXMpIHtcclxuICAgICAgdGhpcy4jY29uc3RydWN0RnJvbUNhdFR5cGVzKGRiQ2F0VHlwZXMpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIENvbnN0cnVjdCB0aGlzIGNhdGVnb3J5IGluZm8gYmFzZWQgb24gYSBnaXZlbiBhcnJheSBvZiBjYXRlZ29yeSB0eXBlcyBhbmQgXHJcbiAgLy8gdGhlaXIgbmVzdGVkIGNhdGVnb3JpZXMgKGFzIGEgcmVzdWx0IG9mIGEgZGliIGZpbmQgb24gY2F0ZWdvcnkgdHlwZXMpLlxyXG4gICNjb25zdHJ1Y3RGcm9tQ2F0VHlwZXMoZGJDYXRUeXBlcykge1xyXG4gICAgZm9yIChsZXQgY2F0VHlwZSBvZiBkYkNhdFR5cGVzKSB7XHJcbiAgICAgIGZvciAobGV0IGNhdCBvZiBjYXRUeXBlLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICBjb25zdCBpc1JlY0RhdGEgPSB7aXNSZWNvbW1lbmRhYmxlOiBjYXQuaXNSZWNvbW1lbmRhYmxlfTtcclxuICAgICAgICB0aGlzLmNoZWNrQW5kQWRkQ2F0ZWdvcnlXaXRoVHlwZShjYXRUeXBlLm5hbWUsIGNhdC5uYW1lLCBpc1JlY0RhdGEpO1xyXG4gICAgICB9O1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIEdpdmVuIGEgY2F0ZWdvcnkgdHlwZSBhbmQgY2F0ZWdvcnksIGFkZHMgYm90aCwganVzdCB0aGUgY2F0ZWdvcnksIG9yXHJcbiAgLy8gbmVpdGhlciBvZiB0aGVtIGRlcGVuZGluZyBvbiB3aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoaXMuXHJcbiAgLy8gZGF0YSBzaG91bGQgYmUgYW4gb2JqZWN0IGFuZCBhbGwgdGhlIGtleTogdmFsdWUgcGFpcnMgZnJvbSBkYXRhIHdpbGwgYmVcclxuICAvLyBhZGRlZCBpbiB0byB0aGUgQ2F0ZWdvcnlJbmZvIG9iamVjdCBhdCB0aGUgY29ycmVjdCBwbGFjZS5cclxuICBjaGVja0FuZEFkZENhdGVnb3J5V2l0aFR5cGUoY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lLCBkYXRhID0gbnVsbCkge1xyXG4gICAgY29uc3QgY2F0T3JUeXBlRXhpc3RzID0gdGhpcy5fZG9lc0NhdGVnb3J5T3JUeXBlRXhpc3QoY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lKTtcclxuICAgIGlmIChjYXRPclR5cGVFeGlzdHMgPT09IFwibm9yXCIpe1xyXG4gICAgICB0aGlzLl9hZGRUeXBlQW5kQ2F0ZWdvcnkoY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lLCBkYXRhKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNhdE9yVHlwZUV4aXN0cyA9PT0gXCJ0eXBlT25seVwiKXtcclxuICAgICAgdGhpcy5fYWRkQ2F0ZWdvcnkoY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lLCBkYXRhKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBDcmVhdGVzIGEgY2xvbmUgb2YgdGhpcyBjYXRlZ29yeSBpbmZvIG9iamVjdCBhbmQgcmV0dXJucyBpdCwgYWxvbmcgd2l0aCBuZXcgXHJcbiAgLy8gZGF0YSBmb3IgZWFjaCBjYXRlZ29yeSB3aGljaCBpcyBjYWxjdWxhdGVkIHVzaW5nIHRoZSBoaWdoZXIgb3JkZXIgZ2V0RGF0YUZ1bmMgYW5kIGFyZ3MuXHJcbiAgY2xvbmVXaXRoRGF0YShnZXREYXRhRnVuYywgYXJncykge1xyXG4gICAgY29uc3QgbmV3Q2F0SW5mbyA9IG5ldyBDYXRlZ29yeUluZm8oKTtcclxuXHJcbiAgICBjb25zdCBhbGxDYXRlZ29yaWVzV2l0aFR5cGVzID0gdGhpcy5nZXRBbGxDYXRlZ29yaWVzKCk7XHJcblxyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnlXaXRoVHlwZSBvZiBhbGxDYXRlZ29yaWVzV2l0aFR5cGVzKSB7XHJcbiAgICAgIGNvbnN0IGNhdFR5cGVOYW1lID0gY2F0ZWdvcnlXaXRoVHlwZS5jYXRlZ29yeVR5cGU7XHJcbiAgICAgIGNvbnN0IGNhdGVnb3J5TmFtZSA9IGNhdGVnb3J5V2l0aFR5cGUuY2F0ZWdvcnk7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBnZXREYXRhRnVuYyhjYXRUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lLCBhcmdzKTtcclxuXHJcbiAgICAgIG5ld0NhdEluZm8uY2hlY2tBbmRBZGRDYXRlZ29yeVdpdGhUeXBlKGNhdFR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGRhdGEpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gbmV3Q2F0SW5mbztcclxuICB9XHJcblxyXG4gIC8vIFJldHVybnMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aGVyZSBlYWNoIG9iamVjdCBjb250YWlucyB0aGVcclxuICAvLyBjYXRlZ29yeVR5cGVOYW1lIGFuZCBjYXRlZ29yeU5hbWUsIGZvciBldmVyeSB1bmlxdWUgY2F0ZWdvcnkgaW4gdGhpcy5cclxuICBnZXRBbGxDYXRlZ29yaWVzKGluY2xEYXRhID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IGFsbFVuaXF1ZUNhdGVnb3JpZXMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBjYXRUeXBlIGluIHRoaXMuY2F0VHlwZXMpIHtcclxuICAgICAgZm9yIChsZXQgY2F0ZWdvcnkgaW4gdGhpcy5jYXRUeXBlc1tjYXRUeXBlXT8uY2F0ZWdvcmllcykge1xyXG4gICAgICAgIGNvbnN0IHRoaXNDYXRBbmRUeXBlID0ge1xyXG4gICAgICAgICAgY2F0ZWdvcnlUeXBlOiBjYXRUeXBlLFxyXG4gICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKGluY2xEYXRhKSB7XHJcbiAgICAgICAgICBjb25zdCBjYXREYXRhID0gdGhpcy5jYXRUeXBlc1tjYXRUeXBlXS5jYXRlZ29yaWVzW2NhdGVnb3J5XTtcclxuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBjYXREYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXNDYXRBbmRUeXBlW2tleV0gPSBjYXREYXRhW2tleV07XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFsbFVuaXF1ZUNhdGVnb3JpZXMucHVzaCh0aGlzQ2F0QW5kVHlwZSk7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBhbGxVbmlxdWVDYXRlZ29yaWVzO1xyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJucyBcInR5cGVBbmRDYXRcIiBpZiBjYXRlZ29yeVR5cGUgYW5kIGNhdGVnb3J5IGV4aXN0cyBpbiB0aGUgdHJlZSwgXCJ0eXBlT25seVwiIGlmIG9ubHlcclxuICAvLyB0aGUgY2F0ZWdvcnlUeXBlIGV4aXN0cyBhbmQgXCJub3JcIiBpZiBuZWl0aGVyIHRoZSBjYXRlZ29yeSBub3IgdGhlIGNhdGVnb3J5VHlwZSBleGlzdHMuXHJcbiAgX2RvZXNDYXRlZ29yeU9yVHlwZUV4aXN0KGNhdGVnb3J5VHlwZU5hbWUsIGNhdGVnb3J5TmFtZSl7XHJcbiAgICBpZiAoIShjYXRlZ29yeVR5cGVOYW1lIGluIHRoaXMuY2F0VHlwZXMpKSB7XHJcbiAgICAgIHJldHVybiBcIm5vclwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIShjYXRlZ29yeU5hbWUgaW4gKHRoaXMuY2F0VHlwZXMuY2F0ZWdvcnlUeXBlTmFtZT8uY2F0ZWdvcmllcyA/PyBbXSkpKSB7XHJcbiAgICAgIHJldHVybiBcInR5cGVPbmx5XCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIFwidHlwZUFuZENhdFwiO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIF9hZGRUeXBlQW5kQ2F0ZWdvcnkoY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lLCBkYXRhKXtcclxuICAgIHRoaXMuY2F0VHlwZXNbY2F0ZWdvcnlUeXBlTmFtZV0gPSB7XHJcbiAgICAgIGNhdGVnb3JpZXM6IHt9XHJcbiAgICB9O1xyXG4gICAgdGhpcy5fYWRkQ2F0ZWdvcnkoY2F0ZWdvcnlUeXBlTmFtZSwgY2F0ZWdvcnlOYW1lLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIF9hZGRDYXRlZ29yeShjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGRhdGEpe1xyXG4gICAgdGhpcy5jYXRUeXBlc1tjYXRlZ29yeVR5cGVOYW1lXS5jYXRlZ29yaWVzW2NhdGVnb3J5TmFtZV0gPSBudWxsO1xyXG4gICAgaWYgKGRhdGEpIHtcclxuICAgICAgdGhpcy5fc2V0RGF0YShjYXRlZ29yeVR5cGVOYW1lLCBjYXRlZ29yeU5hbWUsIGRhdGEpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIF9zZXREYXRhKGNhdGVnb3J5VHlwZU5hbWUsIGNhdGVnb3J5TmFtZSwgZGF0YSkge1xyXG4gICAgdGhpcy5jYXRUeXBlc1tjYXRlZ29yeVR5cGVOYW1lXS5jYXRlZ29yaWVzW2NhdGVnb3J5TmFtZV0gPSB7fTtcclxuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcbiAgICAgIHRoaXMuY2F0VHlwZXNbY2F0ZWdvcnlUeXBlTmFtZV0uY2F0ZWdvcmllc1tjYXRlZ29yeU5hbWVdW2tleV0gPSBkYXRhW2tleV07XHJcbiAgICB9O1xyXG4gIH1cclxufSIsIi8vIENsYW1wIG51bWJlciBiZXR3ZWVuIHR3byB2YWx1ZXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcChudW0sIG1pbiwgbWF4KSB7XHJcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG51bSwgbWluKSwgbWF4KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgcHJwcnRuID0gMC41KSB7XHJcbiAgcmV0dXJuIHN0YXJ0ICsgKChlbmQgLSBzdGFydCkgKiBwcnBydG4pO1xyXG59XHJcblxyXG4vLyBGb3IgaW50cywgaXQgaXMgaW5jbHVzaXZlIG9mIHN0YXJ0IGFuZCBub3QgaW5jbHVzaXZlIG9mIGVuZC5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRCZXR3ZWVuKHN0YXJ0ID0gMCwgZW5kID0gMSwgaW50cyA9IGZhbHNlKSB7XHJcbiAgY29uc3QgcmFuZ2UgPSBlbmQgLSBzdGFydDtcclxuICBjb25zdCByYW5kRmxvYXQgPSAoTWF0aC5yYW5kb20oKSAqIHJhbmdlKSArIHN0YXJ0O1xyXG4gIHJldHVybiBpbnRzID8gTWF0aC5mbG9vcihyYW5kRmxvYXQpIDogcmFuZEZsb2F0O1xyXG59XHJcblxyXG4vLyBQcm9iYWJpbGl0eSBzaG91bGQgYmUgYSBkZWNpbWFsLCByZXR1cm5zIHRydWUgb3IgZmFsc2UuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0UmFuZG9tKHByb2JhYmlsaXR5KSB7XHJcbiAgcmV0dXJuIChNYXRoLnJhbmRvbSgpIDw9IHByb2JhYmlsaXR5KSA/IHRydWUgOiBmYWxzZTtcclxufVxyXG5cclxuLy8gVGFrZXMgYSBsaXN0IG9mIHByb2Igb2JqZWN0cyBhcyBpbnB1dCBpbiBmb3JtYXQge25hbWU6IG5hbWUsIHByb2I6IHByb2J9IGFuZCBcclxuLy8gcmV0dXJucyBuYW1lIG9mIGNob3NlbiBwcm9iT2JqLCBvciBmYWxzZSBpZiBub25lIGNob3NlbiAoaW4gY2FzZSB0aGF0IHByb2JPYmpzIFxyXG4vLyBwcm9icyBkb250IHN1bSB0byAxKS5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RSYW5kTXVsdCguLi5wcm9icykge1xyXG4gIGNvbnN0IHByb2JzT2JqcyA9IFtdO1xyXG4gIGxldCBjdXJyUHJvYlN0YXJ0ID0gMDtcclxuXHJcbiAgcHJvYnMuZm9yRWFjaChwcm9iID0+IHtcclxuICAgIGNvbnN0IHRoaXNQcm9iID0ge1xyXG4gICAgICBuYW1lOiBwcm9iLm5hbWUsXHJcbiAgICAgIHN0YXJ0OiBjdXJyUHJvYlN0YXJ0LFxyXG4gICAgICBlbmQ6IGN1cnJQcm9iU3RhcnQgKyBwcm9iLnByb2JcclxuICAgIH07XHJcblxyXG4gICAgcHJvYnNPYmpzLnB1c2godGhpc1Byb2IpO1xyXG5cclxuICAgIGN1cnJQcm9iU3RhcnQgKz0gcHJvYjtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgY2hvc2VuVmFsID0gTWF0aC5yYW5kb20oKTtcclxuICBsZXQgcmV0dXJuVmFsID0gZmFsc2U7XHJcblxyXG4gIHByb2JzT2Jqcy5mb3JFYWNoKHByb2IgPT4ge1xyXG4gICAgY29uc3QgY2hvc2VuVGhpc1Byb2IgPSBwcm9iLnN0YXJ0IDw9IGNob3NlblZhbCAmJiBwcm9iLmVuZCA+IGNob3NlblZhbDtcclxuICAgIGlmIChjaG9zZW5UaGlzUHJvYikge1xyXG4gICAgICByZXR1cm5WYWwgPSBwcm9iLm5hbWU7XHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcmV0dXJuVmFsO1xyXG59XHJcblxyXG4vLyBTZWFyY2hlcyBmb3IgYSBuZXdJdGVtIGluIGFuIGFycmF5IGdpdmVuIGFuIGVsZW1Db21wRnVuYyB0aGF0IGRldGVybWluZXMgXHJcbi8vIHdoZXRoZXIgaXQgaXMgcHJlc2VudCBvciBub3QgKGVnLiB0byBmaW5kIGJhc2VkIG9uIHF1ZXN0aW9uIElEKS4gSWYgcHJlc2VudCwgXHJcbi8vIGVsZW1lbnQgaW4gYXJyYXkgaXMgb3ZlcndyaXR0ZW4gd2l0aCBuZXdJdGVtLCBvdGhlcndpc2UgbmV3SXRlbSBpcyBwdXNoZWQgdG8gXHJcbi8vIGVuZCBvZiBhcnJheS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbmRPdmVyd3JpdGVFbHNlUHVzaChhcnJheSwgbmV3SXRlbSwgZWxlbUNvbXBGdW5jKSB7XHJcbiAgY29uc3QgZm91bmRJbmRleCA9IGFycmF5LmZpbmRJbmRleChhcnJJdGVtID0+IGVsZW1Db21wRnVuYyhhcnJJdGVtLCBuZXdJdGVtKSk7XHJcblxyXG4gIC8vIElmIGZvdW5kLCBvdmVyd3JpdGUuXHJcbiAgaWYgKGZvdW5kSW5kZXggPiAtMSkge1xyXG4gICAgYXJyYXkuc3BsaWNlKGZvdW5kSW5kZXgsIDEsIG5ld0l0ZW0pO1xyXG4gIH1cclxuICAvLyBPdGhlcndpc2UgYWRkLlxyXG4gIGVsc2Uge1xyXG4gICAgYXJyYXkucHVzaChuZXdJdGVtKTtcclxuICB9O1xyXG59XHJcblxyXG4vLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdHJhbnNpdGlvbiBvbiBnaXZlbiBlbGVtZW50IGVuZHMsIFxyXG4vLyBvcHRpb25hbCB0cmFuc2l0aW9uIHByb3BlcnR5IG5hbWUgY2hlY2suXHJcbmV4cG9ydCBmdW5jdGlvbiBhd2FpdFRyYW5zaXRpb24oZWxlbSwgcHJvcE5hbWUgPSBudWxsKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBhc3luYyBldnQgPT4ge1xyXG5cclxuICAgICAgaWYgKHByb3BOYW1lKSB7XHJcbiAgICAgICAgaWYgKGV2dC5wcm9wZXJ0eU5hbWUgPT09IHByb3BOYW1lKSB7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGF3YWl0IGF3YWl0VHJhbnNpdGlvbihlbGVtLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH0sIHtvbmNlOiB0cnVlfSk7XHJcbiAgfSlcclxufVxyXG5cclxuLy8gRm9yIHRlc3RpbmcgbG9uZyBydW5uaW5nIGZ1bmN0aW9ucy5cclxuLy8gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMDApKTsgLy8uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgRmluZEtpbmRyZWRMaXN0IH0gZnJvbSBcIi4uL21vZHVsZXMvZmluZEtpbmRyZWQvZmluZEtpbmRyZWRMaXN0Lm1qc1wiO1xyXG5pbXBvcnQgXCIuL2xvZ2dlZEluUGFnZS5qc1wiO1xyXG5cclxuXHJcblxyXG5jb25zdCBtYWluS2luZHJlZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIua2luZHJlZC1saXN0XCIpO1xyXG5jb25zdCB0aGlzS2luZHJlZExpc3QgPSBuZXcgRmluZEtpbmRyZWRMaXN0KG1haW5LaW5kcmVkRGl2KTtcclxudGhpc0tpbmRyZWRMaXN0LmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=