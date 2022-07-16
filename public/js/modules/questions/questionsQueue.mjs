// For retreiving new questions from server.
class QuestionsQueue {
  static #QUEUE_DESIRED_SIZE = 40;
  static #QUEUE_REFRESH_THRESHOLD = 20;
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

    const queueNeedsExtending = this.queue.length <= QuestionsQueue.#QUEUE_REFRESH_THRESHOLD;
    const moreQsInSource = !this._endOfQSource;

    if (queueNeedsExtending && moreQsInSource) {
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

  // Checks each question in the queue to see if it has recently been answered 
  // (and therefore should no longer be in the queue, or should be there with a 
  // newer answer value) and handles this.
  checkForOutdatedQs() {
    for (let recentAnswer of this.allRecentAnswers) {
      const queueIndex = this.queue.findIndex(q => {
        q._id === recentAnswer.questionId
      });

      if (queueIndex > -1) {
        this.handleOutdatedQueueItem(queueIndex, recentAnswer);
      };
    };
  }

  // If question in the queue has been answered recently and data isn't 
  // reflected on server yet, update answer info with latest local answer info.
  handleOutdatedQueueItem(queueIndex, recentAnswer) {
    // If want to include already answered questions, then just updated the 
    // queue question currAns to the latest local answer info.
    if (this.inputPanel?.includeAlreadyAnsweredCheckbox?.value) {
      this.queue[queueIndex].currAns.skip = recentAnswer.skip;
      this.queue[queueIndex].currAns.answerVal = recentAnswer?.answerVal;
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

  // Get the string to show as the question text, depending on the category.
  static #getQuestionText(catTypeName, catName, currQuestion) {
    let displayText;
  
    switch(true) {
  
      case (catTypeName === "Interests" && 
            (catName === "Films" || catName ==="TV")) :
        displayText = `${currQuestion.title} (${currQuestion.releaseDate})`;
        break;

      case (catTypeName === "Interests" && catName === "Music"):
        displayText = `${currQuestion.trackName} (${currQuestion.album} - ${currQuestion.releaseDate})`;
        break;
  
      case (catTypeName === "Interests" && catName === "Video Games"):
        displayText = `${currQuestion.title} (${currQuestion.releaseDate})`;
        break;
  
      default:
        displayText = currQuestion.text;
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

    postObj.data.includeAnsweredQs = this.inputPanel.includeAlreadyAnsweredCheckbox.value;
    return postObj;
  }
}






export class SearchQuestionsQueue extends QuestionsQueue {
  endQueueMsg = "You have answered all questions for this search query, try another!";
  queueType = "search";
  searchQuery = "";

  // Resets this search queue and then sets the search query.
  newSearch(searchTerm) {
    this.#reset();
    this.searchQuery = encodeURI(searchTerm);
  }

  // Resets the search queue, ready for a new search query and update call.
  #reset() {
    this.queue = [];
    this._endOfQSource = false;
    this._currentlyUpdating = false;
  }

  // Search queue version of the making the post object for updating the queue, 
  // also includes the search query and whether previously answered questions 
  // should be included.
  _getPostObj(numQuestions, currQueueIds, startApiPage) {
    const postObj = super._getPostObj(numQuestions, currQueueIds, 
      startApiPage);

    postObj.data.searchQuery = this.searchQuery;
    postObj.data.includeAnsweredQs = this.inputPanel.includeAlreadyAnsweredCheckbox.value;
    return postObj;
  }
}