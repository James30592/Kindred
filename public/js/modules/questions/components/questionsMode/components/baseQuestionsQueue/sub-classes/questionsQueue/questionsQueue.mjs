import { BaseQuestionsQueue } from "../../baseQuestionsQueue.mjs";



// For retreiving new questions from server.
export class QuestionsQueue extends BaseQuestionsQueue {
  static #QUEUE_REFRESH_AMOUNT = 30;
  _QUEUE_REFRESH_THRESHOLD = 10;
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
    this._updateQueuePrevQs(isNewQueue);

    let updated = false;

    // If already waiting for fetch on a previous update call, don't update.
    if (this._currentlyUpdating) return;

    const queueToBeUpdated = this.checkQueueToBeUpdated();

    if (queueToBeUpdated) {
      // Queue needs to and can be extended.
      const numNewQs = QuestionsQueue.#QUEUE_REFRESH_AMOUNT;
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

      this._addToQueue(newQuestionsObj.results);
      updated = true;
    };

    return updated;
  }

  // If a new queue (eg. changing incl. already answered tickbox or new search 
  // term) then reset this queuePrevQs.
  _updateQueuePrevQs(isNewQueue) {
    if (isNewQueue) {
      this._queuePrevQs = [];
    };
  }

  // Checks if the queue needs and can be updated.
  checkQueueToBeUpdated() {
    const queueNeedsExtending = this.queue.length <= this._QUEUE_REFRESH_THRESHOLD;
    const moreQsInSource = !this._endOfQSource;

    const queueToBeUpdated = queueNeedsExtending && moreQsInSource;
    return queueToBeUpdated;
  }

  // 
  setRecentAnswers(allRecentAnswers) {
    this.allRecentAnswers = allRecentAnswers;
  }

  // Checks each question in the queue to see if it has recently been answered 
  // (and therefore should no longer be in the queue, or should be there with a 
  // newer answer value) and handles this. answerQ is true only if this was 
  // triggered from answering a question, so in this case the transitions should be done.
  checkForOutdatedQs(answerQ = false) {
    for (let ans of this.allRecentAnswers) {
      const queueIndex = this.queue.findIndex(q => q._id === ans.questionId);

      if (queueIndex > -1) {
        this.handleOutdatedQueueItem(queueIndex, ans, answerQ);
      };
    };
  }

  // If question in the queue has been answered recently and data isn't 
  // reflected on server yet, update answer info with latest local answer info.
  handleOutdatedQueueItem(queueIndex, recentAnswer, doTrans) {
    const inclPrevAnswers = this.inputPanel?.includeAlreadyAnsweredCheckbox?.checked;
    const previouslyInThisQueue = this._queuePrevQs.includes(this.queue[queueIndex]._id);
    console.log(`Previously in this queue: ${previouslyInThisQueue}`);
    // If want to include already answered questions, then just update the 
    // queue question currAns to the latest local answer info.
    if (inclPrevAnswers && !previouslyInThisQueue) {
      this.queue[queueIndex].currAns = {
        skip: recentAnswer.skip,
        answerVal: recentAnswer?.answerVal
      };
    }
    // Otherwise, remove this now answered question from the queue.
    else {
      this.removeQueueItem(queueIndex, doTrans);
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
    this._resetQueue();
    this._endOfQSource = false;
    this._currentlyUpdating = false;
  }
}