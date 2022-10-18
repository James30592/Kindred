/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
/*!************************************************!*\
  !*** ./src/js/modules/registerPlaceFinder.mjs ***!
  \************************************************/
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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJQbGFjZUZpbmRlci5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNyQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05xRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLDhFQUFlO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiw4QkFBOEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsNERBQTRELEVBQUU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxPQUFPO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raW5kcmVkLy4vc3JjL3NoYXJlZEpzL2dldFBsYWNlRGV0YWlscy5tanMiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9raW5kcmVkL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8va2luZHJlZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2tpbmRyZWQvLi9zcmMvanMvbW9kdWxlcy9yZWdpc3RlclBsYWNlRmluZGVyLm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVc2VkIGJ5IHRoZSBhdXRvY29tcGxldGUgd2hlbiByZWdpc3RlcmluZyBhIG5ldyB1c2VyIGJvdGggb24gcmVnaXN0ZXIgcGFnZSBcclxuLy8gbWFudWFsbHkgYW5kIGluIGFkbWluIHJvdXRlIG9uIGJhY2tlbmQuXHJcblxyXG4vLyBDcmVhdGUgbXkgb3duIHBsYWNlIG9iamVjdCBmcm9tIHRoZSBHb29nbGUgcGxhY2Ugb2JqZWN0LlxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGxhY2VEZXRhaWxzKHBsYWNlLCBhdXRvSW5wdXQgPSB0cnVlKSB7XHJcbiAgY29uc3QgdGhpc1BsYWNlID0ge1xyXG4gICAgZm9ybWF0dGVkQWRkcmVzczogcGxhY2UuZm9ybWF0dGVkX2FkZHJlc3MsXHJcbiAgICBmdWxsQWRkcmVzczogcGxhY2UuYWRkcmVzc19jb21wb25lbnRzLFxyXG4gICAgZ29vZ2xlUGxhY2VJZDogcGxhY2UucGxhY2VfaWRcclxuICB9O1xyXG5cclxuICBjb25zdCBsYXRMbmdEZXRhaWxzID0gdGhpc1BsYWNlLmxhdCA9IHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uO1xyXG5cclxuICBbdGhpc1BsYWNlLmxhdCwgdGhpc1BsYWNlLmxuZ10gPSBhdXRvSW5wdXQgPyBcclxuICAgIFtsYXRMbmdEZXRhaWxzLmxhdCgpLCBsYXRMbmdEZXRhaWxzLmxuZygpXSA6IFxyXG4gICAgW2xhdExuZ0RldGFpbHMubGF0LCBsYXRMbmdEZXRhaWxzLmxuZ11cclxuICBcclxuICBsZXQgW2NvdW50cnlBbHJlYWR5U2V0LCBwbGFjZU5hbWVBbHJlYWR5U2V0XSA9IFtmYWxzZSwgZmFsc2VdO1xyXG5cclxuICAvLyBHZXQgdGhlIGNvdW50cnkgYW5kIHBsYWNlIG5hbWUuXHJcbiAgZm9yIChsZXQgYWRkcmVzc0xpbmUgb2YgdGhpc1BsYWNlLmZ1bGxBZGRyZXNzKSB7XHJcbiAgICBjb25zdCBsaW5lSW5jbENvdW50cnkgPSBhZGRyZXNzTGluZS50eXBlcy5pbmNsdWRlcyhcImNvdW50cnlcIik7XHJcbiAgICBjb25zdCBsaW5lSW5jbFBsYWNlTmFtZSA9IGFkZHJlc3NMaW5lLnR5cGVzLmluY2x1ZGVzKFwicG9saXRpY2FsXCIpO1xyXG5cclxuICAgIGlmIChsaW5lSW5jbENvdW50cnkgJiYgIWNvdW50cnlBbHJlYWR5U2V0KSB7XHJcbiAgICAgIHRoaXNQbGFjZS5jb3VudHJ5U2hvcnQgPSBhZGRyZXNzTGluZS5zaG9ydF9uYW1lO1xyXG4gICAgICB0aGlzUGxhY2UuY291bnRyeUxvbmcgPSBhZGRyZXNzTGluZS5sb25nX25hbWU7XHJcbiAgICAgIGNvdW50cnlBbHJlYWR5U2V0ID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGxpbmVJbmNsUGxhY2VOYW1lICYmICFwbGFjZU5hbWVBbHJlYWR5U2V0KSB7XHJcbiAgICAgIHRoaXNQbGFjZS5wbGFjZU5hbWUgPSBhZGRyZXNzTGluZS5sb25nX25hbWU7XHJcbiAgICAgIHBsYWNlTmFtZUFscmVhZHlTZXQgPSB0cnVlO1xyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gdGhpc1BsYWNlO1xyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBnZXRQbGFjZURldGFpbHMgfSBmcm9tIFwiLi4vLi4vc2hhcmVkSnMvZ2V0UGxhY2VEZXRhaWxzLm1qc1wiO1xyXG5cclxuXHJcblxyXG5sZXQgYXV0b2NvbXBsZXRlO1xyXG5jb25zdCBmdWxsQWRkcmVzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZnVsbC1hZGRyZXNzXCIpO1xyXG5jb25zdCBsb2NEZXRhaWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5sb2MtZGV0YWlsXCIpO1xyXG5cclxud2luZG93Lm9ubG9hZCA9IGluaXRBdXRvY29tcGxldGUoKTtcclxuXHJcbmF1dG9jb21wbGV0ZS5hZGRMaXN0ZW5lcihcInBsYWNlX2NoYW5nZWRcIiwgcGxhY2VDaG9zZW4pO1xyXG5cclxuZnVuY3Rpb24gaW5pdEF1dG9jb21wbGV0ZSgpIHtcclxuICBjb25zdCBsb2NJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jLWlucHV0XCIpO1xyXG4gIGF1dG9jb21wbGV0ZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuQXV0b2NvbXBsZXRlKGxvY0lucHV0KTtcclxufVxyXG5cclxuLy8gV2hlbiBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBpcyBjaG9zZW4sIGdldCB0aGUgZ29vZ2xlIHBsYWNlIGluZm9ybWF0aW9uIGFuZCBcclxuLy8gcG9wdWxhdGUgZm9ybSBmaWVsZHMgd2l0aCB0aGlzIGluZm8uXHJcbmZ1bmN0aW9uIHBsYWNlQ2hvc2VuKCkge1xyXG4gIGNvbnN0IHBsYWNlID0gYXV0b2NvbXBsZXRlLmdldFBsYWNlKCk7XHJcblxyXG4gIGNvbnN0IGZvdW5kUGxhY2UgPSBcImFkZHJlc3NfY29tcG9uZW50c1wiIGluIHBsYWNlO1xyXG4gIGlmIChmb3VuZFBsYWNlKSB7XHJcbiAgICBjb25zdCB0aGlzUGxhY2UgPSBnZXRQbGFjZURldGFpbHMocGxhY2UpO1xyXG4gICAgcG9wdWxhdGVGb3JtKHRoaXNQbGFjZSk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8vIFBvcHVsYXRlIGZvcm0gZmllbGRzIHdpdGggc29tZSB2aXNpYmlsZSBhbmQgc29tZSBoaWRkZW4gcGxhY2UgaW5mby5cclxuZnVuY3Rpb24gcG9wdWxhdGVGb3JtKHRoaXNQbGFjZSkge1xyXG4gIGxvY0RldGFpbHMuZm9yRWFjaChsb2NEZXRhaWwgPT4gbG9jRGV0YWlsLnZhbHVlID0gXCJcIik7XHJcblxyXG4gIGZvciAobGV0IGRldGFpbCBpbiB0aGlzUGxhY2UpIHtcclxuICAgIGlmIChkZXRhaWwgPT09IFwiZnVsbEFkZHJlc3NcIikge1xyXG4gICAgICBmdWxsQWRkcmVzcy5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzUGxhY2VbZGV0YWlsXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGFkZHJlc3NMaW5lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgYWRkcmVzc0xpbmVJbnB1dC5jbGFzc0xpc3QuYWRkKFwiZnVsbHktaGlkZGVuXCIpO1xyXG4gICAgICAgIGFkZHJlc3NMaW5lSW5wdXQudmFsdWUgPSB0aGlzUGxhY2VbZGV0YWlsXVtpXS5sb25nX25hbWU7XHJcbiAgICAgICAgYWRkcmVzc0xpbmVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIGBmdWxsQWRkcmVzcyR7aX1gKTtcclxuICAgICAgICBmdWxsQWRkcmVzcy5hcHBlbmRDaGlsZChhZGRyZXNzTGluZUlucHV0KTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBlbHNlIHtcclxuICAgICAgY29uc3QgZm9ybUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW25hbWU9XCIke2RldGFpbH1cIl1gKTtcclxuICAgICAgZm9ybUlucHV0LnZhbHVlID0gdGhpc1BsYWNlW2RldGFpbF07XHJcbiAgICB9O1xyXG4gIH07XHJcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=