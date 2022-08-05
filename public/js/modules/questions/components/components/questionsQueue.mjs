// For retreiving new questions from server.
class QuestionsQueue {
  static #QUEUE_DESIRED_SIZE = 40;
  _QUEUE_REFRESH_THRESHOLD = 20;
  #categoryTypeName;
  #categoryName;
  queue = [];
  #filters;
  _endOfQSource = false;
  _currentlyUpdating = false;
  endQueueMsg;
  queueType; 
  allRecentAnswers = [];
  inputPanel;

  constructor(categoryType, category) {
    this.#categoryTypeName = categoryType;
    this.#categoryName = category;
  }

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

  // 
  setRecentAnswers(notYetPostedAnswers, postedNotYetSavedAnswers) {
    
  }

  // Checks if the queue needs and can be updated.
  checkQueueToBeUpdated() {
    const queueNeedsExtending = this.queue.length <= this._QUEUE_REFRESH_THRESHOLD;
    const moreQsInSource = !this._endOfQSource;

    const queueToBeUpdated = queueNeedsExtending && moreQsInSource;
    return queueToBeUpdated;
  }

  // Checks each question in the queue to see if it has recently been answered 
  // (and therefore should no longer be in the queue, or should be there with a 
  // newer answer value) and handles this.
  checkForOutdatedQs() {
    for (let ans of this.allRecentAnswers) {
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

  // Gets the text to display of the current first item in the questions queue.
  getCurrQInfo() {
    let currQText;
    let currQAns;
    let endOfQueue = false;

    // Hide question answer panel if run out of questions and display a message.
    if (this.queue.length === 0) {
      currQText = this.endQueueMsg;
      endOfQueue = true;
    }
    else {
      currQText = QuestionsQueue.#getQuestionText(this.#categoryTypeName, 
        this.#categoryName, this.queue[0]);
      
      currQAns = this.queue[0].currAns;
    };

    return {endOfQueue, currQText, currQAns};
  }

  // Gets more items to the questions queue, when it's running low.
  async #postNewQsRequest(numQuestions, currQueueIds, startApiPage) {
    this._currentlyUpdating = true;
    
    const postObj = this._getPostObj(numQuestions, currQueueIds, startApiPage);

    const fetchResponse = await fetch(`/questions/${this.#categoryTypeName}/${this.#categoryName}`, {
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

  // Get the string to show as the question text, depending on the category.
  static #getQuestionText(catTypeName, catName, currQuestion) {
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
  




export class AutoQuestionsQueue extends QuestionsQueue {
  endQueueMsg = "You have answered all questions in this category! Use Search to answer more!";
  queueType = "auto";

  // Adds in data on whether previously answered questions should be included.
  _getPostObj(numQuestions, currQueueIds, startApiPage) {
    const postObj = super._getPostObj(numQuestions, currQueueIds, 
      startApiPage);

    postObj.data.includeAnsweredQs = this.inputPanel.includeAlreadyAnsweredCheckbox.checked;
    return postObj;
  }
}





export class SearchQuestionsQueue extends QuestionsQueue {
  endQueueMsg = "You have answered all questions for this search query, try another!";
  queueType = "search";
  searchQuery = "";

  // Checks if the queue needs and can be extended.
  checkQueueToBeUpdated() {
    const canBeUpdated = super.checkQueueToBeUpdated();
    const isValidSearch = this.searchQuery !== "";
    return canBeUpdated && isValidSearch;
  }

  // Resets this search queue and then sets the search query. Returns whether 
  // search query has changed or not.
  newSearch() {
    this.reset();
    const prevSearchTerm = this.searchQuery;
    this.searchQuery = encodeURI(this.inputPanel.searchInput.value);
    return this.searchQuery !== prevSearchTerm;
  }

  // Search queue version of the making the post object for updating the queue, 
  // also includes the search query and whether previously answered questions 
  // should be included.
  _getPostObj(numQuestions, currQueueIds, startApiPage) {
    const postObj = super._getPostObj(numQuestions, currQueueIds, 
      startApiPage);

    postObj.data.searchQuery = this.searchQuery;
    postObj.data.includeAnsweredQs = this.inputPanel.includeAlreadyAnsweredCheckbox.checked;
    return postObj;
  }
}





export class SingleQuestionQueue extends QuestionsQueue {

}