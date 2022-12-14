import { fadeIn, fadeOut } from "../../../fadeTransitions.mjs";
import { AnswerUIPanel } from "./components/answerUiPanel.mjs";



export class QuestionsMode extends EventTarget {
  mainDiv;
  answerUiPanel;
  questionsQueue;
  btn;

  constructor(mainDiv, btn = null) {
    super();
    this.mainDiv = mainDiv;
    this.btn = btn;
    this.answerUiPanel = new AnswerUIPanel(mainDiv);
  }

  // Sets up the answer UI panel button event listeners.
  init() {
    this.answerUiPanel.rateBtn.addEventListener("click", evt => {
      this.answerQuestion(evt);
    });
    this.answerUiPanel.skipBtn.addEventListener("click", evt => {
      this.answerQuestion(evt);
    });
  }

  // Passes the allRecentAnswers on to the questions queue.
  setRecentAnswers(allRecentAnswers) {
    this.questionsQueue.setRecentAnswers(allRecentAnswers);
  }

  // Updates the displayed question in the answer UI panel with the new first 
  // queue item.
  _showCurrQ(inclAlreadyAnswered = true) {
    // Gets information on whether queue is now empty, or what the next 10 
    // queue items (and first question user answer, if necessary) should be.
    const newCurrQInfo = this.questionsQueue.getCurrQInfo();

    this.answerUiPanel.displayCurrQ(newCurrQInfo, inclAlreadyAnswered);
  }

  // Gets current answer to current question as an object for DB.
  getAnswerObj(event, currQuestion) {
    const userSkipped = (event.currentTarget === this.answerUiPanel.skipBtn);
    const thisScore = (userSkipped ? null : Number(this.answerUiPanel.
      scoreSliderInput.value));
      
    const questionDetails = this._getQuestionDetails(currQuestion);

    const answerInfo = {
      questionId: currQuestion._id,
      skip: userSkipped,
      questionDetails: questionDetails
    };
  
    if (!userSkipped) {
      answerInfo.answerVal = thisScore;
    };

    return answerInfo;
  }

  // Gets all the question details (eg. title, release date etc.) for the current 
  // question in an object to be added to the answers object, to be added to the DB.
  _getQuestionDetails(currQuestion) {
    const questionDetails = {};
    const propsToIgnore = ["_id", "apiPageNum", "alreadyInDb", "currAns"];

    for (let prop in currQuestion) {
      const ignoreProp = propsToIgnore.includes(prop);
      if (ignoreProp) continue;
      questionDetails[prop] = currQuestion[prop];
    };

    return questionDetails;
  }

  activate() {
    if (this.btn) {
      this.btn.classList.add("active-q-mode");
    };

    fadeIn(this.mainDiv);
  }

  deactivate() {
    if (this.btn) {
      this.btn.classList.remove("active-q-mode");
    };

    fadeOut(this.mainDiv);
  }
}