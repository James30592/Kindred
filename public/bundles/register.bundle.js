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

/***/ "./src/js/modules/regLogin.mjs":
/*!*************************************!*\
  !*** ./src/js/modules/regLogin.mjs ***!
  \*************************************/
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
/* harmony import */ var _sharedJs_getPlaceDetails_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../sharedJs/getPlaceDetails.mjs */ "./src/sharedJs/getPlaceDetails.mjs");
/* harmony import */ var _modules_regLogin_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/regLogin.mjs */ "./src/js/modules/regLogin.mjs");





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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05xRTtBQUNwQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhFQUFlO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiw4QkFBOEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsNERBQTRELEVBQUU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxPQUFPO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL21vZHVsZXMvY2VudHJlTW9kYWwubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9mYWRlVHJhbnNpdGlvbnMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9yZWdMb2dpbi5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC8uL3NyYy9zaGFyZWRKcy9nZXRQbGFjZURldGFpbHMubWpzIiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvc2hhcmVkSnMvdXRpbHMubWpzIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2tpbmRyZWQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL2pzL3BhZ2VzL3JlZ2lzdGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZhZGVJbiwgZnVsbHlGYWRlT3V0IH0gZnJvbSBcIi4vZmFkZVRyYW5zaXRpb25zLm1qc1wiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQ2VudHJlTW9kYWwge1xyXG4gIHdyYXBwZXI7XHJcbiAgI21vZGFsO1xyXG4gICNjbG9zZU1vZGFsQnRuO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih3cmFwcGVyKSB7XHJcbiAgICB0aGlzLndyYXBwZXIgPSB3cmFwcGVyO1xyXG4gICAgdGhpcy4jbW9kYWwgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuY2VudHJlLW1vZGFsXCIpO1xyXG4gICAgdGhpcy4jY2xvc2VNb2RhbEJ0biA9IHRoaXMuI21vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdXAgdGhlIGV2ZW50IGxpc3RlbmVycy5cclxuICBpbml0KCkge1xyXG4gICAgY29uc3QgY2xvc2VNb2RhbEVsZW1zID0gW3RoaXMuI2Nsb3NlTW9kYWxCdG4sIHRoaXMud3JhcHBlcl07XHJcblxyXG4gICAgZm9yIChsZXQgY2xvc2VNb2RhbEVsZW0gb2YgY2xvc2VNb2RhbEVsZW1zKSB7XHJcbiAgICAgIGNsb3NlTW9kYWxFbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmhpZGUoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuI21vZGFsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldnQgPT4gZXZ0LnN0b3BQcm9wYWdhdGlvbigpKTtcclxuICB9XHJcblxyXG4gIHNob3coKSB7XHJcbiAgICBmYWRlSW4odGhpcy53cmFwcGVyKTtcclxuICB9XHJcblxyXG4gIGhpZGUoKSB7XHJcbiAgICBmdWxseUZhZGVPdXQodGhpcy53cmFwcGVyKTtcclxuICB9XHJcbn0iLCIvLyBIZWxwZXIgZnVuY3Rpb25zIHRvIGFzc2lzdCB3aXRoIGZhZGluZyBpbiAvIG91dCBET00gZWxlbWVudHMuXHJcbmltcG9ydCB7IGF3YWl0VHJhbnNpdGlvbiB9IGZyb20gXCIuLi8uLi9zaGFyZWRKcy91dGlscy5tanNcIjtcclxuXHJcblxyXG5cclxuLy8gRmFkZSB0cmFuc2l0aW9uIGhlbHBlciBmdW5jdGlvbnMsIHVzZWQgd2l0aCB0cmFuc3BhcmVudCwgZnVsbHktaGlkZGVuIGFuZCBcclxuLy8gZmFkZS10cmFucyBjc3MgY2xhc3Nlcy5cclxuLy8gTWFrZXMgZGlzcGxheSBwcm9wZXJ0eSB2aXNpYmxlIGFuZCB0aGVuIHJlbW92ZXMgdHJhbnNwYXJlbmN5LlxyXG5leHBvcnQgZnVuY3Rpb24gZmFkZUluKGVsZW0pIHtcclxuICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJmdWxseS1oaWRkZW5cIik7XHJcbiAgc2V0VGltZW91dCgoKSA9PiBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJ0cmFuc3BhcmVudFwiKSwgMTApO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluaXNoRmFkZUluKGVsZW0pIHtcclxuICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgXCJvcGFjaXR5XCIpO1xyXG59XHJcblxyXG4vLyBGaW5pc2hlcyB3aGVuIGZhZGUgaW4gaXMgY29tcGxldGVkLlxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHlGYWRlSW4oZWxlbSkge1xyXG4gIGZhZGVJbihlbGVtKTtcclxuICBhd2FpdCBmaW5pc2hGYWRlSW4oZWxlbSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmYWRlT3V0KGVsZW0pIHtcclxuICBlbGVtLmNsYXNzTGlzdC5hZGQoXCJ0cmFuc3BhcmVudFwiKTtcclxufVxyXG5cclxuLy8gRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gb3BhY2l0eSB0cmFuc2l0aW9uIG9uIHRoZSBcclxuLy8gZ2l2ZW4gZWxlbWVudCBpcyBjb21wbGV0ZWQuIEFsc28gZnVsbHkgaGlkZXMgdGhlIGVsZW1lbnQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5pc2hGYWRlT3V0KGVsZW0pIHtcclxuICBhd2FpdCBhd2FpdFRyYW5zaXRpb24oZWxlbSwgXCJvcGFjaXR5XCIpO1xyXG4gIGVsZW0uY2xhc3NMaXN0LmFkZChcImZ1bGx5LWhpZGRlblwiKTtcclxufVxyXG5cclxuLy8gRmFkZSBvdXQgYW5kIGZ1bGx5IGhpZGUgdGhlIGdpdmVuIGVsZW1lbnQuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmdWxseUZhZGVPdXQoZWxlbSkge1xyXG4gIGZhZGVPdXQoZWxlbSk7XHJcbiAgYXdhaXQgZmluaXNoRmFkZU91dChlbGVtKTtcclxufVxyXG5cclxuLy8gRmFkZXMgb3V0IGVsZW0xIGFuZCBmYWRlcyBpbiBlbGVtMiBvbmNlIHRyYW5zaXRpb24gY29tcGxldGVkLCBkb2Vzbid0IGZpbmlzaCBcclxuLy8gdW50aWwgZWxlbTIgZnVsbHkgZmFkZWQgaW4uIFJldHVybnMgcHJvbWlzZS5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhZGVGcm9tVG8oZWxlbTEsIGVsZW0yKSB7XHJcbiAgY29uc3QgZmFkZUNvbXBsZXRlUHJvbWlzZSA9IG5ldyBQcm9taXNlKGFzeW5jIHJlc29sdmUgPT4ge1xyXG4gICAgYXdhaXQgZnVsbHlGYWRlT3V0KGVsZW0xKTtcclxuICAgIGF3YWl0IGZ1bGx5RmFkZUluKGVsZW0yKTtcclxuICAgIHJlc29sdmUoKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGZhZGVDb21wbGV0ZVByb21pc2U7XHJcbn0iLCJpbXBvcnQgeyBDZW50cmVNb2RhbCB9IGZyb20gXCIuL2NlbnRyZU1vZGFsLm1qc1wiO1xyXG5cclxuXHJcblxyXG5jb25zdCByZWdMb2dpbkZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlZy1sb2dpbi1mb3JtXCIpO1xyXG5jb25zdCByZWdMb2dpbkVycm9yTW9kYWxXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jZW50cmUtbW9kYWwtd3JhcHBlclwiKTtcclxuY29uc3QgcmVnTG9naW5FcnJvck1vZGFsID0gbmV3IENlbnRyZU1vZGFsKHJlZ0xvZ2luRXJyb3JNb2RhbFdyYXBwZXIpO1xyXG5yZWdMb2dpbkVycm9yTW9kYWwuaW5pdCgpO1xyXG5cclxucmVnTG9naW5Gb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZXZ0ID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBoYW5kbGVSZWdMb2dpbkNsaWNrKGV2dCk7XHJcbn0pO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUmVnTG9naW5DbGljayhldnQpIHtcclxuICBjb25zdCBmb3JtID0gZXZ0LmN1cnJlbnRUYXJnZXQ7XHJcbiAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcbiAgY29uc3QgZm9ybURhdGFPYmogPSBPYmplY3QuZnJvbUVudHJpZXMoZm9ybURhdGEuZW50cmllcygpKTtcclxuXHJcbiAgY29uc3QgZmV0Y2hSZXNwb25zZSA9IGF3YWl0IGZldGNoKGZvcm0uYWN0aW9uLCB7XHJcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZm9ybURhdGFPYmopXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHVzZXJSZWdMb2dpblJlc3BvbnNlID0gYXdhaXQgZmV0Y2hSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gIGlmICh1c2VyUmVnTG9naW5SZXNwb25zZS5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgcmVkaXJlY3RpbmcgdG8gJHt1c2VyUmVnTG9naW5SZXNwb25zZS5yZWRpcmVjdFRvfWApO1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1c2VyUmVnTG9naW5SZXNwb25zZS5yZWRpcmVjdFRvKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJlZ0xvZ2luRXJyb3JNb2RhbC5zaG93KCk7XHJcbiAgfTtcclxufVxyXG4iLCIvLyBVc2VkIGJ5IHRoZSBhdXRvY29tcGxldGUgd2hlbiByZWdpc3RlcmluZyBhIG5ldyB1c2VyIGJvdGggb24gcmVnaXN0ZXIgcGFnZSBcclxuLy8gbWFudWFsbHkgYW5kIGluIGFkbWluIHJvdXRlIG9uIGJhY2tlbmQuXHJcblxyXG4vLyBDcmVhdGUgbXkgb3duIHBsYWNlIG9iamVjdCBmcm9tIHRoZSBHb29nbGUgcGxhY2Ugb2JqZWN0LlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGxhY2VEZXRhaWxzKHBsYWNlLCBhdXRvSW5wdXQgPSB0cnVlKSB7XHJcbiAgY29uc3QgdGhpc1BsYWNlID0ge1xyXG4gICAgZm9ybWF0dGVkQWRkcmVzczogcGxhY2UuZm9ybWF0dGVkX2FkZHJlc3MsXHJcbiAgICBmdWxsQWRkcmVzczogcGxhY2UuYWRkcmVzc19jb21wb25lbnRzLFxyXG4gICAgZ29vZ2xlUGxhY2VJZDogcGxhY2UucGxhY2VfaWRcclxuICB9O1xyXG5cclxuICBjb25zdCBsYXRMbmdEZXRhaWxzID0gdGhpc1BsYWNlLmxhdCA9IHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uO1xyXG5cclxuICBbdGhpc1BsYWNlLmxhdCwgdGhpc1BsYWNlLmxuZ10gPSBhdXRvSW5wdXQgPyBcclxuICAgIFtsYXRMbmdEZXRhaWxzLmxhdCgpLCBsYXRMbmdEZXRhaWxzLmxuZygpXSA6IFxyXG4gICAgW2xhdExuZ0RldGFpbHMubGF0LCBsYXRMbmdEZXRhaWxzLmxuZ11cclxuICBcclxuICBsZXQgW2NvdW50cnlBbHJlYWR5U2V0LCBwbGFjZU5hbWVBbHJlYWR5U2V0XSA9IFtmYWxzZSwgZmFsc2VdO1xyXG5cclxuICAvLyBHZXQgdGhlIGNvdW50cnkgYW5kIHBsYWNlIG5hbWUuXHJcbiAgZm9yIChsZXQgYWRkcmVzc0xpbmUgb2YgdGhpc1BsYWNlLmZ1bGxBZGRyZXNzKSB7XHJcbiAgICBjb25zdCBsaW5lSW5jbENvdW50cnkgPSBhZGRyZXNzTGluZS50eXBlcy5pbmNsdWRlcyhcImNvdW50cnlcIik7XHJcbiAgICBjb25zdCBsaW5lSW5jbFBsYWNlTmFtZSA9IGFkZHJlc3NMaW5lLnR5cGVzLmluY2x1ZGVzKFwicG9saXRpY2FsXCIpO1xyXG5cclxuICAgIGlmIChsaW5lSW5jbENvdW50cnkgJiYgIWNvdW50cnlBbHJlYWR5U2V0KSB7XHJcbiAgICAgIHRoaXNQbGFjZS5jb3VudHJ5U2hvcnQgPSBhZGRyZXNzTGluZS5zaG9ydF9uYW1lO1xyXG4gICAgICB0aGlzUGxhY2UuY291bnRyeUxvbmcgPSBhZGRyZXNzTGluZS5sb25nX25hbWU7XHJcbiAgICAgIGNvdW50cnlBbHJlYWR5U2V0ID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGxpbmVJbmNsUGxhY2VOYW1lICYmICFwbGFjZU5hbWVBbHJlYWR5U2V0KSB7XHJcbiAgICAgIHRoaXNQbGFjZS5wbGFjZU5hbWUgPSBhZGRyZXNzTGluZS5sb25nX25hbWU7XHJcbiAgICAgIHBsYWNlTmFtZUFscmVhZHlTZXQgPSB0cnVlO1xyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gdGhpc1BsYWNlO1xyXG59IiwiLy8gQ2xhbXAgbnVtYmVyIGJldHdlZW4gdHdvIHZhbHVlcy5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKG51bSwgbWluLCBtYXgpIHtcclxuICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobnVtLCBtaW4pLCBtYXgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGVycChzdGFydCwgZW5kLCBwcnBydG4gPSAwLjUpIHtcclxuICByZXR1cm4gc3RhcnQgKyAoKGVuZCAtIHN0YXJ0KSAqIHBycHJ0bik7XHJcbn1cclxuXHJcbi8vIEZvciBpbnRzLCBpdCBpcyBpbmNsdXNpdmUgb2Ygc3RhcnQgYW5kIG5vdCBpbmNsdXNpdmUgb2YgZW5kLlxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZEJldHdlZW4oc3RhcnQgPSAwLCBlbmQgPSAxLCBpbnRzID0gZmFsc2UpIHtcclxuICBjb25zdCByYW5nZSA9IGVuZCAtIHN0YXJ0O1xyXG4gIGNvbnN0IHJhbmRGbG9hdCA9IChNYXRoLnJhbmRvbSgpICogcmFuZ2UpICsgc3RhcnQ7XHJcbiAgcmV0dXJuIGludHMgPyBNYXRoLmZsb29yKHJhbmRGbG9hdCkgOiByYW5kRmxvYXQ7XHJcbn1cclxuXHJcbi8vIFByb2JhYmlsaXR5IHNob3VsZCBiZSBhIGRlY2ltYWwsIHJldHVybnMgdHJ1ZSBvciBmYWxzZS5cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RSYW5kb20ocHJvYmFiaWxpdHkpIHtcclxuICByZXR1cm4gKE1hdGgucmFuZG9tKCkgPD0gcHJvYmFiaWxpdHkpID8gdHJ1ZSA6IGZhbHNlO1xyXG59XHJcblxyXG4vLyBUYWtlcyBhIGxpc3Qgb2YgcHJvYiBvYmplY3RzIGFzIGlucHV0IGluIGZvcm1hdCB7bmFtZTogbmFtZSwgcHJvYjogcHJvYn0gYW5kIFxyXG4vLyByZXR1cm5zIG5hbWUgb2YgY2hvc2VuIHByb2JPYmosIG9yIGZhbHNlIGlmIG5vbmUgY2hvc2VuIChpbiBjYXNlIHRoYXQgcHJvYk9ianMgXHJcbi8vIHByb2JzIGRvbnQgc3VtIHRvIDEpLlxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdFJhbmRNdWx0KC4uLnByb2JzKSB7XHJcbiAgY29uc3QgcHJvYnNPYmpzID0gW107XHJcbiAgbGV0IGN1cnJQcm9iU3RhcnQgPSAwO1xyXG5cclxuICBwcm9icy5mb3JFYWNoKHByb2IgPT4ge1xyXG4gICAgY29uc3QgdGhpc1Byb2IgPSB7XHJcbiAgICAgIG5hbWU6IHByb2IubmFtZSxcclxuICAgICAgc3RhcnQ6IGN1cnJQcm9iU3RhcnQsXHJcbiAgICAgIGVuZDogY3VyclByb2JTdGFydCArIHByb2IucHJvYlxyXG4gICAgfTtcclxuXHJcbiAgICBwcm9ic09ianMucHVzaCh0aGlzUHJvYik7XHJcblxyXG4gICAgY3VyclByb2JTdGFydCArPSBwcm9iO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBjaG9zZW5WYWwgPSBNYXRoLnJhbmRvbSgpO1xyXG4gIGxldCByZXR1cm5WYWwgPSBmYWxzZTtcclxuXHJcbiAgcHJvYnNPYmpzLmZvckVhY2gocHJvYiA9PiB7XHJcbiAgICBjb25zdCBjaG9zZW5UaGlzUHJvYiA9IHByb2Iuc3RhcnQgPD0gY2hvc2VuVmFsICYmIHByb2IuZW5kID4gY2hvc2VuVmFsO1xyXG4gICAgaWYgKGNob3NlblRoaXNQcm9iKSB7XHJcbiAgICAgIHJldHVyblZhbCA9IHByb2IubmFtZTtcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByZXR1cm5WYWw7XHJcbn1cclxuXHJcbi8vIFNlYXJjaGVzIGZvciBhIG5ld0l0ZW0gaW4gYW4gYXJyYXkgZ2l2ZW4gYW4gZWxlbUNvbXBGdW5jIHRoYXQgZGV0ZXJtaW5lcyBcclxuLy8gd2hldGhlciBpdCBpcyBwcmVzZW50IG9yIG5vdCAoZWcuIHRvIGZpbmQgYmFzZWQgb24gcXVlc3Rpb24gSUQpLiBJZiBwcmVzZW50LCBcclxuLy8gZWxlbWVudCBpbiBhcnJheSBpcyBvdmVyd3JpdHRlbiB3aXRoIG5ld0l0ZW0sIG90aGVyd2lzZSBuZXdJdGVtIGlzIHB1c2hlZCB0byBcclxuLy8gZW5kIG9mIGFycmF5LlxyXG5leHBvcnQgZnVuY3Rpb24gZmluZEFuZE92ZXJ3cml0ZUVsc2VQdXNoKGFycmF5LCBuZXdJdGVtLCBlbGVtQ29tcEZ1bmMpIHtcclxuICBjb25zdCBmb3VuZEluZGV4ID0gYXJyYXkuZmluZEluZGV4KGFyckl0ZW0gPT4gZWxlbUNvbXBGdW5jKGFyckl0ZW0sIG5ld0l0ZW0pKTtcclxuXHJcbiAgLy8gSWYgZm91bmQsIG92ZXJ3cml0ZS5cclxuICBpZiAoZm91bmRJbmRleCA+IC0xKSB7XHJcbiAgICBhcnJheS5zcGxpY2UoZm91bmRJbmRleCwgMSwgbmV3SXRlbSk7XHJcbiAgfVxyXG4gIC8vIE90aGVyd2lzZSBhZGQuXHJcbiAgZWxzZSB7XHJcbiAgICBhcnJheS5wdXNoKG5ld0l0ZW0pO1xyXG4gIH07XHJcbn1cclxuXHJcbi8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiB0cmFuc2l0aW9uIG9uIGdpdmVuIGVsZW1lbnQgZW5kcywgXHJcbi8vIG9wdGlvbmFsIHRyYW5zaXRpb24gcHJvcGVydHkgbmFtZSBjaGVjay5cclxuZXhwb3J0IGZ1bmN0aW9uIGF3YWl0VHJhbnNpdGlvbihlbGVtLCBwcm9wTmFtZSA9IG51bGwpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGFzeW5jIGV2dCA9PiB7XHJcblxyXG4gICAgICBpZiAocHJvcE5hbWUpIHtcclxuICAgICAgICBpZiAoZXZ0LnByb3BlcnR5TmFtZSA9PT0gcHJvcE5hbWUpIHtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgYXdhaXQgYXdhaXRUcmFuc2l0aW9uKGVsZW0sIHByb3BOYW1lKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfSwge29uY2U6IHRydWV9KTtcclxuICB9KVxyXG59XHJcblxyXG4vLyBGb3IgdGVzdGluZyBsb25nIHJ1bm5pbmcgZnVuY3Rpb25zLlxyXG4vLyBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzAwMCkpOyAvLy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBnZXRQbGFjZURldGFpbHMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkSnMvZ2V0UGxhY2VEZXRhaWxzLm1qc1wiO1xyXG5pbXBvcnQgXCIuLi9tb2R1bGVzL3JlZ0xvZ2luLm1qc1wiO1xyXG5cclxuXHJcblxyXG5sZXQgYXV0b2NvbXBsZXRlO1xyXG5jb25zdCBmdWxsQWRkcmVzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZnVsbC1hZGRyZXNzXCIpO1xyXG5jb25zdCBsb2NEZXRhaWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5sb2MtZGV0YWlsXCIpO1xyXG5cclxud2luZG93Lm9ubG9hZCA9IGluaXRBdXRvY29tcGxldGUoKTtcclxuXHJcbmF1dG9jb21wbGV0ZS5hZGRMaXN0ZW5lcihcInBsYWNlX2NoYW5nZWRcIiwgcGxhY2VDaG9zZW4pO1xyXG5cclxuZnVuY3Rpb24gaW5pdEF1dG9jb21wbGV0ZSgpIHtcclxuICBjb25zdCBsb2NJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jLWlucHV0XCIpO1xyXG4gIGF1dG9jb21wbGV0ZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuQXV0b2NvbXBsZXRlKGxvY0lucHV0KTtcclxufVxyXG5cclxuLy8gV2hlbiBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBpcyBjaG9zZW4sIGdldCB0aGUgZ29vZ2xlIHBsYWNlIGluZm9ybWF0aW9uIGFuZCBcclxuLy8gcG9wdWxhdGUgZm9ybSBmaWVsZHMgd2l0aCB0aGlzIGluZm8uXHJcbmZ1bmN0aW9uIHBsYWNlQ2hvc2VuKCkge1xyXG4gIGNvbnN0IHBsYWNlID0gYXV0b2NvbXBsZXRlLmdldFBsYWNlKCk7XHJcblxyXG4gIGNvbnN0IGZvdW5kUGxhY2UgPSBcImFkZHJlc3NfY29tcG9uZW50c1wiIGluIHBsYWNlO1xyXG4gIGlmIChmb3VuZFBsYWNlKSB7XHJcbiAgICBjb25zdCB0aGlzUGxhY2UgPSBnZXRQbGFjZURldGFpbHMocGxhY2UpO1xyXG4gICAgcG9wdWxhdGVGb3JtKHRoaXNQbGFjZSk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8vIFBvcHVsYXRlIGZvcm0gZmllbGRzIHdpdGggc29tZSB2aXNpYmlsZSBhbmQgc29tZSBoaWRkZW4gcGxhY2UgaW5mby5cclxuZnVuY3Rpb24gcG9wdWxhdGVGb3JtKHRoaXNQbGFjZSkge1xyXG4gIGxvY0RldGFpbHMuZm9yRWFjaChsb2NEZXRhaWwgPT4gbG9jRGV0YWlsLnZhbHVlID0gXCJcIik7XHJcblxyXG4gIGZvciAobGV0IGRldGFpbCBpbiB0aGlzUGxhY2UpIHtcclxuICAgIGlmIChkZXRhaWwgPT09IFwiZnVsbEFkZHJlc3NcIikge1xyXG4gICAgICBmdWxsQWRkcmVzcy5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzUGxhY2VbZGV0YWlsXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGFkZHJlc3NMaW5lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgYWRkcmVzc0xpbmVJbnB1dC5jbGFzc0xpc3QuYWRkKFwiZnVsbHktaGlkZGVuXCIpO1xyXG4gICAgICAgIGFkZHJlc3NMaW5lSW5wdXQudmFsdWUgPSB0aGlzUGxhY2VbZGV0YWlsXVtpXS5sb25nX25hbWU7XHJcbiAgICAgICAgYWRkcmVzc0xpbmVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIGBmdWxsQWRkcmVzcyR7aX1gKTtcclxuICAgICAgICBmdWxsQWRkcmVzcy5hcHBlbmRDaGlsZChhZGRyZXNzTGluZUlucHV0KTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc3QgZm9ybUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW25hbWU9XCIke2RldGFpbH1cIl1gKTtcclxuICAgICAgZm9ybUlucHV0LnZhbHVlID0gdGhpc1BsYWNlW2RldGFpbF07XHJcbiAgICB9O1xyXG4gIH07XHJcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=