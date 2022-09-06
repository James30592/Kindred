import { getQCategory, getQInfo } from "../../../../../../../sharedJs/utils.mjs";
import { DomQueue } from "./components/domQueue.mjs";



export class BaseQuestionsQueue {
  _categoryTypeName;
  _categoryName;
  queue = [];
  queueType;
  _domQueue;
  _queuePrevQs = [];

  constructor(qModeMainDiv, categoryType = null, category = null) {
    this._categoryTypeName = categoryType;
    this._categoryName = category;
    this._domQueue = new DomQueue(qModeMainDiv, categoryType, category);
  }

  // Gets the text to display of the current first item in the questions queue.
  getCurrQInfo() {
    let currQText;
    let currQAns;
    let endOfQueue = false;

    // Hide question answer panel if run out of questions and display a message.
    if (this.queue.length === 0) {
      currQText = this._getEndQueueMsg();
      endOfQueue = true;
    }
    else {
      const currQ = this.queue[0];
      const [catTypeName, catName] = getQCategory(currQ, this._categoryTypeName, 
        this._categoryName);
        
      currQText = getQInfo(currQ, "qDisplayText", catTypeName, catName);
      currQAns = currQ.currAns;
    };

    return {endOfQueue, currQText, currQAns};
  }

  _getEndQueueMsg() {
    return this.endQueueMsg;
  }

  // Removes an item from the queue and the corresponding item from the DOM 
  // queue. Returns the removed queue item.
  removeQueueItem(idx, doTrans) {
    const thisQueueItem = this.queue[idx];
    this.queue.splice(idx, 1);
    this._domQueue.removeQueueItem(idx, doTrans);

    return thisQueueItem;
  }

  // Adds array of questions to queue and adds corresponding new elements to 
  // DOM queue too.
  _addToQueue(qs) {
    this.queue = this.queue.concat(qs);
    this._domQueue.addToQueue(qs);
  }

  // Clears the DOM items queue.
  _resetQueue() {
    this.queue = [];
    this._domQueue.resetQueue();
    this._queuePrevQs = [];
  }

  savePrevQ(qId) {
    this._queuePrevQs.push(qId);
  }
}