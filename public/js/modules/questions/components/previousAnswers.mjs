import { findAndOverwriteElsePush } from "../../../../sharedJs/utils.mjs";



export class PreviousAnswers {
  #listDiv;
  #notYetActivated = true;
  #prevAnswers = [];
  #categoryTypeName;
  #categoryName;

  constructor(listDiv, categoryTypeName, categoryName) {
    this.#listDiv = listDiv;
    this.#categoryTypeName = categoryTypeName;
    this.#categoryName = categoryName;
  }

  // Get the latest version of all the user's current answers and update the 
  // div with them.
  async activate(latestNewAnswers) {
    // Get user's current answers in the DB for this category, if first time running.
    if (this.#notYetActivated) {
      this.#prevAnswers = await this.#getDBAnswers();
    };

    // Add / overwrite prevAnswers with any newAnswers as necessary.
    this.#updatePrevAnswers(latestNewAnswers);

    // Populate the listDiv with each answer as a row.
    const areNewAnswers = latestNewAnswers.length > 0;
    if (areNewAnswers || this.#notYetActivated) {
      this.#clearListDiv();
      this.#buildListDiv();
    };

    this.#listDiv.classList.remove("fully-hidden");
    this.#notYetActivated = false;
  }

  // Get user's current answers in the DB for this category.
  async #getDBAnswers() {
    const fetchCurrDBAnswers = await fetch(`/user-answers/${this.#categoryTypeName}/${this.#categoryName}`);
    const currDBAnswers = await fetchCurrDBAnswers.json();
    return currDBAnswers;
  }

  // Add / overwrite prevAnswers with any newAnswers as necessary.
  #updatePrevAnswers(latestNewAnswers) {
    const matchFunc = (arrItem, newItem) => {
      return arrItem.questionId === newItem.questionId
    };

    for (let newAnswer of latestNewAnswers) {
      findAndOverwriteElsePush(this.#prevAnswers, newAnswer, matchFunc);
    };
  }

  // Removes all the rows of answers from the prevAnswers list div.
  #clearListDiv() {
    this.#listDiv.innerText = "";
  }

  // Builds the list div with all the previous answers.
  #buildListDiv() {
    for (let prevAnswer of this.#prevAnswers) {
      const ansRowDiv = this.#createRow(prevAnswer);
      this.#listDiv.appendChild(ansRowDiv);
    };
  }

  // Create a div with information for a previous answer.
  #createRow(answer) {
    const rowDiv = document.createElement("div");
    const answerText = document.createElement("span");
    const answerReScoreBtn = document.createElement("button");
    
    answerText.innerText = `Question ID: ${answer.questionId}. Skipped: ${answer.skip}. Answer Percentage: ${answer?.answerPercentile}.`;
    answerReScoreBtn.innerText = "Re-rate";
    
    rowDiv.appendChild(answerText);
    rowDiv.appendChild(answerReScoreBtn);

    return rowDiv;
  }

  // Hides the list.
  deactivate() {
    this.#listDiv.classList.add("fully-hidden");
  }
}