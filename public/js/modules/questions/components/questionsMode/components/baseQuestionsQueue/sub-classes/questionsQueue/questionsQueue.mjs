import { BaseQuestionsQueue } from "../../baseQuestionsQueue.mjs";



// For retreiving new questions from server.
export class QuestionsQueue extends BaseQuestionsQueue {
  static #QUEUE_DESIRED_SIZE = 40;
  _QUEUE_REFRESH_THRESHOLD = 20;
  #filters;
  _endOfQSource = false;
  _currentlyUpdating = false;
  endQueueMsg;
  inputPanel;
  allRecentAnswers = [];

  // Add items to the questions queue if it's running low and there are 
  // unanswered questions remaining in the source. isNewQueue is boolean for 
  // whether queue should be started from scratch, used when the queue input 
  // criteria have changed eg. new search term.
  async update(isNewQueue = false) {
    let updated = false;

    // If already waiting for fetch on a previous update call, don't update.
    if (this._currentlyUpdating) return;

    const queueToBeUpdated = this.checkQueueToBeUpdated();

    if (queueToBeUpdated) {
      // Queue needs to and can be extended.
      const numNewQs = QuestionsQueue.#QUEUE_DESIRED_SIZE - this.queue.length;
      const currQueueIds = this.queue.map(q => q._id);

      let startApiPage = 1;
      if (!isNewQueue) {
        const maxQueueApiPage = this.queue.at(-1)?.apiPageNum;
        startApiPage = this.queue.length > 0 ? maxQueueApiPage : 1;
      };

      // POST request to server for new questions for the queue.
      const newQuestionsObj = await this.#postNewQsRequest(numNewQs, 
        currQueueIds, startApiPage);

      this._endOfQSource = newQuestionsObj.endOfQSource;
      this.queue = this.queue.concat(newQuestionsObj.results);
      updated = true;
    };

    return updated;
  }

  // Checks if the queue needs and can be updated.
  checkQueueToBeUpdated() {
    const queueNeedsExtending = this.queue.length <= this._QUEUE_REFRESH_THRESHOLD;
    const moreQsInSource = !this._endOfQSource;

    const queueToBeUpdated = queueNeedsExtending && moreQsInSource;
    return queueToBeUpdated;
  }

  // 
  setRecentAnswers(recallRecentAnswers) {
    this.recallRecentAnswers = recallRecentAnswers;
  }

  // Checks each question in the queue to see if it has recently been answered 
  // (and therefore should no longer be in the queue, or should be there with a 
  // newer answer value) and handles this.
  checkForOutdatedQs() {
    for (let ans of this.recallRecentAnswers) {
      const queueIndex = this.queue.findIndex(q => q._id === ans.questionId);

      if (queueIndex > -1) {
        this.handleOutdatedQueueItem(queueIndex, ans);
      };
    };
  }

  // If question in the queue has been answered recently and data isn't 
  // reflected on server yet, update answer info with latest local answer info.
  handleOutdatedQueueItem(queueIndex, recentAnswer) {
    // If want to include already answered questions, then just updated the 
    // queue question currAns to the latest local answer info.
    if (this.inputPanel?.includeAlreadyAnsweredCheckbox?.checked) {
      this.queue[queueIndex].currAns = {
        skip: recentAnswer.skip,
        answerVal: recentAnswer?.answerVal
      };
    }
    // Otherwise, remove this now answered question from the queue.
    else {
      this.queue.splice(queueIndex, 1);
    };
  }

  // Gets more items to the questions queue, when it's running low.
  async #postNewQsRequest(numQuestions, currQueueIds, startApiPage) {
    this._currentlyUpdating = true;
    
    const postObj = this._getPostObj(numQuestions, currQueueIds, startApiPage);

    const fetchResponse = await fetch(`/questions/${this._categoryTypeName}/${this._categoryName}`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(postObj)
    });

    const newQuestions = await fetchResponse.json();

    this._currentlyUpdating = false;

    return newQuestions;
  }

  // Makes the object to POST for updating the queue.
  _getPostObj(numQuestions, currQueueIds, startApiPage) {
    return {
      type: "updateQueue",
      data: {
        queueType: this.queueType,
        numQs: numQuestions,
        currQueueIds: currQueueIds,
        startApiPage: startApiPage,
        filters: {}
      }
    };
  }

  // Resets the search queue, ready for a new search query and update call or a 
  // new queue after toggling "include already answered".
  reset() {
    this.queue = [];
    this._endOfQSource = false;
    this._currentlyUpdating = false;
  }
}