import { createQDomItem, getQCategory, getQInfo } from "../../../../../sharedJs/utils.mjs";



export class SingleModeQSource extends EventTarget {
  _listDiv;

  constructor(listDiv) {
    super();
    this._listDiv = listDiv;
  }

  // Create a div with information for a question item.
  _createQDiv(q) {
    const [catTypeName, catName] = getQCategory(q, this._categoryTypeName, 
      this._categoryName);

    const qSourceItem = createQDomItem(q.questionDetails, catTypeName, catName);

    const qText = document.createElement("span");
    const qScore = document.createElement("span");

    qSourceItem.addEventListener("click", evt => {
      this._handleRateBtnClick(evt, q);
    });

    qText.innerText = getQInfo(q.questionDetails, "qSourceDisplayText", 
    catTypeName, catName);
    
    qScore.innerText = this._getScoreText(q);

    qSourceItem.appendChild(qText);
    qSourceItem.appendChild(qScore);

    // rateBtn.innerText = this._getRateBtnText();
    return qSourceItem;
  }

  _handleRateBtnClick(evt, question) {
    this.dispatchEvent(
      new CustomEvent("answerSingleQ", {detail: {question: question}})
    );
  }

  // Builds the list div with all the questions.
  _buildListDiv(questions) {
    for (let question of questions) {
      const rowDiv = this._createQDiv(question);
      this._listDiv.appendChild(rowDiv);
    };
  }
}