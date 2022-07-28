import { AutoQuestionsQueue } from "./components/questionsQueue.mjs";
import { SearchQuestionsQueue } from "./components/questionsQueue.mjs";
import { SingleQuestionQueue } from "./components/questionsQueue.mjs";
import { AutoQueueInputPanel } from "./components/queueInputPanel.mjs";
import { SearchQueueInputPanel } from "./components/queueInputPanel.mjs";
import { AnswerUIPanel } from "./components/answerUiPanel.mjs";
import { findAndOverwriteElsePush } from "../../../../sharedJs/utils.mjs";



class QuestionsMode {
  mainDiv;
  answerUiPanel;
  questionsQueue;
  newAnswers = [];
  updatedAnswers = [];
  allRecentAnswers = [];

  constructor(mainDiv) {
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

  // Save answer information, update the queue if necessary.
  async answerQuestion(event) {
    const userSkipped = (event.currentTarget === this.answerUiPanel.skipBtn);
    const currQuestion = this.questionsQueue.queue.shift();
    const thisScore = (userSkipped ? null : Number(this.answerUiPanel.ratingScore.innerText));

    // Get the answer object as it should be stored in the DB.
    const answerObj = this.getAnswerObj(currQuestion, userSkipped, thisScore);

    // Update / push answer in this newAnswers.
    this.updateAnswersArray(this.newAnswers, answerObj);

    // Also do this with the allRecentAnswers array (at the moment so that 
    // subsequent searches without switching questions mode will show the 
    // correct, most recent answer).
    this.updateAnswersArray(this.allRecentAnswers, answerObj);
    this.questionsQueue.allRecentAnswers = this.allRecentAnswers;

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();    

    // Adds more questions to the questions queue if necessary.
    let queueUpdated = await this.questionsQueue.update();
    if (queueUpdated) {
      this.questionsQueue.checkForOutdatedQs();
    };
  }

  // Updates the relevant answers array for this questions mode (new / updated) 
  // with a new (or merely an updated) answer.
  updateAnswersArray(ansArrayToUpdate, answerObj) {
    const matchFunc = (arrItem, newItem) => {
      return arrItem.questionId === newItem.questionId
    };
    
    findAndOverwriteElsePush(ansArrayToUpdate, answerObj, matchFunc);
  }

  // Set the allRecentAnswers for the questions queue to bear in mind whenever updating.
  setRecentAnswers(allRecentAnswers) {
    this.allRecentAnswers = allRecentAnswers;
    this.questionsQueue.allRecentAnswers = allRecentAnswers;
  }

  // Updates the questions queue and then displays the first question of it, 
  // called when switching to this questions mode.
  async updateQueueAndShowFirst() {
    // Queue will only update if it's short on answers.
    await this.questionsQueue.update();

    // Checks the queue to see if any questions in it are now outdated based on 
    // recently POSTed answers or recent answers from other questions modes that 
    // haven't yet been POSTed.
    this.questionsQueue.checkForOutdatedQs();
    
    this._showCurrQ();
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
  getAnswerObj(currQuestion, userSkipped, thisScore) {
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

  // Called when switching question mode in the questions page, since these 
  // answers are passed to the QuestionsPage and uploaded from there.
  resetAnswers() {
    this.newAnswers = [];
  }

  // Once the fetch POST of some new answers every 10 mins has been completed, 
  // clear the recently POSTed answers so that the queue has less to modify.
  clearRecentlyPostedAnswers(newAndUpdatedAnswers) {
    for (let i = 0; i < this.allRecentAnswers.length; i++) {
      const recentAnswer = this.allRecentAnswers[i];
      const found = newAndUpdatedAnswers.find(ans => {
        return ans.questionId === recentAnswer.questionId;
      });

      // Recently posted answer, remove from recent answers now that POST has 
      // completed.
      if (!found) {
        this.allRecentAnswers.splice(i, 1);
      };
    };
    this.questionsQueue.allRecentAnswers = this.allRecentAnswers;
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
  constructor(mainDiv, categoryType, category) {
    super(mainDiv);
    this.questionsQueue = new SearchQuestionsQueue(categoryType, category);
    this.queueInputPanel = new SearchQueueInputPanel(mainDiv);
  }

  // Updates the questions queue and then displays the first question of it, 
  // called when switching to this questions mode.
  async updateQueueAndShowFirst() {
    if (this.queueInputPanel.searchInput.value !== "") {
      // Queue will only update if it's short on answers.
      await this.questionsQueue.update();

      // Checks the queue to see if any questions in it are now outdated based on 
      // recently POSTed answers or recent answers from other questions modes that 
      // haven't yet been POSTed.
      this.questionsQueue.checkForOutdatedQs();
    }

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





export class SingleAnswerMode extends QuestionsMode {
  #prevAnswersList;

  constructor(mainDiv, prevAnswers, categoryType, category) {
    super(mainDiv);
    this.questionsQueue = new SingleQuestionQueue(categoryType, category);
    this.#prevAnswersList = prevAnswers;
  }

  async activate(latestNewAnswers) {


    await this.#prevAnswersList.activate(latestNewAnswers);

    // Instead of showing the answerUIpanel, set up event listeners on the re-rate buttons to show the answerUiPanel
  }

  deactivate() {
    this.#prevAnswersList.deactivate();
    // Hide the answerUiPanel if it's showing, unlink it from whatever q it's linked to.
  }
}