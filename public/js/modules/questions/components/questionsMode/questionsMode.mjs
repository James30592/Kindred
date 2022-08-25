import { AnswerUIPanel } from "./components/answerUiPanel.mjs";



export class QuestionsMode extends EventTarget {
  mainDiv;
  answerUiPanel;
  questionsQueue;

  constructor(mainDiv) {
    super();
    this.mainDiv = mainDiv;
    this.answerUiPanel = new AnswerUIPanel(mainDiv);
  }

  // Sets up the answer UI panel button event listeners.
  init() {
    // Sets up the change score buttons event listeners.
    this.answerUiPanel.init();

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
      ratingScore.innerText));
      
    const questionDetails = this._getQuestionDetails(currQuestion);

    const answerInfo = {
      questionId: currQuestion._id,
      skip: userSkipped,
      questionDetails: questionDetails
    };
  
    if (!userSkipped) {
      answerInfo.answerVal = thisScore;
      answerInfo.answerPercentile = thisScore * 10
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
    this.mainDiv.classList.remove("fully-hidden");
  }

  deactivate() {
    this.mainDiv.classList.add("fully-hidden");
  }
}