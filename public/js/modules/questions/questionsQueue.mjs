// For retreiving new questions from server.
export class QuestionsQueue {
    static #QUEUE_DESIRED_SIZE = 40;
    static #QUEUE_REFRESH_THRESHOLD = 20;
    #categoryTypeName;
    #categoryName;
    queue = [];
    #filters;
    #endOfQSource = false;
    #currentlyUpdating = false;
  
    constructor(categoryType, category) {
      this.#categoryTypeName = categoryType;
      this.#categoryName = category;
    }
  
    // Add items to the questions queue if it's running low and there are 
    // unanswered questions remaining in the source. isNewQueue is boolean for if 
    // queue is merely appended too or built from scratch.
    async update(isNewQueue) {
        // If already waiting for fetch on a previous update call, don't update.
        if (this.#currentlyUpdating) return;
    
        const queueNeedsExtending = this.queue.length <= QuestionsQueue.#QUEUE_REFRESH_THRESHOLD;
        const moreQsInSource = !this.#endOfQSource;

        if (queueNeedsExtending && moreQsInSource) {
            // Queue needs to and can be extended.
            const numNewQs = QuestionsQueue.#QUEUE_DESIRED_SIZE - this.queue.length;
            const currQueueIds = this.queue.map(q => q._id);
            const maxQueueApiPage = this.queue.at(-1)?.apiPageNum;

            // Post request to server for new questions for the queue.
            const newQuestionsObj = await this.#postNewQsRequest(numNewQs, 
                currQueueIds, maxQueueApiPage, isNewQueue);

            this.#endOfQSource = newQuestionsObj.endOfQSource;
            this.queue = this.queue.concat(newQuestionsObj.results);
        };
    }
  
    // Gets the text to display of the current first item in the questions queue.
    getCurrQText() {
      let currQText;
      let endOfQueue = false;
  
      // Hide question answer panel if run out of questions and display a message.
      if (this.queue.length === 0) {
        currQText = "You have answered all questions in this category!";
        endOfQueue = true;
      }
      else {
        currQText = QuestionsQueue.#getQuestionText(this.#categoryTypeName, 
          this.#categoryName, this.queue[0]);
      };
  
      return {endOfQueue, currQText};
    }
  
    // Gets more items to the questions queue, when it's running low.
    async #postNewQsRequest(numQuestions, currQueueIds, maxQueueApiPage, isNewQueue) {
        this.#currentlyUpdating = true;

        const filterInfo = {
        // fromDate: fromDateInput?.value,
        // toDate: toDateInput?.value
        // genres
        // people
        };
        
        const postObj = {
        type: "updateQueue",
        data: {
            numQs: numQuestions,
            isNewQueue: isNewQueue,
            currQueueIds: currQueueIds,
            maxQueueApiPage: maxQueueApiPage,
            filters: filterInfo
        }
        };

        const fetchResponse = await fetch(`/questions/${this.#categoryTypeName}/${this.#categoryName}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(postObj)
        });

        const newQuestions = await fetchResponse.json();

        this.#currentlyUpdating = false;

        return newQuestions;
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