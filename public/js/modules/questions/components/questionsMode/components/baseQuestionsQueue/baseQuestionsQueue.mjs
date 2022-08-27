import { DomQueue } from "./components/domQueue.mjs";



export class BaseQuestionsQueue {
  _categoryTypeName;
  _categoryName;
  queue = [];
  queueType;
  _domQueue;

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
      const [catTypeName, catName] = this._getQCategory(this.queue[0]);

      currQText = BaseQuestionsQueue._getQuestionText(catTypeName, catName, 
        this.queue[0]);
      
      currQAns = this.queue[0].currAns;
    };

    return {endOfQueue, currQText, currQAns};
  }

  _getEndQueueMsg() {
    return this.endQueueMsg;
  }

  // Removes an item from the queue and the corresponding item from the DOM 
  // queue. Returns the removed queue item.
  removeQueueItem(idx) {
    const thisQueueItem = this.queue[idx];
    this.queue.splice(idx, 1);
    this._domQueue.removeQueueItem(idx);

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
  }

  // If the queue has a category / category type assigned then use this,
  //  otherwise the queue contains items of various categories so check what 
  //  category the current question has.
  _getQCategory(q) {
    if (this._categoryName) {
      return [this._categoryTypeName, this._categoryName];
    }
    else {
      return [q.categoryTypeName, q.categoryName];
    };
  }

  // Get the string to show as the question text, depending on the category.
  static _getQuestionText(catTypeName, catName, currQuestion) {
    let displayText;

    switch(catTypeName, catName) {
  
      case ("Interests", "Films") :
        displayText = `${currQuestion?.title} (${currQuestion?.releaseDate})`;
        break;
  
      case ("Interests", "TV") :
        displayText = `${currQuestion?.title} (${currQuestion?.releaseDate})`;
        break;

      case ("Interests", "Music"):
        displayText = `${currQuestion?.trackName} - ${currQuestion?.artist} (${currQuestion?.album} - ${currQuestion?.releaseDate})`;
        break;
  
      case ("Interests", "Video Games"):
        displayText = `${currQuestion?.title} (${currQuestion?.releaseDate})`;
        break;
  
      case ("Interests", "Books"):
        displayText = `${currQuestion?.title} (${currQuestion?.author})`;
        break;
  
      default:
        displayText = currQuestion?.text;
    };
    
    return displayText;
  }
}