import { findAndOverwriteElsePush } from "../../../sharedJs/utils.mjs";



class QuestionsPage {
  questionsModes;
  currQuestionMode;
  categoryTypeName;
  categoryName;
  newAnswers = [];
  recentPostedAnswers = [];
  allRecentAnswers = [];
  static #submitAnswersInterval = 600000; // 10 mins

  constructor(qModes, categoryTypeName, categoryName) {
    this.questionsModes = qModes;
    this.categoryTypeName = categoryTypeName;
    this.categoryName = categoryName;
  }

  // Set up the event listeners for all buttons and protocol for uploading 
  // answers data.
  init() {
    // Set up event listeners for buttons within each questions mode.
    for (let qMode of this.questionsModes) {
      qMode.init();
    };

    // When questions page is left / tab closed, post any answers to the server.
    window.addEventListener("beforeunload", async () => {
      this._updateDBAnswers(true);
    });

    // Submit answers every 10 mins, if there are any.
    setInterval(() => {
      this._updateDBAnswers(false);
    }, QuestionsPage.#submitAnswersInterval);
  }

  _updateDBAnswers(isChangeOfPage = false) {
    this.getAndResetCurrQModeAnswers();
    this._postAnswers(isChangeOfPage);
  }

  // Gets the latest new and updated answers from the current questions mode.
  getAndResetCurrQModeAnswers() {
    this._updateAnsArrayWithArray(this.newAnswers, this.currQuestionMode.newAnswers);
    this.currQuestionMode.resetAnswers();
  }

  // Remove current question mode: hide it, get the latest answers and post 
  // them to the server.
  removeQmode() {
    this.currQuestionMode.deactivate();
    this.getAndResetCurrQModeAnswers();
  }

  // Set the new questions mode and show it.
  async setQMode(newQMode) {
    this.currQuestionMode = newQMode;
    this._activateNewQMode();

    // Get all recently done answers, including those sent in the most recent POST.
    this.getAllRecentAnswers();

    // Update the queue for the questions mode and show the first item in the 
    // queue. Pass in recently changed answers so that the queue can update 
    // considering these if necessary.
    this.currQuestionMode.setRecentAnswers(this.allRecentAnswers);
    await this.currQuestionMode.updateQueueAndShowFirst();
  }

  _activateNewQMode() {
    this.currQuestionMode.activate();
  }

  // Make an array - allRecentAnswers - that consists of the recentPostedAnswers 
  // plus any new / updated answers since then. If new / updated answers cover 
  // anything in the recentPostedAnswers then the recentPostedAnswers version is 
  // overwritten.
  getAllRecentAnswers() {
    // Duplicate of the recentPostedAnswers.
    const allRecentAnswers = this.recentPostedAnswers.slice();
    this._updateAnsArrayWithArray(allRecentAnswers, this.newAnswers);

    this.allRecentAnswers = allRecentAnswers;
  }

  // Updates an origAnsArray with answers from newAnsArray, overwriting where 
  // present in the origAnsArray (otherwise adding).
  _updateAnsArrayWithArray(origAnsArray, newAnsArray) {
    const matchFunc = (arrItem, newItem) => {
      return arrItem.questionId === newItem.questionId
    };

    for (let newAnswer of newAnsArray) {
      findAndOverwriteElsePush(origAnsArray, newAnswer, matchFunc);
    };
  }

  // Switch between question modes.
  async switchQMode(newQMode) {
    this.removeQmode();
    await this.setQMode(newQMode);
  }
  
  // Resets the new and updated answers for this questions page.
  resetAnswers() {
    this.newAnswers = [];
  }

  // Once the fetch POST of some new answers every 10 mins has been completed, 
  // clear the recently POSTed answers so that the queue has less to modify.
  clearRecentlyPostedAnswers() {
    this.currQuestionMode.clearRecentlyPostedAnswers(this.newAnswers);
    this.recentPostedAnswers = [];
  }

  // POST these answers info to the server.
  async _postAnswers(isChangeOfPage = false) {
    // Set the recently posted answers with the answers that are about to be 
    // posted (even if they are empty as it will necessarily have been a while 
    // since this was called).
    this.recentPostedAnswers = this.newAnswers.slice();

    // Check if there are any answers to upload.
    const noNewAnswers = this.newAnswers.length === 0;
    if (noNewAnswers) return;

    const postRoute = `/questions/${this.categoryTypeName}/${this.categoryName}`;

    const postObj = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "answers", 
        data: this.newAnswers
      })
    };
    
    // If moving off the page, keep fetch request alive.
    if (isChangeOfPage) {
      postObj.keepalive = true;
    };
    
    await fetch(postRoute, postObj);

    this.clearRecentlyPostedAnswers();
    this.resetAnswers();
  }
}





// Questions page that included a previous answers section for seeing previous 
// answers made by the user, for use when in questions mode proper.
export class FullQuestionsPage extends QuestionsPage {
  #latestNewAnswers = [];  // new answers since last time was on the prev answers mode.

  constructor(qModes, categoryTypeName, categoryName) {
    super(qModes, categoryTypeName, categoryName);
  }

  // Gets the latest new and updated answers from the current questions mode.
  getAndResetCurrQModeAnswers() {
    this.#latestNewAnswers.push(...this.currQuestionMode.newAnswers);
    super.getAndResetCurrQModeAnswers();
  }

  // If switching to the prev answers mode, also pass in the latest new answers.
  async _activateNewQMode() {
    if (this.currQuestionMode.hasOwn("#prevAnswersList")) {
      await this.currQuestionMode.activate(this.#latestNewAnswers);
      this.#latestNewAnswers = [];
    }
    else {
      this.currQuestionMode.activate();
    };
  }
}