// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, generic - from either API or DB.
export class NewQuestions {
  _categoryTypeName;
  _categoryName;
  results = [];
  endOfQSource = false;
  _numQs;
  _filters;
  _userAnswers;
  #userAnsweredQIds;
  #currQueueIds;
  #allUserAnsIds;
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
    // All unique ids of question user has currently answered, both in the db 
    // and stored on front end currently.
    this.#allUserAnsIds = [...new Set(this.#userAnsweredQIds.concat(
      queueReqInfo.recentAnswerQIds))];
    this._qMode = queueReqInfo.queueType;
    this._excludeAnsweredQs = !queueReqInfo.includeAnsweredQs;
    
    if (this._qMode === "search") {
      this._searchQuery = queueReqInfo.searchQuery;
    };
  }

  // Get first x questions that aren't already in the queue and haven't already 
  // been answered (if includePrevAnswers is false).
  async getQuestions() {
    switch (this._qMode) {
      case ("auto"):
        await this._getAutoQuestions();
        break;
      
      case ("search"):
        await this._getSearchQuestions();
        break;
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

  // Makes a question object out of an eligible new question, ready for adding 
  // to the results to be returned to the queue on the front end.
  _makeQObjects(eligibleNewQs) {
    const newQObjs = [];
    for (let eligibleNewQ of eligibleNewQs) {
      const newQObj = this._getNewQObj(eligibleNewQ);
      this._includeUserAnswer(newQObj);
      newQObjs.push(newQObj);
    };

    return newQObjs;
  }

  // Checks if a potential new question is eligible to be added to the queue.
  #checkIfEligible(potentialNewQ) {
      const potentialNewQId = this._getNewQId(potentialNewQ);
      const alreadyInQueue = this.#currQueueIds.includes(potentialNewQId);
      let excludeBecauseAnswered = false;

      if (this._excludeAnsweredQs) {
        excludeBecauseAnswered = this.#allUserAnsIds.includes(potentialNewQId);
      };

      const isEligibleForQueue = !alreadyInQueue && !excludeBecauseAnswered;
      return isEligibleForQueue;
  }

  // Gets the id for the potential new question.
  _getNewQId(potentialNewQ) {
    return potentialNewQ[this._idField];
  }

  // If new questions are to include those that are already answered by the 
  // user, add a property to each new question with the current user answer info.
  _includeUserAnswer(newQObj) {
    if (!this._excludeAnsweredQs) {
      newQObj.alreadyInDb = false;
      newQObj.currAns = null;
            
      const prevUserAnswer = this._userAnswers.find(ans => {
        return ans.questionId === newQObj._id
      });

      if (prevUserAnswer) {
        newQObj.alreadyInDb = true;
        newQObj.currAns = {
          skip: prevUserAnswer.skip,
          answerVal: prevUserAnswer?.answerVal
        };
      };

    };
  }
}