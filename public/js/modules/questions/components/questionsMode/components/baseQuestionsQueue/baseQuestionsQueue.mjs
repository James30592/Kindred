export class BaseQuestionsQueue {
  _categoryTypeName;
  _categoryName;
  queue = [];
  queueType;

  constructor(categoryType, category) {
    this._categoryTypeName = categoryType;
    this._categoryName = category;
  }

  // Gets the text to display of the current first item in the questions queue.
  getCurrQInfo(categoryTypeName, categoryName) {
    let currQText;
    let currQAns;
    let endOfQueue = false;

    // Hide question answer panel if run out of questions and display a message.
    if (this.queue.length === 0) {
      currQText = this.endQueueMsg;
      endOfQueue = true;
    }
    else {
      currQText = BaseQuestionsQueue._getQuestionText(categoryTypeName, 
        categoryName, this.queue[0]);
      
      currQAns = this.queue[0].currAns;
    };

    return {endOfQueue, currQText, currQAns};
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