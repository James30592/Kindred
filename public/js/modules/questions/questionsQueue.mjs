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
  inclPrevAnswers;  

  constructor(categoryType, category) {
    this.#categoryTypeName = categoryType;
    this.#categoryName = category;
  }

  // Add items to the questions queue if it's running low and there are 
  // unanswered questions remaining in the source. isNewQueue is boolean for if 
  // queue is merely appended too or built from scratch.
  async update(isNewQueue) {
    // If already waiting for fetch on a previous update call, don't update.
    if (this._currentlyUpdating) return;

    const queueNeedsExtending = this.queue.length <= QuestionsQueue.#QUEUE_REFRESH_THRESHOLD;
    const moreQsInSource = !this._endOfQSource;

    if (queueNeedsExtending && moreQsInSource) {
        // Queue needs to and can be extended.
        const numNewQs = QuestionsQueue.#QUEUE_DESIRED_SIZE - this.queue.length;
        const currQueueIds = this.queue.map(q => q._id);
        const maxQueueApiPage = this.queue.at(-1)?.apiPageNum;

        // Post request to server for new questions for the queue.
        const newQuestionsObj = await this.#postNewQsRequest(numNewQs, 
            currQueueIds, maxQueueApiPage, isNewQueue);

        this._endOfQSource = newQuestionsObj.endOfQSource;
        this.queue = this.queue.concat(newQuestionsObj.results);
    };
  }

  // Gets the text to display of the current first item in the questions queue.
  getCurrQInfo(includeAlreadyAnswered) {
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
      
      if (includeAlreadyAnswered) {
        currQAns = this.queue[0].currAns;
      };
    };

    return {endOfQueue, currQText, currQAns};
  }

  // Gets more items to the questions queue, when it's running low.
  async #postNewQsRequest(numQuestions, currQueueIds, maxQueueApiPage, isNewQueue) {
    this._currentlyUpdating = true;
    
    const postObj = this._getPostObj(numQuestions, currQueueIds, maxQueueApiPage, 
      isNewQueue);

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
  _getPostObj(numQuestions, currQueueIds, maxQueueApiPage, isNewQueue) {
    return {
      type: "updateQueue",
      data: {
        queueType: this.queueType,
        numQs: numQuestions,
        isNewQueue: isNewQueue,
        currQueueIds: currQueueIds,
        maxQueueApiPage: maxQueueApiPage,
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
  inclPrevAnswers = false;
}




export class SearchQuestionsQueue extends QuestionsQueue {
  endQueueMsg = "You have answered all questions for this search query, try another!";
  queueType = "search";
  searchQuery = "";

  // Resets this search queue and then sets the search query.
  newSearch(searchTerm, inclPrevAnswers) {
    this.#reset();
    this.searchQuery = encodeURI(searchTerm);
    this.inclPrevAnswers = inclPrevAnswers;
  }

  // Resets the search queue, ready for a new search query and update call.
  #reset() {
    this.queue = [];
    this._endOfQSource = false;
    this._currentlyUpdating = false;
  }

  // Search queue version of the making the post object for updating the queue, 
  // also includes the search query.
  _getPostObj(numQuestions, currQueueIds, maxQueueApiPage, isNewQueue) {
    const postObj = super._getPostObj(numQuestions, currQueueIds, 
      maxQueueApiPage, isNewQueue);

    postObj.data.searchQuery = this.searchQuery;
    return postObj;
  }
}