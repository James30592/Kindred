export class SingleModeQSource extends EventTarget {
  _listDiv;  

  // Create a div with information for a question item.
  _createRow(item) {
    const rowDiv = document.createElement("div");
    const qText = document.createElement("span");
    const rateBtn = document.createElement("button");

    rateBtn.addEventListener("click", evt => {
      this._handleRateBtnClick(evt);
    });

    qText.innerText = this._getQText(item);
    rateBtn.innerText = this._getRateBtnText();
    
    rowDiv.appendChild(qText);
    rowDiv.appendChild(rateBtn);

    return rowDiv;
  }

  _handleRateBtnClick(evt) {
    this.dispatchEvent(
      new CustomEvent("answerSingleQ", {detail: {answer: item}})
    );
  }

  // Get the string to show as the question text, depending on the category.
  _getAnswerDisplayText(questionDetails, categoryTypeName, categoryName) {
    let displayText;
  
    switch(categoryTypeName, categoryName) {
  
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