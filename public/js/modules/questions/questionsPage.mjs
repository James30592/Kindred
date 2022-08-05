import { findAndOverwriteElsePush } from "../../../sharedJs/utils.mjs";



class QuestionsPage {
  questionsModes;
  currQuestionMode;
  categoryTypeName;
  categoryName;
  // New answers that have not yet been POSTed to server.
  notYetPostedAnswers = [];
  // Most recently POSTed answers, have not yet received response to say they 
  // have been saved to DB.
  postedNotYetSavedAnswers = [];
  // Combination of the above two arrays.
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
      this._postAnswers(true);
    });

    // Submit answers every 10 mins, if there are any.
    setInterval(() => {
      this._postAnswers(false);
    }, QuestionsPage.#submitAnswersInterval);

    // Listen for events emitted by any q mode when a question is answered.
    for (let qMode of this.questionsModes) {
      qMode.addEventListener("answeredQ", evt => {
        const answerObj = evt.detail.answerObj;
        this._handleNewAnswer(answerObj);
      });
    };
  }

  // Saves (or overwrites) new answer to notYetPosted and allRecentAnswers and 
  // then sends the updated recent answers array to the current questions mode.
  _handleNewAnswer(answerObj) {
    this._updateAnsArrayWithArray(this.notYetPostedAnswers, [answerObj]);
    this._updateAnsArrayWithArray(this.allRecentAnswers, [answerObj]);
    this._setQModeRecentAnswers();
  }

  // Sends the latest not yet POSTed and most recently POSTed answers to the 
  // current question mode.
  _setQModeRecentAnswers() {
    this.currQuestionMode.setRecentAnswers(this.notYetPostedAnswers, 
      this.postedNotYetSavedAnswers);
  }

  // Remove current question mode: hide it, get the latest answers and post 
  // them to the server.
  removeQmode() {
    this.currQuestionMode.deactivate();
  }

  // Set the new questions mode and show it.
  async setQMode(newQMode) {
    // Get all recently done answers, including those sent in the most recent POST.
    this.getAllRecentAnswers();

    this.currQuestionMode = newQMode;
    this._activateNewQMode();

    this.currQuestionMode.setAllRecentAnswers(this.allRecentAnswers);

    // Update the queue for the questions mode and show the first item in the 
    // queue.
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
    const allRecentAnswers = this.postedNotYetSavedAnswers.slice();
    this._updateAnsArrayWithArray(allRecentAnswers, this.notYetPostedAnswers);

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
    this.notYetPostedAnswers = [];
  }

  // Once the fetch POST of some new answers every 10 mins has been completed, 
  // update the recently POSTed answers so that the queue has less to modify.
  clearRecentlyPostedAnswers(successPostedAnswers) {
    // Remove each successfully POSTed answer from this postedNotYetSavedAnswers.
    for (let successPostedAnswer of successPostedAnswers) {
      const findIndex = getFindIndex(successPostedAnswer, this.postedNotYetSavedAnswers);
      this.postedNotYetSavedAnswers.splice(findIndex, 1);
    };
    
    // Finds this exact answer in the postedNotYetSavedAnswers (same 
    // questionId may appear more than once so only find exact match with 
    // answer / skip value too).
    const getFindIndex = (successPostedAnswer, postedNotYetSavedAnswers) => {
      const findIndex = postedNotYetSavedAnswers.findIndex(ans => {
        const isMatch = true;
        const propsToCheck = ["questionId", "skip", "answerVal"];

        for (let prop in ans) {
          const skipProp = !propsToCheck.includes(prop);
          if (skipProp) continue;

          isMatch = ans[prop] === successPostedAnswer[prop];
          if (!isMatch) break;
        };

        return isMatch;
      });

      return findIndex;
    };
  }

  // POST these answers info to the server.
  async _postAnswers(isChangeOfPage = false) {
    const answersToPost = this.notYetPostedAnswers.slice();

    // Add the new answers to the postedNotYetSavedAnswers (until the fetch 
    // response that they were saved in DB is returned).
    this.postedNotYetSavedAnswers = this.postedNotYetSavedAnswers.concat(
      ...answersToPost);

    // Check if there are any answers to upload.
    const noNewAnswers = answersToPost.length === 0;
    if (noNewAnswers) return;

    const postRoute = `/questions/${this.categoryTypeName}/${this.categoryName}`;

    const postObj = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        type: "answers", 
        data: answersToPost
      })
    };
    
    // If moving off the page, keep fetch request alive.
    if (isChangeOfPage) {
      postObj.keepalive = true;
    };
    
    this.resetAnswers();
    await fetch(postRoute, postObj);

    this.clearRecentlyPostedAnswers(answersToPost);
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
    if (Object.hasOwn(this.currQuestionMode, "#prevAnswersList")) {
      await this.currQuestionMode.activate(this.#latestNewAnswers);
      this.#latestNewAnswers = [];
    }
    else {
      this.currQuestionMode.activate();
    };
  }
}