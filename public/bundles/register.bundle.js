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

/***/ "./src/js/modules/regLoginErrors.mjs":
/*!*******************************************!*\
  !*** ./src/js/modules/regLoginErrors.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

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


/***/ }),

/***/ "./src/js/modules/registerPlaceFinder.mjs":
/*!************************************************!*\
  !*** ./src/js/modules/registerPlaceFinder.mjs ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sharedJs_getPlaceDetails_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../sharedJs/getPlaceDetails.mjs */ "./src/sharedJs/getPlaceDetails.mjs");




let autocomplete;
const fullAddress = document.querySelector(".full-address");
const locDetails = document.querySelectorAll(".loc-detail");

window.onload = initAutocomplete();

autocomplete.addListener("place_changed", placeChosen);

function initAutocomplete() {
  const locInput = document.querySelector(".loc-input");
  autocomplete = new google.maps.places.Autocomplete(locInput);
}

// When autocomplete suggestion is chosen, get the google place information and 
// populate form fields with this info.
function placeChosen() {
  const place = autocomplete.getPlace();

  const foundPlace = "address_components" in place;
  if (foundPlace) {
    const thisPlace = (0,_sharedJs_getPlaceDetails_mjs__WEBPACK_IMPORTED_MODULE_0__.getPlaceDetails)(place);
    populateForm(thisPlace);
  };
};

// Populate form fields with some visibile and some hidden place info.
function populateForm(thisPlace) {
  locDetails.forEach(locDetail => locDetail.value = "");

  for (let detail in thisPlace) {
    if (detail === "fullAddress") {
      fullAddress.innerHTML = "";

      for (let i = 0; i < thisPlace[detail].length; i++) {
        const addressLineInput = document.createElement("input");
        addressLineInput.classList.add("fully-hidden");
        addressLineInput.value = thisPlace[detail][i].long_name;
        addressLineInput.setAttribute("name", `fullAddress${i}`);
        fullAddress.appendChild(addressLineInput);
      };
    }

    else {
      const formInput = document.querySelector(`[name="${detail}"]`);
      formInput.value = thisPlace[detail];
    };
  };
}

/***/ }),

/***/ "./src/sharedJs/getPlaceDetails.mjs":
/*!******************************************!*\
  !*** ./src/sharedJs/getPlaceDetails.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getPlaceDetails": () => (/* binding */ getPlaceDetails)
/* harmony export */ });
// Used by the autocomplete when registering a new user both on register page 
// manually and in admin route on backend.

// Create my own place object from the Google place object.
function getPlaceDetails(place, autoInput = true) {
  const thisPlace = {
    formattedAddress: place.formatted_address,
    fullAddress: place.address_components,
    googlePlaceId: place.place_id
  };

  const latLngDetails = thisPlace.lat = place.geometry.location;

  [thisPlace.lat, thisPlace.lng] = autoInput ? 
    [latLngDetails.lat(), latLngDetails.lng()] : 
    [latLngDetails.lat, latLngDetails.lng]
  
  let [countryAlreadySet, placeNameAlreadySet] = [false, false];

  // Get the country and place name.
  for (let addressLine of thisPlace.fullAddress) {
    const lineInclCountry = addressLine.types.includes("country");
    const lineInclPlaceName = addressLine.types.includes("political");

    if (lineInclCountry && !countryAlreadySet) {
      thisPlace.countryShort = addressLine.short_name;
      thisPlace.countryLong = addressLine.long_name;
      countryAlreadySet = true;
    };

    if (lineInclPlaceName && !placeNameAlreadySet) {
      thisPlace.placeName = addressLine.long_name;
      placeNameAlreadySet = true;
    };
  };

  return thisPlace;
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
/*!**********************************!*\
  !*** ./src/js/pages/register.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_regLoginErrors_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/regLoginErrors.mjs */ "./src/js/modules/regLoginErrors.mjs");
