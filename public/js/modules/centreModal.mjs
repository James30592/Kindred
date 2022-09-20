import { fadeIn, fullyFadeOut } from "./fadeTransitions.mjs";



export class CentreModal {
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
    fadeIn(this.wrapper);
  }

  hide() {
    fullyFadeOut(this.wrapper);
  }
}