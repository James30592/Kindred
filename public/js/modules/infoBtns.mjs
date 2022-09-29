import { fullyFadeIn, fullyFadeOut } from "./fadeTransitions.mjs";



// Class for info buttons that fade transition on click.
export class InfoBtns {
  #infoBtns;

  constructor() {
    this.#infoBtns = document.querySelectorAll(".info-btn");
  }

  init() {
    for (let btn of this.#infoBtns) {
      const txt = btn.querySelector(".info-txt");
      this.#setupInfoBtnClick(btn, txt);
    };
  }

  #setupInfoBtnClick(btn, txt) {
    btn.addEventListener("click", () => {
      this.#handleInfoBtnClick(btn, txt);
    }, {once: true});
  }

  async #handleInfoBtnClick(btn, txt) {
    await fullyFadeIn(txt);
    window.addEventListener("click", async () => {
      await fullyFadeOut(txt);
      this.#setupInfoBtnClick(btn, txt);
    }, {once: true});
  }
}