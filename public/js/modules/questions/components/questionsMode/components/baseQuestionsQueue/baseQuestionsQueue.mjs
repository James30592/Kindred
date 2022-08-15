export class BaseQuestionsQueue {
  _categoryTypeName;
  _categoryName;
  queue = [];
  queueType;

  constructor(categoryType = null, category = null) {
    this._categoryTypeName = categoryType;
    this._categoryName = category;
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
      const [catTypeName, catName] = this._getCurrQCategory(this.queue[0]);

      currQText = BaseQuestionsQueue._getQuestionText(catTypeName, catName, 
        this.queue[0]);
      
      currQAns = this.queue[0].currAns;
    };

    return {endOfQueue, currQText, currQAns};
  }

  // If the queue has a category / category type assigned then use this,
  //  otherwise the queue contains items of various categories so check what 
  //  category the current question has.
  _getCurrQCategory(currQ) {
    if (this._categoryName) {
      return [this._categoryTypeName, this._categoryName];
    }
    else {
      console.log(currQ);
    };
  }

  // Get the string to show as the question text, depending on the category.
  static _getQuestionText(currQuestion) {
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