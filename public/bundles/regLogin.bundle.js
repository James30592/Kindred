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
  !*** ./src/js/modules/regLogin.mjs ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _centreModal_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./centreModal.mjs */ "./src/js/modules/centreModal.mjs");




const regLoginForm = document.querySelector(".reg-login-form");
const regLoginErrorModalWrapper = document.querySelector(".centre-modal-wrapper");
const regLoginErrorModal = new _centreModal_mjs__WEBPACK_IMPORTED_MODULE_0__.CentreModal(regLoginErrorModalWrapper);
regLoginErrorModal.init();

regLoginForm.addEventListener("submit", evt => {
  evt.preventDefault();
  handleRegLoginClick(evt);
});

async function handleRegLoginClick(evt) {
  const form = evt.currentTarget;
  const formData = new FormData(form);
  const formDataObj = Object.fromEntries(formData.entries());

  const fetchResponse = await fetch(form.action, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formDataObj)
  });

  const userRegLoginResponse = await fetchResponse.json();

  if (userRegLoginResponse.status === "success") {
    console.log(`redirecting to ${userRegLoginResponse.redirectTo}`);
    window.location.assign(userRegLoginResponse.redirectTo)
  }
  else {
    regLoginErrorModal.show();
  };
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnTG9naW4uYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSw0REFBTTtBQUNWO0FBQ0E7QUFDQTtBQUNBLElBQUksa0VBQVk7QUFDaEI7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakNBO0FBQzJEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQLFFBQVEsb0VBQWU7QUFDdkI7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsUUFBUSxvRUFBZTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbERBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCx3QkFBd0I7QUFDNUU7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssR0FBRyxXQUFXO0FBQ25CLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7Ozs7OztVQ2hHNUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05nRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHlEQUFXO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsbUNBQW1DO0FBQ2pEO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLGdDQUFnQztBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvY2VudHJlTW9kYWwubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9mYWRlVHJhbnNpdGlvbnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvc2hhcmVkSnMvdXRpbHMubWpzIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcmVnTG9naW4ubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZhZGVJbiwgZnVsbHlGYWRlT3V0IH0gZnJvbSBcIi4vZmFkZVRyYW5zaXRpb25zLm1qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2VudHJlTW9kYWwge1xyXG4gIHdyYXBwZXI7XHJcbiAgI21vZGFsO1xyXG4gICNjbG9zZU1vZGFsQnRuO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih3cmFwcGVyKSB7XHJcbiAgICB0aGlzLndyYXBwZXIgPSB3cmFwcGVyO1xyXG4gICAgdGhpcy4jbW9kYWwgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY2VudHJlLW1vZGFsXCIpO1xyXG4gICAgdGhpcy4jY2xvc2VNb2RhbEJ0biA9IHRoaXMuI21vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdXAgdGhlIGV2ZW50IGxpc3RlbmVycy5cclxuICBpbml0KCkge1xyXG4gICAgY29uc3QgY2xvc2VNb2RhbEVsZW1zID0gW3RoaXMuI2Nsb3NlTW9kYWxCdG4sIHRoaXMud3JhcHBlcl07XHJcblxyXG4gICAgZm9yIChsZXQgY2xvc2VNb2RhbEVsZW0gb2YgY2xvc2VNb2RhbEVsZW1zKSB7XHJcbiAgICAgIGNsb3NlTW9kYWxFbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmhpZGUoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuI21vZGFsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldnQgPT4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpKTtcclxuICB9XHJcblxyXG4gIHNob3coKSB7XHJcbiAgICBmYWRlSW4odGhpcy53cmFwcGVyKTtcclxuICB9XHJcblxyXG4gIGhpZGUoKSB7XHJcbiAgICBmdWxseUZhZGVPdXQodGhpcy53cmFwcGVyKTtcclxuICB9XHJcbn0iLCIvLyBIZWxwZXIgZnVuY3Rpb25zIHRvIGFzc2lzdCB3aXRoIGZhZGluZyBpbiAvIG91dCBET00gZWxlbWVudHMuXHJcbmltcG9ydCB7IGF3YWl0VHJhbnNpdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWRKcy91dGlscy5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gRmFkZSB0cmFuc2l0aW9uIGhlbHBlciBmdW5jdGlvbnMsIHVzZWQgd2l0aCB0cmFuc3BhcmVudCwgZnVsbHktaGlkZGVuIGFuZCBcclxuLy8gZmFkZS10cmFucyBjc3MgY2xhc3Nlcy5cclxuLy8gTWFrZXMgZGlzcGxheSBwcm9wZXJ0eSB2aXNpYmxlIGFuZCB0aGVuIHJlbW92ZXMgdHJhbnNwYXJlbmN5LlxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZUluKGVsZW0pIHtcclxuICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgc2V0VGltZW91dCgoKSA9PiBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc3BhcmVudFwiKSwgMTApO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluaXNoRmFkZUluKGVsZW0pIHtcclxuICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgXCJvcGFjaXR5XCIpO1xyXG59XHJcblxyXG4vLyBGaW5pc2hlcyB3aGVuIGZhZGUgaW4gaXMgY29tcGxldGVkLlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHlGYWRlSW4oZWxlbSkge1xyXG4gIGZhZGVJbihlbGVtKTtcclxuICBhd2FpdCBmaW5pc2hGYWRlSW4oZWxlbSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlT3V0KGVsZW0pIHtcclxuICBlbGVtLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc3BhcmVudFwiKTtcclxufVxyXG5cclxuLy8gRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gb3BhY2l0eSB0cmFuc2l0aW9uIG9uIHRoZSBcclxuLy8gZ2l2ZW4gZWxlbWVudCBpcyBjb21wbGV0ZWQuIEFsc28gZnVsbHkgaGlkZXMgdGhlIGVsZW1lbnQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5pc2hGYWRlT3V0KGVsZW0pIHtcclxuICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgXCJvcGFjaXR5XCIpO1xyXG4gIGVsZW0uY2xhc3NMaXN0LmFkZChcImZ1bGx5LWhpZGRlblwiKTtcclxufVxyXG5cclxuLy8gRmFkZSBvdXQgYW5kIGZ1bGx5IGhpZGUgdGhlIGdpdmVuIGVsZW1lbnQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmdWxseUZhZGVPdXQoZWxlbSkge1xyXG4gIGZhZGVPdXQoZWxlbSk7XHJcbiAgYXdhaXQgZmluaXNoRmFkZU91dChlbGVtKTtcclxufVxyXG5cclxuLy8gRmFkZXMgb3V0IGVsZW0xIGFuZCBmYWRlcyBpbiBlbGVtMiBvbmNlIHRyYW5zaXRpb24gY29tcGxldGVkLCBkb2Vzbid0IGZpbmlzaCBcclxuLy8gdW50aWwgZWxlbTIgZnVsbHkgZmFkZWQgaW4uIFJldHVybnMgcHJvbWlzZS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVGcm9tVG8oZWxlbTEsIGVsZW0yKSB7XHJcbiAgY29uc3QgZmFkZUNvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKGFzeW5jIHJlc29sdmUgPT4ge1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlT3V0KGVsZW0xKTtcclxuICAgIGF3YWl0IGZ1bGx5RmFkZUluKGVsZW0yKTtcclxuICAgIHJlc29sdmUoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGZhZGVDb21wbGV0ZVByb21pc2U7XHJcbn0iLCIvLyBDbGFtcCBudW1iZXIgYmV0d2VlbiB0d28gdmFsdWVzLlxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAobnVtLCBtaW4sIG1heCkge1xyXG4gIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChudW0sIG1pbiksIG1heCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIHBycHJ0biA9IDAuNSkge1xyXG4gIHJldHVybiBzdGFydCArICgoZW5kIC0gc3RhcnQpICogcHJwcnRuKTtcclxufVxyXG5cclxuLy8gRm9yIGludHMsIGl0IGlzIGluY2x1c2l2ZSBvZiBzdGFydCBhbmQgbm90IGluY2x1c2l2ZSBvZiBlbmQuXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kQmV0d2VlbihzdGFydCA9IDAsIGVuZCA9IDEsIGludHMgPSBmYWxzZSkge1xyXG4gIGNvbnN0IHJhbmdlID0gZW5kIC0gc3RhcnQ7XHJcbiAgY29uc3QgcmFuZEZsb2F0ID0gKE1hdGgucmFuZG9tKCkgKiByYW5nZSkgKyBzdGFydDtcclxuICByZXR1cm4gaW50cyA/IE1hdGguZmxvb3IocmFuZEZsb2F0KSA6IHJhbmRGbG9hdDtcclxufVxyXG5cclxuLy8gUHJvYmFiaWxpdHkgc2hvdWxkIGJlIGEgZGVjaW1hbCwgcmV0dXJucyB0cnVlIG9yIGZhbHNlLlxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdFJhbmRvbShwcm9iYWJpbGl0eSkge1xyXG4gIHJldHVybiAoTWF0aC5yYW5kb20oKSA8PSBwcm9iYWJpbGl0eSkgPyB0cnVlIDogZmFsc2U7XHJcbn1cclxuXHJcbi8vIFRha2VzIGEgbGlzdCBvZiBwcm9iIG9iamVjdHMgYXMgaW5wdXQgaW4gZm9ybWF0IHtuYW1lOiBuYW1lLCBwcm9iOiBwcm9ifSBhbmQgXHJcbi8vIHJldHVybnMgbmFtZSBvZiBjaG9zZW4gcHJvYk9iaiwgb3IgZmFsc2UgaWYgbm9uZSBjaG9zZW4gKGluIGNhc2UgdGhhdCBwcm9iT2JqcyBcclxuLy8gcHJvYnMgZG9udCBzdW0gdG8gMSkuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0UmFuZE11bHQoLi4ucHJvYnMpIHtcclxuICBjb25zdCBwcm9ic09ianMgPSBbXTtcclxuICBsZXQgY3VyclByb2JTdGFydCA9IDA7XHJcblxyXG4gIHByb2JzLmZvckVhY2gocHJvYiA9PiB7XHJcbiAgICBjb25zdCB0aGlzUHJvYiA9IHtcclxuICAgICAgbmFtZTogcHJvYi5uYW1lLFxyXG4gICAgICBzdGFydDogY3VyclByb2JTdGFydCxcclxuICAgICAgZW5kOiBjdXJyUHJvYlN0YXJ0ICsgcHJvYi5wcm9iXHJcbiAgICB9O1xyXG5cclxuICAgIHByb2JzT2Jqcy5wdXNoKHRoaXNQcm9iKTtcclxuXHJcbiAgICBjdXJyUHJvYlN0YXJ0ICs9IHByb2I7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGNob3NlblZhbCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgbGV0IHJldHVyblZhbCA9IGZhbHNlO1xyXG5cclxuICBwcm9ic09ianMuZm9yRWFjaChwcm9iID0+IHtcclxuICAgIGNvbnN0IGNob3NlblRoaXNQcm9iID0gcHJvYi5zdGFydCA8PSBjaG9zZW5WYWwgJiYgcHJvYi5lbmQgPiBjaG9zZW5WYWw7XHJcbiAgICBpZiAoY2hvc2VuVGhpc1Byb2IpIHtcclxuICAgICAgcmV0dXJuVmFsID0gcHJvYi5uYW1lO1xyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHJldHVyblZhbDtcclxufVxyXG5cclxuLy8gU2VhcmNoZXMgZm9yIGEgbmV3SXRlbSBpbiBhbiBhcnJheSBnaXZlbiBhbiBlbGVtQ29tcEZ1bmMgdGhhdCBkZXRlcm1pbmVzIFxyXG4vLyB3aGV0aGVyIGl0IGlzIHByZXNlbnQgb3Igbm90IChlZy4gdG8gZmluZCBiYXNlZCBvbiBxdWVzdGlvbiBJRCkuIElmIHByZXNlbnQsIFxyXG4vLyBlbGVtZW50IGluIGFycmF5IGlzIG92ZXJ3cml0dGVuIHdpdGggbmV3SXRlbSwgb3RoZXJ3aXNlIG5ld0l0ZW0gaXMgcHVzaGVkIHRvIFxyXG4vLyBlbmQgb2YgYXJyYXkuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQW5kT3ZlcndyaXRlRWxzZVB1c2goYXJyYXksIG5ld0l0ZW0sIGVsZW1Db21wRnVuYykge1xyXG4gIGNvbnN0IGZvdW5kSW5kZXggPSBhcnJheS5maW5kSW5kZXgoYXJySXRlbSA9PiBlbGVtQ29tcEZ1bmMoYXJySXRlbSwgbmV3SXRlbSkpO1xyXG5cclxuICAvLyBJZiBmb3VuZCwgb3ZlcndyaXRlLlxyXG4gIGlmIChmb3VuZEluZGV4ID4gLTEpIHtcclxuICAgIGFycmF5LnNwbGljZShmb3VuZEluZGV4LCAxLCBuZXdJdGVtKTtcclxuICB9XHJcbiAgLy8gT3RoZXJ3aXNlIGFkZC5cclxuICBlbHNlIHtcclxuICAgIGFycmF5LnB1c2gobmV3SXRlbSk7XHJcbiAgfTtcclxufVxyXG5cclxuLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRyYW5zaXRpb24gb24gZ2l2ZW4gZWxlbWVudCBlbmRzLCBcclxuLy8gb3B0aW9uYWwgdHJhbnNpdGlvbiBwcm9wZXJ0eSBuYW1lIGNoZWNrLlxyXG5leHBvcnQgZnVuY3Rpb24gYXdhaXRUcmFuc2l0aW9uKGVsZW0sIHByb3BOYW1lID0gbnVsbCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgYXN5bmMgZXZ0ID0+IHtcclxuXHJcbiAgICAgIGlmIChwcm9wTmFtZSkge1xyXG4gICAgICAgIGlmIChldnQucHJvcGVydHlOYW1lID09PSBwcm9wTmFtZSkge1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xyXG4gIH0pXHJcbn1cclxuXHJcbi8vIEZvciB0ZXN0aW5nIGxvbmcgcnVubmluZyBmdW5jdGlvbnMuXHJcbi8vIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7IC8vLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IENlbnRyZU1vZGFsIH0gZnJvbSBcIi4vY2VudHJlTW9kYWwubWpzXCI7XHJcblxyXG5cclxuXHJcbmNvbnN0IHJlZ0xvZ2luRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVnLWxvZ2luLWZvcm1cIik7XHJcbmNvbnN0IHJlZ0xvZ2luRXJyb3JNb2RhbFdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNlbnRyZS1tb2RhbC13cmFwcGVyXCIpO1xyXG5jb25zdCByZWdMb2dpbkVycm9yTW9kYWwgPSBuZXcgQ2VudHJlTW9kYWwocmVnTG9naW5FcnJvck1vZGFsV3JhcHBlcik7XHJcbnJlZ0xvZ2luRXJyb3JNb2RhbC5pbml0KCk7XHJcblxyXG5yZWdMb2dpbkZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBldnQgPT4ge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGhhbmRsZVJlZ0xvZ2luQ2xpY2soZXZ0KTtcclxufSk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVSZWdMb2dpbkNsaWNrKGV2dCkge1xyXG4gIGNvbnN0IGZvcm0gPSBldnQuY3VycmVudFRhcmdldDtcclxuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcclxuICBjb25zdCBmb3JtRGF0YU9iaiA9IE9iamVjdC5mcm9tRW50cmllcyhmb3JtRGF0YS5lbnRyaWVzKCkpO1xyXG5cclxuICBjb25zdCBmZXRjaFJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZm9ybS5hY3Rpb24sIHtcclxuICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtRGF0YU9iailcclxuICB9KTtcclxuXHJcbiAgY29uc3QgdXNlclJlZ0xvZ2luUmVzcG9uc2UgPSBhd2FpdCBmZXRjaFJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgaWYgKHVzZXJSZWdMb2dpblJlc3BvbnNlLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgIGNvbnNvbGUubG9nKGByZWRpcmVjdGluZyB0byAke3VzZXJSZWdMb2dpblJlc3BvbnNlLnJlZGlyZWN0VG99YCk7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHVzZXJSZWdMb2dpblJlc3BvbnNlLnJlZGlyZWN0VG8pXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVnTG9naW5FcnJvck1vZGFsLnNob3coKTtcclxuICB9O1xyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==