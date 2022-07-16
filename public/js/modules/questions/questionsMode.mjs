import { AutoQuestionsQueue } from "./questionsQueue.mjs";
import { SearchQuestionsQueue } from "./questionsQueue.mjs";
import { AutoQueueInputPanel } from "./queueInputPanel.mjs";
import { SearchQueueInputPanel } from "./queueInputPanel.mjs";
import { AnswerUIPanel } from "./answerUiPanel.mjs";



class QuestionsMode {
  mainDiv;
  queueInputPanel;
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
    this.questionsQueue.inputPanel = this.queueInputPanel;

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
  answerQuestion(event) {
    const userSkipped = (event.currentTarget === this.answerUiPanel.skipBtn);
    const currQuestion = this.questionsQueue.queue.shift();
    const thisScore = (userSkipped ? null : Number(this.answerUiPanel.ratingScore.innerText));

    const answerObj = this.getAnswerObj(currQuestion, userSkipped, thisScore);

    // Check if a new answer or for a previously answered question and push to
    // relevant array.
    const ansArrayToUpdate = currQuestion.currAns ? this.updatedAnswers : this.newAnswers;
    ansArrayToUpdate.push(answerObj);

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this.showCurrQ();    

    // Adds more questions to the questions queue if necessary.
    let queueUpdated = await this.questionsQueue.update();
    if (queueUpdated) {
      this.questionsQueue.checkForOutdatedQs();
    };
  }

  setRecentAnswers(allRecentAnswers) {
    // Set the allRecentAnswers for the questions queue to bear in mind whenever updating.
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
    
    this.showCurrQ();
  }

  // Updates the displayed question in the answer UI panel with the new first 
  // queue item. 
  showCurrQ() {
    // Gets information on whether queue is now empty, or what the new current 
    // question text (and user answer, if necessary) should be.
    const newCurrQInfo = this.questionsQueue.getCurrQInfo();

    const inclAlreadyAnswered = this.queueInputPanel?.
      includeAlreadyAnsweredCheckbox.value;

    this.answerUiPanel.displayCurrQ(newCurrQInfo, inclAlreadyAnswered);
  }

  // Gets current answer to current question as an object for DB.
  getAnswerObj(currQuestion, userSkipped, thisScore) {
    const answerInfo = {
      questionId: currQuestion._id,
      skip: userSkipped
    };
  
    if (!userSkipped) {
      answerInfo.answerVal = thisScore;
      answerInfo.answerPercentile = thisScore * 10
    };

    return answerInfo;
  }

  // Called when switching question mode in the questions page, since these 
  // answers are passed to the QuestionsPage and uploaded from there.
  resetAnswers() {
    this.newAnswers = [];
    this.updatedAnswers = [];
  }

  // Once the fetch POST of some new answers every 10 mins has been completed, 
  // clear the recently POSTed answers so that the queue has less to modify.
  clearRecentlyPostedAnswers(newAndUpdatedAnswers) {
    for (let i=0; i< this.allRecentAnswers.length; i++) {
      const recentAnswer = this.allRecentAnswers[i];
      const found = newAndUpdatedAnswers.find(ans => {
        ans.questionId === recentAnswer.questionId
      });

      // Recently posted answer, remove from recent answers now that POST has 
      // completed.
      if (!found) {
        this.allRecentAnswers.splice(i, 1);
      };
    };
    this.questionsQueue.allRecentAnswers = this.allRecentAnswers;
  }
}





export class AutoMode extends QuestionsMode {
  constructor(mainDiv, categoryType, category) {
    super(mainDiv);
    this.questionsQueue = new AutoQuestionsQueue(categoryType, category);
    this.queueInputPanel = new AutoQueueInputPanel(mainDiv);
  }
}





export class SearchMode extends QuestionsMode {
  constructor(mainDiv, categoryType, category) {
    super(mainDiv);
    this.questionsQueue = new SearchQuestionsQueue(categoryType, category);
    this.queueInputPanel = new SearchQueueInputPanel(mainDiv);
  }

  // Sets up the queue input panel and answer UI panel button event listeners.
  init() {
    super.init();

    this.queueInputPanel.searchBtn.addEventListener("click", async () => {
      const currSearchTerm = this.queueInputPanel.searchInput.value;
      this.questionsQueue.newSearch(currSearchTerm);
      await this.updateQueueAndShowFirst();
    });

    this.queueInputPanel.includeAlreadyAnsweredCheckbox.addEventListener(
      "click", async () => {
      await this.updateQueueAndShowFirst();
    });
  }
}