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
/*!**************************************!*\
  !*** ./src/js/pages/loggedInPage.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_popBtns_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/popBtns.mjs */ "./src/js/modules/popBtns.mjs");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VkSW5QYWdlLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUMyRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxRQUFRLG9FQUFlO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQLFFBQVEsb0VBQWU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRGtFO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssR0FBRyxXQUFXO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLFVBQVUsaUVBQVc7QUFDckI7QUFDQSxZQUFZLGtFQUFZO0FBQ3hCO0FBQ0EsS0FBSyxHQUFHLFdBQVc7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxvREFBb0Qsd0JBQXdCO0FBQzVFO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLEdBQUcsV0FBVztBQUNuQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsNERBQTREOzs7Ozs7VUNoRzVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2ZhZGVUcmFuc2l0aW9ucy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL3BvcEJ0bnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvc2hhcmVkSnMvdXRpbHMubWpzIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBIZWxwZXIgZnVuY3Rpb25zIHRvIGFzc2lzdCB3aXRoIGZhZGluZyBpbiAvIG91dCBET00gZWxlbWVudHMuXHJcbmltcG9ydCB7IGF3YWl0VHJhbnNpdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWRKcy91dGlscy5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gRmFkZSB0cmFuc2l0aW9uIGhlbHBlciBmdW5jdGlvbnMsIHVzZWQgd2l0aCB0cmFuc3BhcmVudCwgZnVsbHktaGlkZGVuIGFuZCBcclxuLy8gZmFkZS10cmFucyBjc3MgY2xhc3Nlcy5cclxuLy8gTWFrZXMgZGlzcGxheSBwcm9wZXJ0eSB2aXNpYmxlIGFuZCB0aGVuIHJlbW92ZXMgdHJhbnNwYXJlbmN5LlxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZUluKGVsZW0pIHtcclxuICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgc2V0VGltZW91dCgoKSA9PiBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc3BhcmVudFwiKSwgMTApO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluaXNoRmFkZUluKGVsZW0pIHtcclxuICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgXCJvcGFjaXR5XCIpO1xyXG59XHJcblxyXG4vLyBGaW5pc2hlcyB3aGVuIGZhZGUgaW4gaXMgY29tcGxldGVkLlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHlGYWRlSW4oZWxlbSkge1xyXG4gIGZhZGVJbihlbGVtKTtcclxuICBhd2FpdCBmaW5pc2hGYWRlSW4oZWxlbSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlT3V0KGVsZW0pIHtcclxuICBlbGVtLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc3BhcmVudFwiKTtcclxufVxyXG5cclxuLy8gRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gb3BhY2l0eSB0cmFuc2l0aW9uIG9uIHRoZSBcclxuLy8gZ2l2ZW4gZWxlbWVudCBpcyBjb21wbGV0ZWQuIEFsc28gZnVsbHkgaGlkZXMgdGhlIGVsZW1lbnQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5pc2hGYWRlT3V0KGVsZW0pIHtcclxuICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgXCJvcGFjaXR5XCIpO1xyXG4gIGVsZW0uY2xhc3NMaXN0LmFkZChcImZ1bGx5LWhpZGRlblwiKTtcclxufVxyXG5cclxuLy8gRmFkZSBvdXQgYW5kIGZ1bGx5IGhpZGUgdGhlIGdpdmVuIGVsZW1lbnQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmdWxseUZhZGVPdXQoZWxlbSkge1xyXG4gIGZhZGVPdXQoZWxlbSk7XHJcbiAgYXdhaXQgZmluaXNoRmFkZU91dChlbGVtKTtcclxufVxyXG5cclxuLy8gRmFkZXMgb3V0IGVsZW0xIGFuZCBmYWRlcyBpbiBlbGVtMiBvbmNlIHRyYW5zaXRpb24gY29tcGxldGVkLCBkb2Vzbid0IGZpbmlzaCBcclxuLy8gdW50aWwgZWxlbTIgZnVsbHkgZmFkZWQgaW4uIFJldHVybnMgcHJvbWlzZS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVGcm9tVG8oZWxlbTEsIGVsZW0yKSB7XHJcbiAgY29uc3QgZmFkZUNvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKGFzeW5jIHJlc29sdmUgPT4ge1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlT3V0KGVsZW0xKTtcclxuICAgIGF3YWl0IGZ1bGx5RmFkZUluKGVsZW0yKTtcclxuICAgIHJlc29sdmUoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGZhZGVDb21wbGV0ZVByb21pc2U7XHJcbn0iLCJpbXBvcnQgeyBmdWxseUZhZGVJbiwgZnVsbHlGYWRlT3V0IH0gZnJvbSBcIi4vZmFkZVRyYW5zaXRpb25zLm1qc1wiO1xyXG5cclxuXHJcblxyXG4vLyBCdG4gd2l0aCBhc3NvY2lhdGVkIGNvbnRlbnQuIENvbnRlbnQgZmFkZXMgaW4gd2hlbiBidXR0b24gaXMgY2xpY2tlZCBhbmQgXHJcbi8vIGZhZGVzIG91dCB3aGVuIGFueXRoaW5nIGlzIGNsaWNrZWQuIFVzZWQgYnkgaW5mbyBidXR0b25zIGFuZCBuYXYgZHJvcGRvd24uXHJcbmNsYXNzIFBvcEJ0biB7XHJcbiAgI2J0bjtcclxuICAjY29udGVudDtcclxuXHJcbiAgY29uc3RydWN0b3IocG9wQnRuQ29udGFpbmVyKSB7XHJcbiAgICB0aGlzLiNidG4gPSBwb3BCdG5Db250YWluZXIucXVlcnlTZWxlY3RvcihcIi5wb3AtYnRuXCIpO1xyXG4gICAgdGhpcy4jY29udGVudCA9IHBvcEJ0bkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnBvcC1idG4tY29udGVudFwiKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLiNzZXR1cEluZm9CdG5DbGljayh0aGlzLiNidG4sIHRoaXMuI2NvbnRlbnQpO1xyXG4gIH1cclxuXHJcbiAgI3NldHVwSW5mb0J0bkNsaWNrKGJ0biwgY29udGVudCkge1xyXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgIHRoaXMuI2hhbmRsZUluZm9CdG5DbGljayhidG4sIGNvbnRlbnQpO1xyXG4gICAgfSwge29uY2U6IHRydWV9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jICNoYW5kbGVJbmZvQnRuQ2xpY2soYnRuLCBjb250ZW50KSB7XHJcbiAgICBhd2FpdCBmdWxseUZhZGVJbihjb250ZW50KTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICBhd2FpdCBmdWxseUZhZGVPdXQoY29udGVudCk7XHJcbiAgICAgIHRoaXMuI3NldHVwSW5mb0J0bkNsaWNrKGJ0biwgY29udGVudCk7XHJcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xyXG4gIH1cclxufVxyXG5cclxuLy8gSW5pdHMgYWxsIHBvcCBidG5zIG9uIGEgcGFnZS5cclxuZnVuY3Rpb24gc2V0dXBQb3BCdG5zKCkge1xyXG4gIGNvbnN0IHBvcEJ0bkNvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcC1idG4tY29udGFpbmVyXCIpO1xyXG4gIFxyXG4gIHBvcEJ0bkNvbnRhaW5lcnMuZm9yRWFjaChwb3BCdG5Db250YWluZXIgPT4ge1xyXG4gICAgY29uc3QgcG9wQnRuID0gbmV3IFBvcEJ0bihwb3BCdG5Db250YWluZXIpO1xyXG4gICAgcG9wQnRuLmluaXQoKTtcclxuICB9KTtcclxufVxyXG5cclxuc2V0dXBQb3BCdG5zKCk7IiwiLy8gQ2xhbXAgbnVtYmVyIGJldHdlZW4gdHdvIHZhbHVlcy5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKG51bSwgbWluLCBtYXgpIHtcclxuICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobnVtLCBtaW4pLCBtYXgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCBwcnBydG4gPSAwLjUpIHtcclxuICByZXR1cm4gc3RhcnQgKyAoKGVuZCAtIHN0YXJ0KSAqIHBycHJ0bik7XHJcbn1cclxuXHJcbi8vIEZvciBpbnRzLCBpdCBpcyBpbmNsdXNpdmUgb2Ygc3RhcnQgYW5kIG5vdCBpbmNsdXNpdmUgb2YgZW5kLlxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZEJldHdlZW4oc3RhcnQgPSAwLCBlbmQgPSAxLCBpbnRzID0gZmFsc2UpIHtcclxuICBjb25zdCByYW5nZSA9IGVuZCAtIHN0YXJ0O1xyXG4gIGNvbnN0IHJhbmRGbG9hdCA9IChNYXRoLnJhbmRvbSgpICogcmFuZ2UpICsgc3RhcnQ7XHJcbiAgcmV0dXJuIGludHMgPyBNYXRoLmZsb29yKHJhbmRGbG9hdCkgOiByYW5kRmxvYXQ7XHJcbn1cclxuXHJcbi8vIFByb2JhYmlsaXR5IHNob3VsZCBiZSBhIGRlY2ltYWwsIHJldHVybnMgdHJ1ZSBvciBmYWxzZS5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RSYW5kb20ocHJvYmFiaWxpdHkpIHtcclxuICByZXR1cm4gKE1hdGgucmFuZG9tKCkgPD0gcHJvYmFiaWxpdHkpID8gdHJ1ZSA6IGZhbHNlO1xyXG59XHJcblxyXG4vLyBUYWtlcyBhIGxpc3Qgb2YgcHJvYiBvYmplY3RzIGFzIGlucHV0IGluIGZvcm1hdCB7bmFtZTogbmFtZSwgcHJvYjogcHJvYn0gYW5kIFxyXG4vLyByZXR1cm5zIG5hbWUgb2YgY2hvc2VuIHByb2JPYmosIG9yIGZhbHNlIGlmIG5vbmUgY2hvc2VuIChpbiBjYXNlIHRoYXQgcHJvYk9ianMgXHJcbi8vIHByb2JzIGRvbnQgc3VtIHRvIDEpLlxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdFJhbmRNdWx0KC4uLnByb2JzKSB7XHJcbiAgY29uc3QgcHJvYnNPYmpzID0gW107XHJcbiAgbGV0IGN1cnJQcm9iU3RhcnQgPSAwO1xyXG5cclxuICBwcm9icy5mb3JFYWNoKHByb2IgPT4ge1xyXG4gICAgY29uc3QgdGhpc1Byb2IgPSB7XHJcbiAgICAgIG5hbWU6IHByb2IubmFtZSxcclxuICAgICAgc3RhcnQ6IGN1cnJQcm9iU3RhcnQsXHJcbiAgICAgIGVuZDogY3VyclByb2JTdGFydCArIHByb2IucHJvYlxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9ic09ianMucHVzaCh0aGlzUHJvYik7XHJcblxyXG4gICAgY3VyclByb2JTdGFydCArPSBwcm9iO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBjaG9zZW5WYWwgPSBNYXRoLnJhbmRvbSgpO1xyXG4gIGxldCByZXR1cm5WYWwgPSBmYWxzZTtcclxuXHJcbiAgcHJvYnNPYmpzLmZvckVhY2gocHJvYiA9PiB7XHJcbiAgICBjb25zdCBjaG9zZW5UaGlzUHJvYiA9IHByb2Iuc3RhcnQgPD0gY2hvc2VuVmFsICYmIHByb2IuZW5kID4gY2hvc2VuVmFsO1xyXG4gICAgaWYgKGNob3NlblRoaXNQcm9iKSB7XHJcbiAgICAgIHJldHVyblZhbCA9IHByb2IubmFtZTtcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByZXR1cm5WYWw7XHJcbn1cclxuXHJcbi8vIFNlYXJjaGVzIGZvciBhIG5ld0l0ZW0gaW4gYW4gYXJyYXkgZ2l2ZW4gYW4gZWxlbUNvbXBGdW5jIHRoYXQgZGV0ZXJtaW5lcyBcclxuLy8gd2hldGhlciBpdCBpcyBwcmVzZW50IG9yIG5vdCAoZWcuIHRvIGZpbmQgYmFzZWQgb24gcXVlc3Rpb24gSUQpLiBJZiBwcmVzZW50LCBcclxuLy8gZWxlbWVudCBpbiBhcnJheSBpcyBvdmVyd3JpdHRlbiB3aXRoIG5ld0l0ZW0sIG90aGVyd2lzZSBuZXdJdGVtIGlzIHB1c2hlZCB0byBcclxuLy8gZW5kIG9mIGFycmF5LlxyXG5leHBvcnQgZnVuY3Rpb24gZmluZEFuZE92ZXJ3cml0ZUVsc2VQdXNoKGFycmF5LCBuZXdJdGVtLCBlbGVtQ29tcEZ1bmMpIHtcclxuICBjb25zdCBmb3VuZEluZGV4ID0gYXJyYXkuZmluZEluZGV4KGFyckl0ZW0gPT4gZWxlbUNvbXBGdW5jKGFyckl0ZW0sIG5ld0l0ZW0pKTtcclxuXHJcbiAgLy8gSWYgZm91bmQsIG92ZXJ3cml0ZS5cclxuICBpZiAoZm91bmRJbmRleCA+IC0xKSB7XHJcbiAgICBhcnJheS5zcGxpY2UoZm91bmRJbmRleCwgMSwgbmV3SXRlbSk7XHJcbiAgfVxyXG4gIC8vIE90aGVyd2lzZSBhZGQuXHJcbiAgZWxzZSB7XHJcbiAgICBhcnJheS5wdXNoKG5ld0l0ZW0pO1xyXG4gIH07XHJcbn1cclxuXHJcbi8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0cmFuc2l0aW9uIG9uIGdpdmVuIGVsZW1lbnQgZW5kcywgXHJcbi8vIG9wdGlvbmFsIHRyYW5zaXRpb24gcHJvcGVydHkgbmFtZSBjaGVjay5cclxuZXhwb3J0IGZ1bmN0aW9uIGF3YWl0VHJhbnNpdGlvbihlbGVtLCBwcm9wTmFtZSA9IG51bGwpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGFzeW5jIGV2dCA9PiB7XHJcblxyXG4gICAgICBpZiAocHJvcE5hbWUpIHtcclxuICAgICAgICBpZiAoZXZ0LnByb3BlcnR5TmFtZSA9PT0gcHJvcE5hbWUpIHtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgYXdhaXQgYXdhaXRUcmFuc2l0aW9uKGVsZW0sIHByb3BOYW1lKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfSwge29uY2U6IHRydWV9KTtcclxuICB9KVxyXG59XHJcblxyXG4vLyBGb3IgdGVzdGluZyBsb25nIHJ1bm5pbmcgZnVuY3Rpb25zLlxyXG4vLyBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzAwMCkpOyAvLy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=