import { findAndOverwriteElsePush } from "../../../../sharedJs/utils.mjs";



class SingleModeQSource extends EventTarget {
  
}







export class PreviousAnswers extends SingleModeQSource {
  #listDiv;
  #notYetActivated = true;
  // Combination of all DB answers overwritten with any more recent answers for 
  // current session.
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
  async activate() {
    // Get user's current answers in the DB for this category, if first time running.
    if (this.#notYetActivated) {
      this.#prevAnswers = await this.#getDBAnswers();
    };

    this.#listDiv.classList.remove("fully-hidden");
  }

  // Updates this #prevAnswers and the div list on a change.
  updateAnswersList(latestSessionAnswers) {
    // Add / overwrite prevAnswers with any newAnswers as necessary.
    this.#updatePrevAnswers(latestSessionAnswers);

    // Populate the listDiv with each answer as a row.
    const areNewAnswers = latestSessionAnswers.length > 0;
    if (areNewAnswers || this.#notYetActivated) {
      this.#clearListDiv();
      this.#buildListDiv();
    };

    if (this.#notYetActivated) this.#notYetActivated = false;
  }

  // Get user's current answers in the DB for this category.
  async #getDBAnswers() {
    const fetchCurrDBAnswers = await fetch(`/user-answers/${this.#categoryTypeName}/${this.#categoryName}`);
    const currDBAnswers = await fetchCurrDBAnswers.json();
    return currDBAnswers;
  }

  // Add / overwrite prevAnswers with any newAnswers as necessary.
  #updatePrevAnswers(latestSessionAnswers) {
    const matchFunc = (arrItem, newItem) => {
      return arrItem.questionId === newItem.questionId
    };

    for (let newAnswer of latestSessionAnswers) {
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

    answerReScoreBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("answerSingleQ", {detail: {answer: answer}})
      );
    });

    const thisAnsText = this.#getAnswerDisplayText(answer?.questionDetails);
    answerText.innerText = `${thisAnsText}. Skipped: ${answer.skip}. Answer Percentage: ${answer?.answerPercentile}.`;
    answerReScoreBtn.innerText = "Re-rate";
    
    rowDiv.appendChild(answerText);
    rowDiv.appendChild(answerReScoreBtn);

    return rowDiv;
  }

  // Hides the list.
  deactivate() {
    this.#listDiv.classList.add("fully-hidden");
  }

  // Get the string to show as the question text, depending on the category.
  #getAnswerDisplayText(questionDetails) {
    let displayText;
  
    switch(this.#categoryTypeName, this.#categoryName) {
  
      case ("Interests", "Films") :
        displayText = `${questionDetails?.title}`;
        break;
  
      case ("Interests", "TV") :
        displayText = `${questionDetails?.title}`;
        break;

      case ("Interests", "Music"):
        displayText = `${questionDetails?.trackName} - ${questionDetails?.artist}`;
        break;
  
      case ("Interests", "Video Games"):
        displayText = `${questionDetails?.title}`;
        break;
  
      case ("Interests", "Books"):
        displayText = `${questionDetails?.title} (${questionDetails?.author})`;
        break;
  
      default:
        displayText = questionDetails?.text;
    };
    
    return displayText;
  }
}