// Clamp number between two values.
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Searches for a newItem in an array given an elemCompFunc that determines 
// whether it is present or not (eg. to find based on question ID). If present, 
// element in array is overwritten with newItem, otherwise newItem is pushed to 
// end of array.
export function findAndOverwriteElsePush(array, newItem, elemCompFunc) {
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

// Fade transition helper functions, used with transparent, fully-hidden and 
// fade-trans css classes.
// Makes display property visible and then removes transparency.
export function fadeIn(elem) {
  elem.classList.remove("fully-hidden");
  setTimeout(() => elem.classList.remove("transparent"), 10);
}

export function fadeOut(elem) {
  elem.classList.add("transparent");
}

// Function that returns a promise that resolves when opacity transition on the 
// given element is completed. Also fully hides the element.
export async function finishFadeOut(elem) {
  return new Promise(resolve => {
    elem.addEventListener('transitionend', evt => {
      if (evt.propertyName === "opacity") {
        elem.classList.add("fully-hidden");
        resolve();
      };
    }, {once: true});
  })
};

// Fade out and fully hide the given element.
export function fullyFadeOut(elem) {
  fadeOut(elem);
  finishFadeOut(elem);
}






// For testing long running functions.
// await new Promise(resolve => setTimeout(resolve, 5000)); //........................................................