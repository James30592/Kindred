import { createQDomItem, getQCategory, getQInfo } from "../../../../../sharedJs/utils.mjs";



export class SingleModeQSource extends EventTarget {
  _listDiv;
  _contentDiv;
  _qDivClass;

  constructor(listDiv) {
    super();
    this._listDiv = listDiv;
    this._contentDiv = listDiv.querySelector(".content");
  }

  // Create a div with information for a question item.
  _createQDiv(q) {
    const [catTypeName, catName] = getQCategory(q, this._categoryTypeName, 
      this._categoryName);

    const qSourceItem = createQDomItem(q.questionDetails, catTypeName, catName);
    qSourceItem.classList.add(this._qDivClass);

    const qText = document.createElement("span");
    const qScore = document.createElement("span");

    qSourceItem.addEventListener("click", evt => {
      this._handleRateBtnClick(evt, q);
    });

    qText.innerText = getQInfo(q.questionDetails, "qSourceDisplayText", 
      catTypeName, catName);
    
    qScore.innerText = this._getScoreText(q);

    const qInfo = {
      qSourceItem: qSourceItem,
      qText: qText,
      qScore: qScore,
      catTypeName: catTypeName,
      catName: catName
    };

    this._addToQDiv(qInfo);
    return qSourceItem;
  }

  _handleRateBtnClick(evt, question) {
    this.dispatchEvent(
      new CustomEvent("answerSingleQ", {detail: {question: question}})
    );
  }

  // Builds the content div with all the questions.
  _buildContentDiv(questions) {
    for (let question of questions) {
      const qSourceItem = this._createQDiv(question);
      this._contentDiv.appendChild(qSourceItem);
    };
  }
}