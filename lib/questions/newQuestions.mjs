import * as dbHelpers from "../dbHelpers.mjs";
import { serverState } from '../../app.js';
import { apiRefs } from '../apiRefs.mjs';


export function createNewQuestions(catTypeName, catName, userAnswers, queueReqInfo) {
  switch (catTypeName, catName) {
    case ("Interests", "Films"):
      return new NewFilmsTVQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "TV"):
      return new NewFilmsTVQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    // case (catTypeName === "Interests" && catName === "Books"):
    //   return new NewBooksQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "Music"):
      return new NewMusicQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "Video Games"):
      return new NewVideoGamesQuestions(catTypeName, catName, userAnswers, queueReqInfo);
    
    default:
      return new NewDBQuestions(catTypeName, catName, userAnswers, queueReqInfo);
  };
}



// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, generic - from either API or DB.
class NewQuestions {
  _categoryTypeName;
  _categoryName;
  results = [];
  endOfQSource = false;
  _numQs;
  _filters;
  _userAnswers;
  #userAnsweredQIds;
  #currQueueIds;
  _idField;
  _qMode;
  _searchQuery;
  _excludeAnsweredQs;

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    this._categoryTypeName = catTypeName;
    this._categoryName = catName;
    this._numQs = queueReqInfo.numQs;
    this._filters = queueReqInfo.filters;
    this._userAnswers = userAnswers;
    this.#userAnsweredQIds = userAnswers.map(ans => ans.questionId);
    this.#currQueueIds = queueReqInfo.currQueueIds;
    this._qMode = queueReqInfo.queueType;
    this._excludeAnsweredQs = !queueReqInfo.includeAnsweredQs;
    
    if (this._qMode === "search") {
      this._searchQuery = queueReqInfo.searchQuery;
    };
  }

  // Tests an array of potential new questions to see if not already answered by 
  // the user or in the queue.
  _getEligibleNewQs(potentialNewQs) {
    const eligibleNewQs = [];
    
    for (let i = 0; i < potentialNewQs.length; i++) {
      const potentialNewQ = potentialNewQs[i];

      // Have got enough new questions for the queue already.
      const totalNumToAdd = this.results.length + eligibleNewQs.length;
      if (totalNumToAdd >= this._numQs) {
        break;
      };

      const isEligibleForQueue = this.#checkIfEligible(potentialNewQ);

      if (isEligibleForQueue) {
        eligibleNewQs.push(potentialNewQ);
        // Mark as exhausted question list, will be overriden later for API case.
        if (i === potentialNewQs.length - 1) {
          this.endOfQSource = true;
        };
      };
    };

    return eligibleNewQs;
  }

  // Checks if a potential new question is eligible to be added to the queue.
  #checkIfEligible(potentialNewQ) {
      const potentialNewQId = potentialNewQ[this._idField];
      const alreadyInQueue = this.#currQueueIds.includes(potentialNewQId);
      let excludeBecauseAnswered = false;

      if (this._excludeAnsweredQs) {
        excludeBecauseAnswered = this.#userAnsweredQIds.includes(potentialNewQId);
      };

      const isEligibleForQueue = !alreadyInQueue && !excludeBecauseAnswered;
      return isEligibleForQueue;
  }

  // If new questions are to include those that are already answered by the 
  // user, add a property to each new question with the current user answer info.
  _includeUserAnswer(newQObj) {
    if (!this._excludeAnsweredQs) {
      newQObj.alreadyInDb = false;
      newQObj.currAns = null;
      
      for (let userAnswer of this._userAnswers) {
        if (newQObj._id === userAnswer.questionId) {
          newQObj.alreadyInDb = true;

          newQObj.currAns = {
            skip: userAnswer.skip,
            answerVal: userAnswer?.answerVal
          };
        };
      };
    };
  }
}




// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, from either API or DB.
class NewDBQuestions extends NewQuestions {
  #categoryQsList;
  _idField = "_id";

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this.#categoryQsList = new dbHelpers.CategoryQuestionsList();
  }

  // Query DB and get first numQs number of questions that are unanswered and 
  // not already in the queue.
  async getQuestions() {
    await this.#categoryQsList.init(this._categoryTypeName, this._categoryName);

    // Test new questions from source to see if new and add to results.
    const eligibleNewQs = this._getEligibleNewQs(this.#categoryQsList.item.questions);

    this.#buildResults(eligibleNewQs);

    return this.results;
  }

  // Creates question object, individualised for each category as necessary.
  _getNewQObj(newQ) {
    return {
      _id: newQ._id,
      text: newQ.text
    };
  }

  // Makes questions objects for each eligible question and builds this.results.
  #buildResults(eligibleNewQs) {
    for (let eligibleNewQ of eligibleNewQs) {
      const newQObj = this._getNewQObj(eligibleNewQ);
      this._includeUserAnswer(newQObj);
      this.results.push(newQObj);
    };
  }
}