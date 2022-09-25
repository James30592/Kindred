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

    const qText = this._getQTextElem(q, catTypeName, catName);
    const qScore = this._getQScoreElem(q);
    this._setupQImg(q, qSourceItem);

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

  _getQTextElem(q, catTypeName, catName) {
    const qText = document.createElement("p");

    qText.innerText = getQInfo(q.questionDetails, "qSourceDisplayText", 
      catTypeName, catName);
    
    qText.classList.add("q-text");
    return qText;
  }

  _getQScoreElem(q) {
    const qScore = document.createElement("p");
    qScore.innerText = this._getScoreText(q);
    qScore.classList.add("user-score");
    return qScore;
  }

  // Add event listener for click to the image / placeholder image.
  // Also create and add hover effect div.
  _setupQImg(q, qSourceItem) {
    const qImg = qSourceItem.querySelector("img") ?? 
      qSourceItem.querySelector(".placeholder-img");

    qImg.addEventListener("click", evt => {
      this._handleRateBtnClick(evt, q);
    });

    const imgWrapperDiv = document.createElement("div");
    imgWrapperDiv.classList.add("q-source-img-wrapper");

    // Change img to be parented by the img wrapper div instead.
    imgWrapperDiv.appendChild(qImg);
    qSourceItem.insertBefore(imgWrapperDiv, qSourceItem.children[0]);

    // Add a hover div, also in the wrapper div.
    const hoverDiv = document.createElement("div");
    hoverDiv.classList.add("q-source-item-hover");

    const hoverTxt = document.createElement("span");
    hoverTxt.innerText = this._getHoverText();
    hoverTxt.classList.add("q-source-hover-txt");

    hoverDiv.appendChild(hoverTxt);
    imgWrapperDiv.appendChild(hoverDiv);
  }
}