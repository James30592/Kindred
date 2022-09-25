// Helper functions to assist with fading in / out DOM elements.
import { awaitTransition } from "../../sharedJs/utils.mjs";



// Fade transition helper functions, used with transparent, fully-hidden and 
// fade-trans css classes.
// Makes display property visible and then removes transparency.
export function fadeIn(elem) {
  elem.classList.remove("fully-hidden");
  setTimeout(() => elem.classList.remove("transparent"), 10);
}

export async function finishFadeIn(elem) {
  await awaitTransition(elem, "opacity");
}

// Finishes when fade in is completed.
export async function fullyFadeIn(elem) {
  fadeIn(elem);
  await finishFadeIn(elem);
}

export function fadeOut(elem) {
  elem.classList.add("transparent");
}

// Function that returns a promise that resolves when opacity transition on the 
// given element is completed. Also fully hides the element.
export async function finishFadeOut(elem) {
  await awaitTransition(elem, "opacity");
  elem.classList.add("fully-hidden");
}

// Fade out and fully hide the given element.
export async function fullyFadeOut(elem) {
  fadeOut(elem);
  await finishFadeOut(elem);
}

// Fades out elem1 and fades in elem2 once transition completed, doesn't finish 
// until elem2 fully faded in. Returns promise.
export function fadeFromTo(elem1, elem2) {
  const fadeCompletePromise = new Promise(async resolve => {
    await fullyFadeOut(elem1);
    await fullyFadeIn(elem2);
    resolve();
  });

  return fadeCompletePromise;
}