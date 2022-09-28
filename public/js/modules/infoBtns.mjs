import { fullyFadeIn, fullyFadeOut } from "./fadeTransitions.mjs";



// Class for info buttons that fade transition on click.
export class InfoBtns {
  #infoBtnWrappers;

  constructor() {
    this.#infoBtnWrappers = document.querySelectorAll(".info-btn-wrapper");
  }

  init() {
    for (let btnWrapper of this.#infoBtnWrappers) {
      const btn = btnWrapper.querySelector(".info-btn");
      const txt = btnWrapper.querySelector(".info-txt");
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