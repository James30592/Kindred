import { AutoQuestionsQueue } from "./components/questionsQueue.mjs";
import { SearchQuestionsQueue } from "./components/questionsQueue.mjs";
import { SingleQuestionQueue } from "./components/questionsQueue.mjs";
import { AutoQueueInputPanel } from "./components/queueInputPanel.mjs";
import { SearchQueueInputPanel } from "./components/queueInputPanel.mjs";
import { AnswerUIPanel } from "./components/answerUiPanel.mjs";



class QuestionsMode extends EventTarget {
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

  // Save answer information, update the queue if necessary.
  async answerQuestion(event) {
    // Get the answer object as it should be stored in the DB.
    const answerObj = this.getAnswerObj(event);

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();    

    // Adds more questions to the questions queue if necessary.
    let queueUpdated = await this.questionsQueue.update();
    if (queueUpdated) {
      this.questionsQueue.checkForOutdatedQs();
    };

    // Emit event to be picked up by the questions page.
    this.dispatchEvent(
      new CustomEvent("answeredQ", {detail: {answerObj: answerObj}})
    );
  }

  // Updates the questions queue and then displays the first question of it, 
  // called when switching to this questions mode.
  async updateQueueAndShowFirst() {
    await this.updateQueue();
    this._showCurrQ();
  }

  // Updates the questions queue.
  async updateQueue() {
    // Queue will only update if it's short on answers.
    await this.questionsQueue.update();

    // Checks the queue to see if any questions in it are now outdated based on 
    // recently POSTed answers or recent answers from other questions modes that 
    // haven't yet been POSTed.
    this.questionsQueue.checkForOutdatedQs();
  }

  // Updates the displayed question in the answer UI panel with the new first 
  // queue item. 
  _showCurrQ(inclAlreadyAnswered = true) {
    // Gets information on whether queue is now empty, or what the new current 
    // question text (and user answer, if necessary) should be.
    const newCurrQInfo = this.questionsQueue.getCurrQInfo();

    this.answerUiPanel.displayCurrQ(newCurrQInfo, inclAlreadyAnswered);
  }

  // Gets current answer to current question as an object for DB.
  getAnswerObj(event) {
    const userSkipped = (event.currentTarget === this.answerUiPanel.skipBtn);
    const currQuestion = this.questionsQueue.queue.shift();
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





class QModeWithQueueInput extends QuestionsMode {
  queueInputPanel;

  // Updates the displayed question in the answer UI panel with the new first 
  // queue item. 
  _showCurrQ() {
    const inclAlreadyAnswered = this.queueInputPanel?.
      includeAlreadyAnsweredCheckbox.checked;

    super._showCurrQ(inclAlreadyAnswered);
  }  
}





export class AutoMode extends QModeWithQueueInput {
  name = "auto";

  constructor(mainDiv, categoryType, category) {
    super(mainDiv);
    this.questionsQueue = new AutoQuestionsQueue(categoryType, category);
    this.queueInputPanel = new AutoQueueInputPanel(mainDiv);
  }

  // Sets up the queue input panel and answer UI panel button event listeners.
  init() {
    super.init();
    this.questionsQueue.inputPanel = this.queueInputPanel;

    this.queueInputPanel.includeAlreadyAnsweredCheckbox.addEventListener(
      "click", async () => {

      this.questionsQueue.reset();
      await this.updateQueueAndShowFirst();
    });
  }
}





export class SearchMode extends QModeWithQueueInput {
  name = "search";

  constructor(mainDiv, categoryType, category) {
    super(mainDiv);
    this.questionsQueue = new SearchQuestionsQueue(categoryType, category);
    this.queueInputPanel = new SearchQueueInputPanel(mainDiv);
  }

  // Updates the questions queue and then displays the first question of it, 
  // called when switching to this questions mode.
  async updateQueueAndShowFirst() {
    if (this.queueInputPanel.searchInput.value !== "") {
      await super.updateQueue();
    };
  
    this._showCurrQ();
  }

  // Sets up the queue input panel and answer UI panel button event listeners.
  init() {
    super.init();
    this.questionsQueue.inputPanel = this.queueInputPanel;

    this.queueInputPanel.searchBtn.addEventListener("click", async () => {
      const searchTermChanged = this.questionsQueue.newSearch();
      if (searchTermChanged) await this.updateQueueAndShowFirst();
    });

    this.queueInputPanel.includeAlreadyAnsweredCheckbox.addEventListener(
      "click", async () => {

      this.questionsQueue.newSearch();
      await this.updateQueueAndShowFirst();
    });
  }
}





class SingleAnswerMode extends QuestionsMode {
  name = "single";

  constructor(mainDiv, qSource, categoryType, category) {
    super(mainDiv);
    this.questionsQueue = new SingleQuestionQueue(categoryType, category);
    this.#qSource = qSource;
  }

  init() {
    super.init();

    this.#qSource.addEventListener("answerSingleQ", evt => {
      this._handleClickSingleQ(evt);
    });
  }

  // Save answer information.
  async answerQuestion(event) {
    // Get the answer object as it should be stored in the DB.
    const answerObj = this.getAnswerObj(event); 

    // Emit event to be picked up by the questions page.
    this.dispatchEvent(
      new CustomEvent("answeredQ", {detail: {answerObj: answerObj}})
    );

    // Hide the answer ui panel.
    this.answerUiPanel.mainDiv.classList.add("fully-hidden");
  }
}





export class PrevAnswerMode extends SingleAnswerMode {
  name = "prevAns";
  #qSource;

  _handleClickSingleQ(evt) {
    // Get the question from this prev answer and make it the queue contents.
    const thisPrevAns = evt.detail.answer;
    const thisQuestion = this.#makeQuestion(thisPrevAns);
    this.questionsQueue.update(thisQuestion);

    // Show the answer ui panel.
    this.answerUiPanel.mainDiv.classList.remove("fully-hidden");

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();
  }

  // Makes a question, ready to be shown in the answerUiPanel, from the current 
  // user answer.
  #makeQuestion(prevAns) {
    const thisQ = {
      _id: prevAns.questionId,
      currAns: {
        skip: prevAns.skip,
        answerVal: prevAns.answerVal
      }
    };

    for (let prop in prevAns.questionDetails) {
      thisQ[prop] = prevAns.questionDetails[prop]
    };

    return thisQ;
  }

  async activate() {
    await this.#qSource.activate();
  }

  // Passes the allRecentAnswers on to the questions queue.
  setRecentAnswers(latestSessionAnswers) {
    this.#qSource.updateAnswersList(latestSessionAnswers);
  }

  deactivate() {
    this.#qSource.deactivate();

    // Hide the answer ui panel.
    this.answerUiPanel.mainDiv.classList.add("fully-hidden");
  }
}