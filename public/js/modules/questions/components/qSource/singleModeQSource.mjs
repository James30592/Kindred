import { createQDomItem, getQCategory, getQInfo } from "../../questionsHelpers.mjs";



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

    const qSourceItem = createQDomItem(q.questionDetails, catTypeName, 
      catName);

    qSourceItem.classList.add(this._qDivClass);

    const qText = document.createElement("span");
    const qScore = document.createElement("span");

    const qImg = qSourceItem.querySelector("img") ?? 
      qSourceItem.querySelector(".placeholder-img");

    qImg.addEventListener("click", evt => {
      this._handleRateBtnClick(evt, q);
    });
    
    qScore.innerText = this._getScoreText(q);
    qText.innerText = getQInfo(q.questionDetails, "qSourceDisplayText", 
    catTypeName, catName);

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