/* harmony import */ var _modules_registerPlaceFinder_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/registerPlaceFinder.mjs */ "./src/js/modules/registerPlaceFinder.mjs");


})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLEdBQUcsV0FBVztBQUNuQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsNERBQTREOzs7Ozs7VUNoRzVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTnVDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9qcy9tb2R1bGVzL2NlbnRyZU1vZGFsLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvZmFkZVRyYW5zaXRpb25zLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvcmVnTG9naW5FcnJvcnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9yZWdpc3RlclBsYWNlRmluZGVyLm1qcyIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL3NoYXJlZEpzL2dldFBsYWNlRGV0YWlscy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9zaGFyZWRKcy91dGlscy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvcGFnZXMvcmVnaXN0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmFkZUluLCBmdWxseUZhZGVPdXQgfSBmcm9tIFwiLi9mYWRlVHJhbnNpdGlvbnMubWpzXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDZW50cmVNb2RhbCB7XHJcbiAgd3JhcHBlcjtcclxuICAjbW9kYWw7XHJcbiAgI2Nsb3NlTW9kYWxCdG47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHdyYXBwZXIpIHtcclxuICAgIHRoaXMud3JhcHBlciA9IHdyYXBwZXI7XHJcbiAgICB0aGlzLiNtb2RhbCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5jZW50cmUtbW9kYWxcIik7XHJcbiAgICB0aGlzLiNjbG9zZU1vZGFsQnRuID0gdGhpcy4jbW9kYWwucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKTtcclxuICB9XHJcblxyXG4gIC8vIFNldCB1cCB0aGUgZXZlbnQgbGlzdGVuZXJzLlxyXG4gIGluaXQoKSB7XHJcbiAgICBjb25zdCBjbG9zZU1vZGFsRWxlbXMgPSBbdGhpcy4jY2xvc2VNb2RhbEJ0biwgdGhpcy53cmFwcGVyXTtcclxuXHJcbiAgICBmb3IgKGxldCBjbG9zZU1vZGFsRWxlbSBvZiBjbG9zZU1vZGFsRWxlbXMpIHtcclxuICAgICAgY2xvc2VNb2RhbEVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuaGlkZSgpKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy4jbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2dCA9PiBldnQuc3RvcFByb3BhZ2F0aW9uKCkpO1xyXG4gIH1cclxuXHJcbiAgc2hvdygpIHtcclxuICAgIGZhZGVJbih0aGlzLndyYXBwZXIpO1xyXG4gIH1cclxuXHJcbiAgaGlkZSgpIHtcclxuICAgIGZ1bGx5RmFkZU91dCh0aGlzLndyYXBwZXIpO1xyXG4gIH1cclxufSIsIi8vIEhlbHBlciBmdW5jdGlvbnMgdG8gYXNzaXN0IHdpdGggZmFkaW5nIGluIC8gb3V0IERPTSBlbGVtZW50cy5cclxuaW1wb3J0IHsgYXdhaXRUcmFuc2l0aW9uIH0gZnJvbSBcIi4uLy4uL3NoYXJlZEpzL3V0aWxzLm1qc1wiO1xyXG5cclxuXHJcblxyXG4vLyBGYWRlIHRyYW5zaXRpb24gaGVscGVyIGZ1bmN0aW9ucywgdXNlZCB3aXRoIHRyYW5zcGFyZW50LCBmdWxseS1oaWRkZW4gYW5kIFxyXG4vLyBmYWRlLXRyYW5zIGNzcyBjbGFzc2VzLlxyXG4vLyBNYWtlcyBkaXNwbGF5IHByb3BlcnR5IHZpc2libGUgYW5kIHRoZW4gcmVtb3ZlcyB0cmFuc3BhcmVuY3kuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlSW4oZWxlbSkge1xyXG4gIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShcImZ1bGx5LWhpZGRlblwiKTtcclxuICBzZXRUaW1lb3V0KCgpID0+IGVsZW0uY2xhc3NMaXN0LnJlbW92ZShcInRyYW5zcGFyZW50XCIpLCAxMCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5pc2hGYWRlSW4oZWxlbSkge1xyXG4gIGF3YWl0IGF3YWl0VHJhbnNpdGlvbihlbGVtLCBcIm9wYWNpdHlcIik7XHJcbn1cclxuXHJcbi8vIEZpbmlzaGVzIHdoZW4gZmFkZSBpbiBpcyBjb21wbGV0ZWQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmdWxseUZhZGVJbihlbGVtKSB7XHJcbiAgZmFkZUluKGVsZW0pO1xyXG4gIGF3YWl0IGZpbmlzaEZhZGVJbihlbGVtKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVPdXQoZWxlbSkge1xyXG4gIGVsZW0uY2xhc3NMaXN0LmFkZChcInRyYW5zcGFyZW50XCIpO1xyXG59XHJcblxyXG4vLyBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBvcGFjaXR5IHRyYW5zaXRpb24gb24gdGhlIFxyXG4vLyBnaXZlbiBlbGVtZW50IGlzIGNvbXBsZXRlZC4gQWxzbyBmdWxseSBoaWRlcyB0aGUgZWxlbWVudC5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbmlzaEZhZGVPdXQoZWxlbSkge1xyXG4gIGF3YWl0IGF3YWl0VHJhbnNpdGlvbihlbGVtLCBcIm9wYWNpdHlcIik7XHJcbiAgZWxlbS5jbGFzc0xpc3QuYWRkKFwiZnVsbHktaGlkZGVuXCIpO1xyXG59XHJcblxyXG4vLyBGYWRlIG91dCBhbmQgZnVsbHkgaGlkZSB0aGUgZ2l2ZW4gZWxlbWVudC5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZ1bGx5RmFkZU91dChlbGVtKSB7XHJcbiAgZmFkZU91dChlbGVtKTtcclxuICBhd2FpdCBmaW5pc2hGYWRlT3V0KGVsZW0pO1xyXG59XHJcblxyXG4vLyBGYWRlcyBvdXQgZWxlbTEgYW5kIGZhZGVzIGluIGVsZW0yIG9uY2UgdHJhbnNpdGlvbiBjb21wbGV0ZWQsIGRvZXNuJ3QgZmluaXNoIFxyXG4vLyB1bnRpbCBlbGVtMiBmdWxseSBmYWRlZCBpbi4gUmV0dXJucyBwcm9taXNlLlxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZUZyb21UbyhlbGVtMSwgZWxlbTIpIHtcclxuICBjb25zdCBmYWRlQ29tcGxldGVQcm9taXNlID0gbmV3IFByb21pc2UoYXN5bmMgcmVzb2x2ZSA9PiB7XHJcbiAgICBhd2FpdCBmdWxseUZhZGVPdXQoZWxlbTEpO1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlSW4oZWxlbTIpO1xyXG4gICAgcmVzb2x2ZSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZmFkZUNvbXBsZXRlUHJvbWlzZTtcclxufSIsImltcG9ydCB7IENlbnRyZU1vZGFsIH0gZnJvbSBcIi4vY2VudHJlTW9kYWwubWpzXCI7XHJcblxyXG5cclxuXHJcbmNvbnN0IHJlZ0xvZ2luRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVnLWxvZ2luLWZvcm1cIik7XHJcbmNvbnN0IHJlZ0xvZ2luRXJyb3JNb2RhbFdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNlbnRyZS1tb2RhbC13cmFwcGVyXCIpO1xyXG5jb25zdCByZWdMb2dpbkVycm9yTW9kYWwgPSBuZXcgQ2VudHJlTW9kYWwocmVnTG9naW5FcnJvck1vZGFsV3JhcHBlcik7XHJcbnJlZ0xvZ2luRXJyb3JNb2RhbC5pbml0KCk7XHJcblxyXG5yZWdMb2dpbkZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCBldnQgPT4ge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGhhbmRsZVJlZ0xvZ2luQ2xpY2soZXZ0KTtcclxufSk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVSZWdMb2dpbkNsaWNrKGV2dCkge1xyXG4gIGNvbnN0IGZvcm0gPSBldnQuY3VycmVudFRhcmdldDtcclxuICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcclxuICBjb25zdCBmb3JtRGF0YU9iaiA9IE9iamVjdC5mcm9tRW50cmllcyhmb3JtRGF0YS5lbnRyaWVzKCkpO1xyXG5cclxuICBjb25zdCBmZXRjaFJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZm9ybS5hY3Rpb24sIHtcclxuICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtRGF0YU9iailcclxuICB9KTtcclxuXHJcbiAgY29uc3QgdXNlclJlZ0xvZ2luUmVzcG9uc2UgPSBhd2FpdCBmZXRjaFJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgaWYgKHVzZXJSZWdMb2dpblJlc3BvbnNlLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgIGNvbnNvbGUubG9nKGByZWRpcmVjdGluZyB0byAke3VzZXJSZWdMb2dpblJlc3BvbnNlLnJlZGlyZWN0VG99YCk7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHVzZXJSZWdMb2dpblJlc3BvbnNlLnJlZGlyZWN0VG8pXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmVnTG9naW5FcnJvck1vZGFsLnNob3coKTtcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IGdldFBsYWNlRGV0YWlscyB9IGZyb20gXCIuLi8uLi9zaGFyZWRKcy9nZXRQbGFjZURldGFpbHMubWpzXCI7XHJcblxyXG5cclxuXHJcbmxldCBhdXRvY29tcGxldGU7XHJcbmNvbnN0IGZ1bGxBZGRyZXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mdWxsLWFkZHJlc3NcIik7XHJcbmNvbnN0IGxvY0RldGFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmxvYy1kZXRhaWxcIik7XHJcblxyXG53aW5kb3cub25sb2FkID0gaW5pdEF1dG9jb21wbGV0ZSgpO1xyXG5cclxuYXV0b2NvbXBsZXRlLmFkZExpc3RlbmVyKFwicGxhY2VfY2hhbmdlZFwiLCBwbGFjZUNob3Nlbik7XHJcblxyXG5mdW5jdGlvbiBpbml0QXV0b2NvbXBsZXRlKCkge1xyXG4gIGNvbnN0IGxvY0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sb2MtaW5wdXRcIik7XHJcbiAgYXV0b2NvbXBsZXRlID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5BdXRvY29tcGxldGUobG9jSW5wdXQpO1xyXG59XHJcblxyXG4vLyBXaGVuIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIGlzIGNob3NlbiwgZ2V0IHRoZSBnb29nbGUgcGxhY2UgaW5mb3JtYXRpb24gYW5kIFxyXG4vLyBwb3B1bGF0ZSBmb3JtIGZpZWxkcyB3aXRoIHRoaXMgaW5mby5cclxuZnVuY3Rpb24gcGxhY2VDaG9zZW4oKSB7XHJcbiAgY29uc3QgcGxhY2UgPSBhdXRvY29tcGxldGUuZ2V0UGxhY2UoKTtcclxuXHJcbiAgY29uc3QgZm91bmRQbGFjZSA9IFwiYWRkcmVzc19jb21wb25lbnRzXCIgaW4gcGxhY2U7XHJcbiAgaWYgKGZvdW5kUGxhY2UpIHtcclxuICAgIGNvbnN0IHRoaXNQbGFjZSA9IGdldFBsYWNlRGV0YWlscyhwbGFjZSk7XHJcbiAgICBwb3B1bGF0ZUZvcm0odGhpc1BsYWNlKTtcclxuICB9O1xyXG59O1xyXG5cclxuLy8gUG9wdWxhdGUgZm9ybSBmaWVsZHMgd2l0aCBzb21lIHZpc2liaWxlIGFuZCBzb21lIGhpZGRlbiBwbGFjZSBpbmZvLlxyXG5mdW5jdGlvbiBwb3B1bGF0ZUZvcm0odGhpc1BsYWNlKSB7XHJcbiAgbG9jRGV0YWlscy5mb3JFYWNoKGxvY0RldGFpbCA9PiBsb2NEZXRhaWwudmFsdWUgPSBcIlwiKTtcclxuXHJcbiAgZm9yIChsZXQgZGV0YWlsIGluIHRoaXNQbGFjZSkge1xyXG4gICAgaWYgKGRldGFpbCA9PT0gXCJmdWxsQWRkcmVzc1wiKSB7XHJcbiAgICAgIGZ1bGxBZGRyZXNzLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXNQbGFjZVtkZXRhaWxdLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgYWRkcmVzc0xpbmVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBhZGRyZXNzTGluZUlucHV0LmNsYXNzTGlzdC5hZGQoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgICAgICAgYWRkcmVzc0xpbmVJbnB1dC52YWx1ZSA9IHRoaXNQbGFjZVtkZXRhaWxdW2ldLmxvbmdfbmFtZTtcclxuICAgICAgICBhZGRyZXNzTGluZUlucHV0LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgYGZ1bGxBZGRyZXNzJHtpfWApO1xyXG4gICAgICAgIGZ1bGxBZGRyZXNzLmFwcGVuZENoaWxkKGFkZHJlc3NMaW5lSW5wdXQpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGVsc2Uge1xyXG4gICAgICBjb25zdCBmb3JtSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbbmFtZT1cIiR7ZGV0YWlsfVwiXWApO1xyXG4gICAgICBmb3JtSW5wdXQudmFsdWUgPSB0aGlzUGxhY2VbZGV0YWlsXTtcclxuICAgIH07XHJcbiAgfTtcclxufSIsIi8vIFVzZWQgYnkgdGhlIGF1dG9jb21wbGV0ZSB3aGVuIHJlZ2lzdGVyaW5nIGEgbmV3IHVzZXIgYm90aCBvbiByZWdpc3RlciBwYWdlIFxyXG4vLyBtYW51YWxseSBhbmQgaW4gYWRtaW4gcm91dGUgb24gYmFja2VuZC5cclxuXHJcbi8vIENyZWF0ZSBteSBvd24gcGxhY2Ugb2JqZWN0IGZyb20gdGhlIEdvb2dsZSBwbGFjZSBvYmplY3QuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQbGFjZURldGFpbHMocGxhY2UsIGF1dG9JbnB1dCA9IHRydWUpIHtcclxuICBjb25zdCB0aGlzUGxhY2UgPSB7XHJcbiAgICBmb3JtYXR0ZWRBZGRyZXNzOiBwbGFjZS5mb3JtYXR0ZWRfYWRkcmVzcyxcclxuICAgIGZ1bGxBZGRyZXNzOiBwbGFjZS5hZGRyZXNzX2NvbXBvbmVudHMsXHJcbiAgICBnb29nbGVQbGFjZUlkOiBwbGFjZS5wbGFjZV9pZFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGxhdExuZ0RldGFpbHMgPSB0aGlzUGxhY2UubGF0ID0gcGxhY2UuZ2VvbWV0cnkubG9jYXRpb247XHJcblxyXG4gIFt0aGlzUGxhY2UubGF0LCB0aGlzUGxhY2UubG5nXSA9IGF1dG9JbnB1dCA/IFxyXG4gICAgW2xhdExuZ0RldGFpbHMubGF0KCksIGxhdExuZ0RldGFpbHMubG5nKCldIDogXHJcbiAgICBbbGF0TG5nRGV0YWlscy5sYXQsIGxhdExuZ0RldGFpbHMubG5nXVxyXG4gIFxyXG4gIGxldCBbY291bnRyeUFscmVhZHlTZXQsIHBsYWNlTmFtZUFscmVhZHlTZXRdID0gW2ZhbHNlLCBmYWxzZV07XHJcblxyXG4gIC8vIEdldCB0aGUgY291bnRyeSBhbmQgcGxhY2UgbmFtZS5cclxuICBmb3IgKGxldCBhZGRyZXNzTGluZSBvZiB0aGlzUGxhY2UuZnVsbEFkZHJlc3MpIHtcclxuICAgIGNvbnN0IGxpbmVJbmNsQ291bnRyeSA9IGFkZHJlc3NMaW5lLnR5cGVzLmluY2x1ZGVzKFwiY291bnRyeVwiKTtcclxuICAgIGNvbnN0IGxpbmVJbmNsUGxhY2VOYW1lID0gYWRkcmVzc0xpbmUudHlwZXMuaW5jbHVkZXMoXCJwb2xpdGljYWxcIik7XHJcblxyXG4gICAgaWYgKGxpbmVJbmNsQ291bnRyeSAmJiAhY291bnRyeUFscmVhZHlTZXQpIHtcclxuICAgICAgdGhpc1BsYWNlLmNvdW50cnlTaG9ydCA9IGFkZHJlc3NMaW5lLnNob3J0X25hbWU7XHJcbiAgICAgIHRoaXNQbGFjZS5jb3VudHJ5TG9uZyA9IGFkZHJlc3NMaW5lLmxvbmdfbmFtZTtcclxuICAgICAgY291bnRyeUFscmVhZHlTZXQgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAobGluZUluY2xQbGFjZU5hbWUgJiYgIXBsYWNlTmFtZUFscmVhZHlTZXQpIHtcclxuICAgICAgdGhpc1BsYWNlLnBsYWNlTmFtZSA9IGFkZHJlc3NMaW5lLmxvbmdfbmFtZTtcclxuICAgICAgcGxhY2VOYW1lQWxyZWFkeVNldCA9IHRydWU7XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB0aGlzUGxhY2U7XHJcbn0iLCIvLyBDbGFtcCBudW1iZXIgYmV0d2VlbiB0d28gdmFsdWVzLlxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAobnVtLCBtaW4sIG1heCkge1xyXG4gIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChudW0sIG1pbiksIG1heCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsZXJwKHN0YXJ0LCBlbmQsIHBycHJ0biA9IDAuNSkge1xyXG4gIHJldHVybiBzdGFydCArICgoZW5kIC0gc3RhcnQpICogcHJwcnRuKTtcclxufVxyXG5cclxuLy8gRm9yIGludHMsIGl0IGlzIGluY2x1c2l2ZSBvZiBzdGFydCBhbmQgbm90IGluY2x1c2l2ZSBvZiBlbmQuXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5kQmV0d2VlbihzdGFydCA9IDAsIGVuZCA9IDEsIGludHMgPSBmYWxzZSkge1xyXG4gIGNvbnN0IHJhbmdlID0gZW5kIC0gc3RhcnQ7XHJcbiAgY29uc3QgcmFuZEZsb2F0ID0gKE1hdGgucmFuZG9tKCkgKiByYW5nZSkgKyBzdGFydDtcclxuICByZXR1cm4gaW50cyA/IE1hdGguZmxvb3IocmFuZEZsb2F0KSA6IHJhbmRGbG9hdDtcclxufVxyXG5cclxuLy8gUHJvYmFiaWxpdHkgc2hvdWxkIGJlIGEgZGVjaW1hbCwgcmV0dXJucyB0cnVlIG9yIGZhbHNlLlxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdFJhbmRvbShwcm9iYWJpbGl0eSkge1xyXG4gIHJldHVybiAoTWF0aC5yYW5kb20oKSA8PSBwcm9iYWJpbGl0eSkgPyB0cnVlIDogZmFsc2U7XHJcbn1cclxuXHJcbi8vIFRha2VzIGEgbGlzdCBvZiBwcm9iIG9iamVjdHMgYXMgaW5wdXQgaW4gZm9ybWF0IHtuYW1lOiBuYW1lLCBwcm9iOiBwcm9ifSBhbmQgXHJcbi8vIHJldHVybnMgbmFtZSBvZiBjaG9zZW4gcHJvYk9iaiwgb3IgZmFsc2UgaWYgbm9uZSBjaG9zZW4gKGluIGNhc2UgdGhhdCBwcm9iT2JqcyBcclxuLy8gcHJvYnMgZG9udCBzdW0gdG8gMSkuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0UmFuZE11bHQoLi4ucHJvYnMpIHtcclxuICBjb25zdCBwcm9ic09ianMgPSBbXTtcclxuICBsZXQgY3VyclByb2JTdGFydCA9IDA7XHJcblxyXG4gIHByb2JzLmZvckVhY2gocHJvYiA9PiB7XHJcbiAgICBjb25zdCB0aGlzUHJvYiA9IHtcclxuICAgICAgbmFtZTogcHJvYi5uYW1lLFxyXG4gICAgICBzdGFydDogY3VyclByb2JTdGFydCxcclxuICAgICAgZW5kOiBjdXJyUHJvYlN0YXJ0ICsgcHJvYi5wcm9iXHJcbiAgICB9O1xyXG5cclxuICAgIHByb2JzT2Jqcy5wdXNoKHRoaXNQcm9iKTtcclxuXHJcbiAgICBjdXJyUHJvYlN0YXJ0ICs9IHByb2I7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IGNob3NlblZhbCA9IE1hdGgucmFuZG9tKCk7XHJcbiAgbGV0IHJldHVyblZhbCA9IGZhbHNlO1xyXG5cclxuICBwcm9ic09ianMuZm9yRWFjaChwcm9iID0+IHtcclxuICAgIGNvbnN0IGNob3NlblRoaXNQcm9iID0gcHJvYi5zdGFydCA8PSBjaG9zZW5WYWwgJiYgcHJvYi5lbmQgPiBjaG9zZW5WYWw7XHJcbiAgICBpZiAoY2hvc2VuVGhpc1Byb2IpIHtcclxuICAgICAgcmV0dXJuVmFsID0gcHJvYi5uYW1lO1xyXG4gICAgfTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIHJldHVyblZhbDtcclxufVxyXG5cclxuLy8gU2VhcmNoZXMgZm9yIGEgbmV3SXRlbSBpbiBhbiBhcnJheSBnaXZlbiBhbiBlbGVtQ29tcEZ1bmMgdGhhdCBkZXRlcm1pbmVzIFxyXG4vLyB3aGV0aGVyIGl0IGlzIHByZXNlbnQgb3Igbm90IChlZy4gdG8gZmluZCBiYXNlZCBvbiBxdWVzdGlvbiBJRCkuIElmIHByZXNlbnQsIFxyXG4vLyBlbGVtZW50IGluIGFycmF5IGlzIG92ZXJ3cml0dGVuIHdpdGggbmV3SXRlbSwgb3RoZXJ3aXNlIG5ld0l0ZW0gaXMgcHVzaGVkIHRvIFxyXG4vLyBlbmQgb2YgYXJyYXkuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQW5kT3ZlcndyaXRlRWxzZVB1c2goYXJyYXksIG5ld0l0ZW0sIGVsZW1Db21wRnVuYykge1xyXG4gIGNvbnN0IGZvdW5kSW5kZXggPSBhcnJheS5maW5kSW5kZXgoYXJySXRlbSA9PiBlbGVtQ29tcEZ1bmMoYXJySXRlbSwgbmV3SXRlbSkpO1xyXG5cclxuICAvLyBJZiBmb3VuZCwgb3ZlcndyaXRlLlxyXG4gIGlmIChmb3VuZEluZGV4ID4gLTEpIHtcclxuICAgIGFycmF5LnNwbGljZShmb3VuZEluZGV4LCAxLCBuZXdJdGVtKTtcclxuICB9XHJcbiAgLy8gT3RoZXJ3aXNlIGFkZC5cclxuICBlbHNlIHtcclxuICAgIGFycmF5LnB1c2gobmV3SXRlbSk7XHJcbiAgfTtcclxufVxyXG5cclxuLy8gUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRyYW5zaXRpb24gb24gZ2l2ZW4gZWxlbWVudCBlbmRzLCBcclxuLy8gb3B0aW9uYWwgdHJhbnNpdGlvbiBwcm9wZXJ0eSBuYW1lIGNoZWNrLlxyXG5leHBvcnQgZnVuY3Rpb24gYXdhaXRUcmFuc2l0aW9uKGVsZW0sIHByb3BOYW1lID0gbnVsbCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgYXN5bmMgZXZ0ID0+IHtcclxuXHJcbiAgICAgIGlmIChwcm9wTmFtZSkge1xyXG4gICAgICAgIGlmIChldnQucHJvcGVydHlOYW1lID09PSBwcm9wTmFtZSkge1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xyXG4gIH0pXHJcbn1cclxuXHJcbi8vIEZvciB0ZXN0aW5nIGxvbmcgcnVubmluZyBmdW5jdGlvbnMuXHJcbi8vIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7IC8vLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4uL21vZHVsZXMvcmVnTG9naW5FcnJvcnMubWpzXCI7XHJcbmltcG9ydCBcIi4uL21vZHVsZXMvcmVnaXN0ZXJQbGFjZUZpbmRlci5tanNcIjsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=