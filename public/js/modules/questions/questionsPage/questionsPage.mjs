import { findAndOverwriteElsePush } from "../../../../sharedJs/utils.mjs";

import { QModeWithQueueInput } from "../components/questionsMode/sub-classes/\
qModeWithQueueInput/qModeWithQueueInput.mjs";



export class QuestionsPage {
  questionsModes;
  currQuestionMode;
  categoryTypeName;
  categoryName;
  // New answers that have not yet been POSTed to server.
  notYetPostedAnswers = [];
  // The not yet POSTed answers plus any answers that are POSTed but the save 
  // on back end hasn't completed yet.
  allRecentAnswers = [];
  static #submitAnswersInterval = 600000; // 10 mins

  constructor(qModes, categoryTypeName = null, categoryName = null) {
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
    await this.currQuestionMode.activate();

    this._setRecentAnswers();

    if (this.currQuestionMode instanceof QModeWithQueueInput) {
      // Update the queue for the questions mode and show first item in the queue.
      await this.currQuestionMode.updateQueueAndShowFirst();
    };
  }

  _setRecentAnswers() {
    // Don't need to keep a list of recent answers for recommendations mode.
    if (this.currQuestionMode?.name !== "recs") {
      this.currQuestionMode.setRecentAnswers(this.allRecentAnswers);
    };
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
    // Check if there are any answers to upload.
    const noNewAnswers = this.notYetPostedAnswers.length === 0;
    if (noNewAnswers) return;

    const [postRoute, answersToPost] = this.#getPostInfo();

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

  // Gets the relevant postRoute and answersToPost format for whether uploading 
  // answers for a single category (from questions page) or for multiple 
  // categories (eg. from recommendations page).
  #getPostInfo() {
    const answersMixedCategories = !this.categoryName;

    let postRoute;
    let answersToPost;

    if (answersMixedCategories) {
      postRoute = `/questions-mixed-categories`;
      answersToPost = this.#getAnswersToPostCatInfo(this.notYetPostedAnswers);
    }
    else {
      postRoute = `/questions/${this.categoryTypeName}/${this.categoryName}`;
      answersToPost = this.notYetPostedAnswers.slice();
    };

    return [postRoute, answersToPost];
  }

  // Make a category info object with the answers for each category, for when 
  // uploading answers for multiple categories at once (eg. from recommendations page).
  #getAnswersToPostCatInfo(answersToPost) {
    const categoriesAnswers = [];

    // Populate categoriesAnswers with answers for each different category.
    for (let answer of answersToPost) {
      const foundCategoryIdx = categoriesAnswers.findIndex(list => {
        const catTypeMatch = list.catType === answer.questionDetails.categoryTypeName;
        const catMatch = list.cat === answer.questionDetails.categoryName;
        return (catTypeMatch && catMatch);
      });

      const formattedAns = formatAnswer(answer);

      if (foundCategoryIdx > -1) {
        categoriesAnswers[foundCategoryIdx].answers.push(formattedAns);
      }
      else {
        const newCategory = {
          catType: answer.questionDetails.categoryTypeName,
          cat: answer.questionDetails.categoryName,
          answers: [formattedAns]
        };

        categoriesAnswers.push(newCategory);
      };
    };

    // Remove the category and category type from the answer.
    function formatAnswer(answer) {
      delete answer.questionDetails.categoryName;
      delete answer.questionDetails.categoryTypeName;
      return answer;
    }

    return categoriesAnswers;
  }
}