import { findAndOverwriteElsePush } from "../../../sharedJs/utils.mjs";



class QuestionsPage {
  questionsModes;
  currQuestionMode;
  categoryTypeName;
  categoryName;
  // New answers that have not yet been POSTed to server.
  notYetPostedAnswers = [];
  // The not yet POSTed answers plus any answers that are POSTed but the save 
  // on back end hasn't completed yet.
  allRecentAnswers = [];
  static #submitAnswersInterval = 60000; // 10 mins

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
    window.addEventListener("beforeunload", () => {
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
    this._updateAnsArrayWithAns(this.notYetPostedAnswers, answerObj);
    this._updateAnsArrayWithAns(this.allRecentAnswers, answerObj);
    this._setRecentAnswers();
  }

  // Remove current question mode: hide it, get the latest answers and post 
  // them to the server.
  removeQmode() {
    this.currQuestionMode.deactivate();
  }

  // Set the new questions mode and show it.
  async setQMode(newQMode) {
    this.currQuestionMode = newQMode;
    this.currQuestionMode.activate();

    this._setRecentAnswers();

    // Update the queue for the questions mode and show first item in the queue.
    await this.currQuestionMode.updateQueueAndShowFirst();
  }

  _setRecentAnswers() {
    this.currQuestionMode.setRecentAnswers(this.allRecentAnswers);
  }

  // Updates an origAnsArray with a new answer, overwriting where 
  // present in the origAnsArray (otherwise adding).
  _updateAnsArrayWithAns(origAnsArray, newAns) {
    const matchFunc = (arrItem, newItem) => {
      return arrItem.questionId === newItem.questionId
    };

    findAndOverwriteElsePush(origAnsArray, newAns, matchFunc);
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
  // update the allRecentAnswers so that the queue has less to modify.
  clearRecentlyPostedAnswers(successPostedAnswers) {
    // Remove each successfully POSTed answer from this allRecentAnswers.
    for (let successPostedAnswer of successPostedAnswers) {
      const findIndex = getFindIndex(successPostedAnswer, this.allRecentAnswers);
      if (findIndex > -1) {
        this.allRecentAnswers.splice(findIndex, 1);
      };
    };
    
    // Finds this exact answer in the allRecentAnswers (same 
    // questionId may appear more than once so only find exact match with 
    // answer / skip value too).
    function getFindIndex(successPostedAnswer, updateAnswersArray) {
      const findIndex = updateAnswersArray.findIndex(ans => {
        let isMatch = true;
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
  // Just the session answers since last time was on the prev answers mode.
  #latestSessionAnswers = [];

  constructor(qModes, categoryTypeName, categoryName) {
    super(qModes, categoryTypeName, categoryName);
  }

  // ------------------------------------------REMOVE---------------------------------------------------------------------------
  // // Updates the session answers (if not in the prev answers mode currently 
  // // because in this case it updates the prev answers list immediately).
  // _handleNewAnswer(answerObj) {
  //   if (this.currQuestionMode?.name !== "prevAns") {
  //     this._updateAnsArrayWithAns(this.#latestSessionAnswers, answerObj);
  //   };
  //   super._handleNewAnswer(answerObj);
  // }

  _setRecentAnswers() {
    // If currently in the previous answers mode, reset the latestSessionAnswers 
    // immediately after setting it as it will be reflected in the prev answers 
    // list straight away.
    if (this.currQuestionMode?.name === "prevAns") {
      this.currQuestionMode.setRecentAnswers(this.#latestSessionAnswers);
      this.#latestSessionAnswers = [];
    }
    else {
      this.currQuestionMode.setRecentAnswers(this.allRecentAnswers);
    };
  }

  // Set the new questions mode and show it.
  async setQMode(newQMode) {
    this.currQuestionMode = newQMode;
    this.currQuestionMode.activate();

    this._setRecentAnswers();
  }
}