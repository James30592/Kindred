/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!*******************************!*\
  !*** ./src/js/pages/admin.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _loggedInPage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loggedInPage.js */ "./src/js/pages/loggedInPage.js");




const createUsersBtn = document.querySelector(".create-users");
const createUsersInput = document.querySelector("input[name='create-users-num']")

createUsersBtn.addEventListener("click", createUsers);


async function createUsers(){
  const data = {numNewUsers: createUsersInput.value};

  const fetchResponse = await fetch("/admin/createAutoUsers", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  const svrMsg = await fetchResponse.text();

  // Update the log.
  const element = document.querySelector(".admin-log");
  element.textContent = "";

  const para = document.createElement("p");
  const node = document.createTextNode(svrMsg);
  para.appendChild(node);
  element.appendChild(para);

  setTimeout(function(){
    element.textContent = ""
  }, 5000);
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQzJEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQLFFBQVEsb0VBQWU7QUFDdkI7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsUUFBUSxvRUFBZTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xEa0U7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxHQUFHLFdBQVc7QUFDbkI7QUFDQTtBQUNBO0FBQ0EsVUFBVSxpRUFBVztBQUNyQjtBQUNBLFlBQVksa0VBQVk7QUFDeEI7QUFDQSxLQUFLLEdBQUcsV0FBVztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFNUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCx3QkFBd0I7QUFDNUU7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssR0FBRyxXQUFXO0FBQ25CLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7Ozs7OztVQ2hHNUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ04yQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQSxjQUFjLG1DQUFtQztBQUNqRDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9mYWRlVHJhbnNpdGlvbnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9wb3BCdG5zLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL3BhZ2VzL2xvZ2dlZEluUGFnZS5qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL3NoYXJlZEpzL3V0aWxzLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9wYWdlcy9hZG1pbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBIZWxwZXIgZnVuY3Rpb25zIHRvIGFzc2lzdCB3aXRoIGZhZGluZyBpbiAvIG91dCBET00gZWxlbWVudHMuXHJcbmltcG9ydCB7IGF3YWl0VHJhbnNpdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWRKcy91dGlscy5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gRmFkZSB0cmFuc2l0aW9uIGhlbHBlciBmdW5jdGlvbnMsIHVzZWQgd2l0aCB0cmFuc3BhcmVudCwgZnVsbHktaGlkZGVuIGFuZCBcclxuLy8gZmFkZS10cmFucyBjc3MgY2xhc3Nlcy5cclxuLy8gTWFrZXMgZGlzcGxheSBwcm9wZXJ0eSB2aXNpYmxlIGFuZCB0aGVuIHJlbW92ZXMgdHJhbnNwYXJlbmN5LlxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZUluKGVsZW0pIHtcclxuICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgc2V0VGltZW91dCgoKSA9PiBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc3BhcmVudFwiKSwgMTApO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluaXNoRmFkZUluKGVsZW0pIHtcclxuICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgXCJvcGFjaXR5XCIpO1xyXG59XHJcblxyXG4vLyBGaW5pc2hlcyB3aGVuIGZhZGUgaW4gaXMgY29tcGxldGVkLlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHlGYWRlSW4oZWxlbSkge1xyXG4gIGZhZGVJbihlbGVtKTtcclxuICBhd2FpdCBmaW5pc2hGYWRlSW4oZWxlbSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlT3V0KGVsZW0pIHtcclxuICBlbGVtLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc3BhcmVudFwiKTtcclxufVxyXG5cclxuLy8gRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gb3BhY2l0eSB0cmFuc2l0aW9uIG9uIHRoZSBcclxuLy8gZ2l2ZW4gZWxlbWVudCBpcyBjb21wbGV0ZWQuIEFsc28gZnVsbHkgaGlkZXMgdGhlIGVsZW1lbnQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5pc2hGYWRlT3V0KGVsZW0pIHtcclxuICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgXCJvcGFjaXR5XCIpO1xyXG4gIGVsZW0uY2xhc3NMaXN0LmFkZChcImZ1bGx5LWhpZGRlblwiKTtcclxufVxyXG5cclxuLy8gRmFkZSBvdXQgYW5kIGZ1bGx5IGhpZGUgdGhlIGdpdmVuIGVsZW1lbnQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmdWxseUZhZGVPdXQoZWxlbSkge1xyXG4gIGZhZGVPdXQoZWxlbSk7XHJcbiAgYXdhaXQgZmluaXNoRmFkZU91dChlbGVtKTtcclxufVxyXG5cclxuLy8gRmFkZXMgb3V0IGVsZW0xIGFuZCBmYWRlcyBpbiBlbGVtMiBvbmNlIHRyYW5zaXRpb24gY29tcGxldGVkLCBkb2Vzbid0IGZpbmlzaCBcclxuLy8gdW50aWwgZWxlbTIgZnVsbHkgZmFkZWQgaW4uIFJldHVybnMgcHJvbWlzZS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVGcm9tVG8oZWxlbTEsIGVsZW0yKSB7XHJcbiAgY29uc3QgZmFkZUNvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKGFzeW5jIHJlc29sdmUgPT4ge1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlT3V0KGVsZW0xKTtcclxuICAgIGF3YWl0IGZ1bGx5RmFkZUluKGVsZW0yKTtcclxuICAgIHJlc29sdmUoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGZhZGVDb21wbGV0ZVByb21pc2U7XHJcbn0iLCJpbXBvcnQgeyBmdWxseUZhZGVJbiwgZnVsbHlGYWRlT3V0IH0gZnJvbSBcIi4vZmFkZVRyYW5zaXRpb25zLm1qc1wiO1xyXG5cclxuXHJcblxyXG4vLyBCdG4gd2l0aCBhc3NvY2lhdGVkIGNvbnRlbnQuIENvbnRlbnQgZmFkZXMgaW4gd2hlbiBidXR0b24gaXMgY2xpY2tlZCBhbmQgXHJcbi8vIGZhZGVzIG91dCB3aGVuIGFueXRoaW5nIGlzIGNsaWNrZWQuIFVzZWQgYnkgaW5mbyBidXR0b25zIGFuZCBuYXYgZHJvcGRvd24uXHJcbmNsYXNzIFBvcEJ0biB7XHJcbiAgI2J0bjtcclxuICAjY29udGVudDtcclxuXHJcbiAgY29uc3RydWN0b3IocG9wQnRuQ29udGFpbmVyKSB7XHJcbiAgICB0aGlzLiNidG4gPSBwb3BCdG5Db250YWluZXIucXVlcnlTZWxlY3RvcihcIi5wb3AtYnRuXCIpO1xyXG4gICAgdGhpcy4jY29udGVudCA9IHBvcEJ0bkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnBvcC1idG4tY29udGVudFwiKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLiNzZXR1cEluZm9CdG5DbGljayh0aGlzLiNidG4sIHRoaXMuI2NvbnRlbnQpO1xyXG4gIH1cclxuXHJcbiAgI3NldHVwSW5mb0J0bkNsaWNrKGJ0biwgY29udGVudCkge1xyXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuI2hhbmRsZUluZm9CdG5DbGljayhidG4sIGNvbnRlbnQpO1xyXG4gICAgfSwge29uY2U6IHRydWV9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jICNoYW5kbGVJbmZvQnRuQ2xpY2soYnRuLCBjb250ZW50KSB7XHJcbiAgICBhd2FpdCBmdWxseUZhZGVJbihjb250ZW50KTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICBhd2FpdCBmdWxseUZhZGVPdXQoY29udGVudCk7XHJcbiAgICAgIHRoaXMuI3NldHVwSW5mb0J0bkNsaWNrKGJ0biwgY29udGVudCk7XHJcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xyXG4gIH1cclxufVxyXG5cclxuLy8gSW5pdHMgYWxsIHBvcCBidG5zIG9uIGEgcGFnZS5cclxuZnVuY3Rpb24gc2V0dXBQb3BCdG5zKCkge1xyXG4gIGNvbnN0IHBvcEJ0bkNvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcC1idG4tY29udGFpbmVyXCIpO1xyXG4gIFxyXG4gIHBvcEJ0bkNvbnRhaW5lcnMuZm9yRWFjaChwb3BCdG5Db250YWluZXIgPT4ge1xyXG4gICAgY29uc3QgcG9wQnRuID0gbmV3IFBvcEJ0bihwb3BCdG5Db250YWluZXIpO1xyXG4gICAgcG9wQnRuLmluaXQoKTtcclxuICB9KTtcclxufVxyXG5cclxuc2V0dXBQb3BCdG5zKCk7IiwiaW1wb3J0IFwiLi4vbW9kdWxlcy9wb3BCdG5zLm1qc1wiOyIsIi8vIENsYW1wIG51bWJlciBiZXR3ZWVuIHR3byB2YWx1ZXMuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcChudW0sIG1pbiwgbWF4KSB7XHJcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG51bSwgbWluKSwgbWF4KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxlcnAoc3RhcnQsIGVuZCwgcHJwcnRuID0gMC41KSB7XHJcbiAgcmV0dXJuIHN0YXJ0ICsgKChlbmQgLSBzdGFydCkgKiBwcnBydG4pO1xyXG59XHJcblxyXG4vLyBGb3IgaW50cywgaXQgaXMgaW5jbHVzaXZlIG9mIHN0YXJ0IGFuZCBub3QgaW5jbHVzaXZlIG9mIGVuZC5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRCZXR3ZWVuKHN0YXJ0ID0gMCwgZW5kID0gMSwgaW50cyA9IGZhbHNlKSB7XHJcbiAgY29uc3QgcmFuZ2UgPSBlbmQgLSBzdGFydDtcclxuICBjb25zdCByYW5kRmxvYXQgPSAoTWF0aC5yYW5kb20oKSAqIHJhbmdlKSArIHN0YXJ0O1xyXG4gIHJldHVybiBpbnRzID8gTWF0aC5mbG9vcihyYW5kRmxvYXQpIDogcmFuZEZsb2F0O1xyXG59XHJcblxyXG4vLyBQcm9iYWJpbGl0eSBzaG91bGQgYmUgYSBkZWNpbWFsLCByZXR1cm5zIHRydWUgb3IgZmFsc2UuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0UmFuZG9tKHByb2JhYmlsaXR5KSB7XHJcbiAgcmV0dXJuIChNYXRoLnJhbmRvbSgpIDw9IHByb2JhYmlsaXR5KSA/IHRydWUgOiBmYWxzZTtcclxufVxyXG5cclxuLy8gVGFrZXMgYSBsaXN0IG9mIHByb2Igb2JqZWN0cyBhcyBpbnB1dCBpbiBmb3JtYXQge25hbWU6IG5hbWUsIHByb2I6IHByb2J9IGFuZCBcclxuLy8gcmV0dXJucyBuYW1lIG9mIGNob3NlbiBwcm9iT2JqLCBvciBmYWxzZSBpZiBub25lIGNob3NlbiAoaW4gY2FzZSB0aGF0IHByb2JPYmpzIFxyXG4vLyBwcm9icyBkb250IHN1bSB0byAxKS5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RSYW5kTXVsdCguLi5wcm9icykge1xyXG4gIGNvbnN0IHByb2JzT2JqcyA9IFtdO1xyXG4gIGxldCBjdXJyUHJvYlN0YXJ0ID0gMDtcclxuXHJcbiAgcHJvYnMuZm9yRWFjaChwcm9iID0+IHtcclxuICAgIGNvbnN0IHRoaXNQcm9iID0ge1xyXG4gICAgICBuYW1lOiBwcm9iLm5hbWUsXHJcbiAgICAgIHN0YXJ0OiBjdXJyUHJvYlN0YXJ0LFxyXG4gICAgICBlbmQ6IGN1cnJQcm9iU3RhcnQgKyBwcm9iLnByb2JcclxuICAgIH07XHJcblxyXG4gICAgcHJvYnNPYmpzLnB1c2godGhpc1Byb2IpO1xyXG5cclxuICAgIGN1cnJQcm9iU3RhcnQgKz0gcHJvYjtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgY2hvc2VuVmFsID0gTWF0aC5yYW5kb20oKTtcclxuICBsZXQgcmV0dXJuVmFsID0gZmFsc2U7XHJcblxyXG4gIHByb2JzT2Jqcy5mb3JFYWNoKHByb2IgPT4ge1xyXG4gICAgY29uc3QgY2hvc2VuVGhpc1Byb2IgPSBwcm9iLnN0YXJ0IDw9IGNob3NlblZhbCAmJiBwcm9iLmVuZCA+IGNob3NlblZhbDtcclxuICAgIGlmIChjaG9zZW5UaGlzUHJvYikge1xyXG4gICAgICByZXR1cm5WYWwgPSBwcm9iLm5hbWU7XHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcmV0dXJuVmFsO1xyXG59XHJcblxyXG4vLyBTZWFyY2hlcyBmb3IgYSBuZXdJdGVtIGluIGFuIGFycmF5IGdpdmVuIGFuIGVsZW1Db21wRnVuYyB0aGF0IGRldGVybWluZXMgXHJcbi8vIHdoZXRoZXIgaXQgaXMgcHJlc2VudCBvciBub3QgKGVnLiB0byBmaW5kIGJhc2VkIG9uIHF1ZXN0aW9uIElEKS4gSWYgcHJlc2VudCwgXHJcbi8vIGVsZW1lbnQgaW4gYXJyYXkgaXMgb3ZlcndyaXR0ZW4gd2l0aCBuZXdJdGVtLCBvdGhlcndpc2UgbmV3SXRlbSBpcyBwdXNoZWQgdG8gXHJcbi8vIGVuZCBvZiBhcnJheS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbmRPdmVyd3JpdGVFbHNlUHVzaChhcnJheSwgbmV3SXRlbSwgZWxlbUNvbXBGdW5jKSB7XHJcbiAgY29uc3QgZm91bmRJbmRleCA9IGFycmF5LmZpbmRJbmRleChhcnJJdGVtID0+IGVsZW1Db21wRnVuYyhhcnJJdGVtLCBuZXdJdGVtKSk7XHJcblxyXG4gIC8vIElmIGZvdW5kLCBvdmVyd3JpdGUuXHJcbiAgaWYgKGZvdW5kSW5kZXggPiAtMSkge1xyXG4gICAgYXJyYXkuc3BsaWNlKGZvdW5kSW5kZXgsIDEsIG5ld0l0ZW0pO1xyXG4gIH1cclxuICAvLyBPdGhlcndpc2UgYWRkLlxyXG4gIGVsc2Uge1xyXG4gICAgYXJyYXkucHVzaChuZXdJdGVtKTtcclxuICB9O1xyXG59XHJcblxyXG4vLyBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdHJhbnNpdGlvbiBvbiBnaXZlbiBlbGVtZW50IGVuZHMsIFxyXG4vLyBvcHRpb25hbCB0cmFuc2l0aW9uIHByb3BlcnR5IG5hbWUgY2hlY2suXHJcbmV4cG9ydCBmdW5jdGlvbiBhd2FpdFRyYW5zaXRpb24oZWxlbSwgcHJvcE5hbWUgPSBudWxsKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBhc3luYyBldnQgPT4ge1xyXG5cclxuICAgICAgaWYgKHByb3BOYW1lKSB7XHJcbiAgICAgICAgaWYgKGV2dC5wcm9wZXJ0eU5hbWUgPT09IHByb3BOYW1lKSB7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGF3YWl0IGF3YWl0VHJhbnNpdGlvbihlbGVtLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9O1xyXG5cclxuICAgIH0sIHtvbmNlOiB0cnVlfSk7XHJcbiAgfSlcclxufVxyXG5cclxuLy8gRm9yIHRlc3RpbmcgbG9uZyBydW5uaW5nIGZ1bmN0aW9ucy5cclxuLy8gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMDApKTsgLy8uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9sb2dnZWRJblBhZ2UuanNcIjtcclxuXHJcblxyXG5cclxuY29uc3QgY3JlYXRlVXNlcnNCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNyZWF0ZS11c2Vyc1wiKTtcclxuY29uc3QgY3JlYXRlVXNlcnNJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFtuYW1lPSdjcmVhdGUtdXNlcnMtbnVtJ11cIilcclxuXHJcbmNyZWF0ZVVzZXJzQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjcmVhdGVVc2Vycyk7XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlVXNlcnMoKXtcclxuICBjb25zdCBkYXRhID0ge251bU5ld1VzZXJzOiBjcmVhdGVVc2Vyc0lucHV0LnZhbHVlfTtcclxuXHJcbiAgY29uc3QgZmV0Y2hSZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FkbWluL2NyZWF0ZUF1dG9Vc2Vyc1wiLCB7XHJcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSlcclxuICB9KTtcclxuICBjb25zdCBzdnJNc2cgPSBhd2FpdCBmZXRjaFJlc3BvbnNlLnRleHQoKTtcclxuXHJcbiAgLy8gVXBkYXRlIHRoZSBsb2cuXHJcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWRtaW4tbG9nXCIpO1xyXG4gIGVsZW1lbnQudGV4dENvbnRlbnQgPSBcIlwiO1xyXG5cclxuICBjb25zdCBwYXJhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN2ck1zZyk7XHJcbiAgcGFyYS5hcHBlbmRDaGlsZChub2RlKTtcclxuICBlbGVtZW50LmFwcGVuZENoaWxkKHBhcmEpO1xyXG5cclxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gXCJcIlxyXG4gIH0sIDUwMDApO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==