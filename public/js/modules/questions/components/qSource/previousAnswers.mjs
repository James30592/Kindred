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
    super();
    this.#listDiv = listDiv;
    this.#categoryTypeName = categoryTypeName;
    this.#categoryName = categoryName;
  }

  // Get the latest version of all the user's current answers and update the 
  // div with them.
  async activate() {
    // Get user's current answers in the DB for this category, if first time 
    // running, and populate the DOM list.
    if (this.#notYetActivated) {
      this.#prevAnswers = await this.#getDBAnswers();
      this.#buildListDiv();
      this.#notYetActivated = false;
    };

    this.#listDiv.classList.remove("fully-hidden");
  }

  // Updates this #prevAnswers and the div list on a change.
  updateAnswersList(latestSessionAnswers) {
    for (let newAnswer of latestSessionAnswers) {
      // Update this prevAnswers and the DOM list with the latest 
      // session answers.
      const foundIndex = this.#prevAnswers.findIndex(prevAns => {
        return prevAns.questionId === newAnswer.questionId
      });

      const newAnsRowDiv = this.#createRow(newAnswer);

      // If found, overwrite with new answer.
      if (foundIndex > -1) {
        this.#prevAnswers.splice(foundIndex, 1, newAnswer);
        // this.#listDiv.children.splice(foundIndex, 1, newAnsRowDiv);
        this.#listDiv.replaceChild(newAnsRowDiv, this.#listDiv.children[foundIndex]);
      }
      // Otherwise add new row to end of the listDiv.
      else {
        this.#prevAnswers.push(newAnswer);
        this.#listDiv.appendChild(newAnsRowDiv);
      };
    };
  }

  // Get user's current answers in the DB for this category.
  async #getDBAnswers() {
    const fetchCurrDBAnswers = await fetch(`/user-answers/${this.#categoryTypeName}/${this.#categoryName}`);
    const currDBAnswers = await fetchCurrDBAnswers.json();
    return currDBAnswers;
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