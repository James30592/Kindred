import * as dbHelpers from "./dbHelpers.mjs";
import * as models from "../models/models.mjs";
import { CategoryInfo } from "../public/sharedJs/categories.mjs";

const REQD_NUM_ANSWERS = 6;


// Returns an array containing the names of all the categories for a user that
// they have completed the required number of answers for.
export function getSelectableUserCategories(user) {
  let selectableCategories = [];

  for (let categoryTypeAnswers of user.categoryTypesAnswers) {
    for (let categoryAnswers of categoryTypeAnswers.categoriesAnswers) {
      if (categoryAnswers.answers.length >= REQD_NUM_ANSWERS) {
        selectableCategories.push(categoryAnswers.category);
      };
    };
  };
  return selectableCategories;
}


class SimInfo {
  constructor(simScore = null, numCommonAnswers = 0, percDiff = null) {
    // Percentage similarity difference in scores, 100% - this number to give
    // positive score, 100% means completely equal scores, 0% at opposite ends
    // of the answer scale.
    this.simScore = simScore;
    this.numCommonAnswers = numCommonAnswers;
    // Stores overall average percentile difference between main user and 
    // compUser (mainUser score - compUser score average). ie. if positive then 
    // main user has generally more positive scores.
    this.percDiff = percDiff;
  }
}


// Similarity comparison info object for one user. Extends CategoryInfo and adds
// a simInfo fields for each category type, each category, and for the overall object.
class UserSimComp extends CategoryInfo {
  constructor(user, categoryInfo = null) {
    super();
    if (categoryInfo) {
      this._initCatTypes(categoryInfo);
    };

    this.id = user._id;
    this.profileName = user.profileName;
    this.location = user.location;
    this.simInfo = new SimInfo();
  }

  // Compares answer similarity between two users and stores the results at
  // category, category type, and overall level.
  updateSimInfos(user1, user2) {
    for (let categoryTypeName in this.catTypes) {
      for (let categoryName in this.catTypes[categoryTypeName].categories) {
        const user1Answers = dbHelpers.getCategoryAnswers(user1, categoryTypeName, categoryName);
        const user2Answers = dbHelpers.getCategoryAnswers(user2, categoryTypeName, categoryName);
        const categorySimInfo = UserSimComp._compareAnswers(user1Answers, user2Answers);
        this._updateCategorySimilarity(categorySimInfo, categoryTypeName, categoryName);
      };
    };
    this._updateCatTypeAndOverallSimInfos();
  }

  _initCatTypes(categoryInfo) {
    this.catTypes = structuredClone(categoryInfo.catTypes);
    for (let catType in this.catTypes) {
      // Create new SimInfo object for each category type.
      const thisCatType = this.catTypes[catType];
      thisCatType.simInfo = new SimInfo();

      for (let category in thisCatType.categories) {

        // Create new SimInfo object for each category.
        this.catTypes[catType].categories[category] = {
          simInfo: new SimInfo()
        };
      };
    };
  }

  _addTypeAndCategory(categoryTypeName, categoryName) {
    super._addTypeAndCategory(categoryTypeName, categoryName);
    this._initSimInfo(categoryTypeName, categoryName);
  }

  _addCategory(categoryTypeName, categoryName) {
    super._addCategory(categoryTypeName, categoryName);
    this._initSimInfo(categoryTypeName, categoryName);
  }

  _initSimInfo(categoryTypeName, categoryName) {
    this.catTypes[categoryTypeName].categories[categoryName] = {
      simInfo: new SimInfo()
    };
  }

  // Calculates similarity between 2 arrays of answers for a single category from
  // 2 different users (user1 is main user, user2 is comp) and returns a SimInfo object.
  static _compareAnswers(user1Answers, user2Answers) {
    // Work off whichever user has fewer questions answered, for efficiency.
    const answersToComp = user1Answers.length < user2Answers.length ?
      [user1Answers, user2Answers, true] : [user2Answers, user1Answers, false];

    const list1Answers = answersToComp[0];
    const list2Answers = answersToComp[1];
    const isList1MainUser = answersToComp[2];

    let numSimScores = 0;
    let cumulSimScore = 0;
    let overallPercDiff = 0;

    list1Answers.forEach(function(list1Answer) {
      const list2Answer = list2Answers.find(
        answer => answer.questionId === list1Answer.questionId);

      if (list2Answer) {
        let ansSimScore = list1Answer.answerPercentile - list2Answer.answerPercentile;
        ansSimScore = isList1MainUser ? ansSimScore : -ansSimScore;
        
        numSimScores++;
        cumulSimScore += Math.abs(ansSimScore);
        overallPercDiff += ansSimScore;
      };
    });

    let avgSimScore = 100;
    let avgPercDiff = 100;

    if (numSimScores > 0) {
      avgSimScore = cumulSimScore / numSimScores;
      avgPercDiff = overallPercDiff / numSimScores;
    };

    const thisSimInfo = new SimInfo(100 - avgSimScore, numSimScores, avgPercDiff);

    return thisSimInfo;
  }

  _updateCategorySimilarity(categorySimInfo, categoryTypeName, categoryName) {
    this.catTypes[categoryTypeName].categories[categoryName].simInfo = categorySimInfo;
  }

  // Updates simInfo fields for all the catTypes and the overall this object.
  _updateCatTypeAndOverallSimInfos() {
    let [overallTotalSimScore, overallTotalPercDiff, overallCommonAnswers] = [0,0,0];

    for (let catType in this.catTypes) {
      const thisCatType = this.catTypes[catType];

      let [typeTotalSimScore, typeTotalPercDiff, typeCommonAnswers] = [0,0,0];

      for (let category in thisCatType.categories) {
        let thisSimInfo = thisCatType.categories[category].simInfo;

        typeCommonAnswers += thisSimInfo.numCommonAnswers;
        typeTotalSimScore += thisSimInfo.simScore * thisSimInfo.numCommonAnswers;
        typeTotalPercDiff += thisSimInfo.percDiff * thisSimInfo.numCommonAnswers;
      };

      overallCommonAnswers += typeCommonAnswers;
      overallTotalSimScore += typeTotalSimScore;
      overallTotalPercDiff += typeTotalPercDiff;

      this.catTypes[catType].simInfo.simScore = typeTotalSimScore / typeCommonAnswers;
      this.catTypes[catType].simInfo.percDiff = typeTotalPercDiff / typeCommonAnswers;
      this.catTypes[catType].simInfo.numCommonAnswers = typeCommonAnswers;
    };

    this.simInfo.simScore = overallTotalSimScore / overallCommonAnswers;
    this.simInfo.percDiff = overallTotalPercDiff / overallCommonAnswers;
    this.simInfo.numCommonAnswers = overallCommonAnswers;
  }
}



// Stores list of top matches for a user for specific chosen categories, list
// holds UserSimComp objects.
export class KindredList {
  static reqdNumAnswers = REQD_NUM_ANSWERS;

  constructor(categoryInfo = null, maxListLen = null){
    this.categoryInfo = structuredClone(categoryInfo);
    this.simRatingList = [];
    this.maxListLen = maxListLen;
  }

  // Given a user and comparison users to the already known categoryInfo, creates
  // an ordered list of the top x most similar users from compUsers.
  findKindred(thisUser, compUsers) {
    compUsers.forEach(compUser => {
      if (!compUser.equals(thisUser)) {
        const thisSimComp = this._createSimComp(compUser);
        thisSimComp.updateSimInfos(thisUser, compUser);

        // If overall number of common answers across all categories is at least
        // the required.
        if (thisSimComp.simInfo.numCommonAnswers >= KindredList.reqdNumAnswers) {
          this._checkAndUpdateSimRatingList(thisSimComp);
        };
      };
    });
  }

  // Creates a new UserSimComp object for the current compUser.
  _createSimComp(compUser) {
    const thisSimComp = new UserSimComp(compUser, this.categoryInfo);
    return thisSimComp;
  }

  // Updates this simRatingList if the simComp is eligible to be added to the list.
  _checkAndUpdateSimRatingList(simComp) {
    const [isNewKindred, needRemoveLastSimRating] = this._checkIfNewKindred(simComp);

    if (isNewKindred) {
      this._updateSimRatingList(simComp, needRemoveLastSimRating);
    };
  }

  // Returns if this simComp needs adding to the simRatingList and also if
  // the last element needs removing.
  _checkIfNewKindred(simComp) {
    if (this.simRatingList.length < this.maxListLen) {
      return [true, false];
    }

    else {
      const isTopKindred = KindredList._compareSimRatings(simComp,
        this.simRatingList.at(-1)) === 0;

      if (isTopKindred) {
        return [true, true];
      };
    };

    return [false, false];
  }

  // Updates a simRatingList by inserting the new simRating.
  _updateSimRatingList(simComp, needRemoveLastElem) {
    if (needRemoveLastElem) this.simRatingList.pop();
    let insertIndex = this._getSimInsertIndex(simComp);
    this.simRatingList.splice(insertIndex, 0, simComp);
  }

  // Returns index at which thisSimRating should be inserted in to simRatingList,
  // such that it is ordered from most similar to least similar.
  _getSimInsertIndex(thisSimRating){
    let i = 0;
    for (i; i < this.simRatingList.length; i++) {
      let compSimRating = this.simRatingList[i];
      if (KindredList._compareSimRatings(thisSimRating, compSimRating) === 0) {
        break;
      };
    };

    return i;
  }

  // Compares two simRatings to see which is more similar to the user. Returns 0
  // if it's simRating1, 1 if it's simRating2.
  static _compareSimRatings(simRating1, simRating2){
    const simScore1 = simRating1.simInfo.simScore;
    const commonAnswers1 = simRating1.simInfo.numCommonAnswers;
    const simScore2 = simRating2.simInfo.simScore;
    const commonAnswers2 = simRating2.simInfo.numCommonAnswers;

    let result = 0;

    if (simScore1 < simScore2) {
      result = 1;
    }
    else if (simScore1 == simScore2){
      result = commonAnswers1 <= commonAnswers2 ? 0 : 1;
    };

    return result;
  }
}


// Similar to normal KindredList but doesn't store top x kindred only, instead
// stores list of all that meet similarity threshold value.
export class KindredListForRecommendations extends KindredList {

  constructor(basedOnCategoryInfo = null, recForCategoryInfo = null, simThreshold = 75) {
    super(basedOnCategoryInfo, null);
    this.simThreshold = simThreshold
    this.recForCategoryInfo = recForCategoryInfo;
  }

  // Creates a new UserSimComp object for the current compUser.
  _createSimComp(compUser) {
    const thisSimComp = new UserSimCompForRecommendations(compUser, 
      this.categoryInfo, this.recForCategoryInfo);
    return thisSimComp;
  }

  // Updates this simRatingList if the simComp is eligible to be added to the list.
  _checkAndUpdateSimRatingList(simComp) {
    const isNewKindred = this._checkIfNewKindred(simComp);

    if (isNewKindred) {
      this._updateSimRatingList(simComp);
    };
  }

  // Returns if this simComp needs adding to the simRatingList.
  _checkIfNewKindred(simComp) {
    return simComp.simInfo.simScore >= this.simThreshold;
  }

  // Updates a simRatingList by inserting the new simRating.
  _updateSimRatingList(simComp) {
    this.simRatingList.push(simComp);
  }
}






class UserSimCompForRecommendations extends UserSimComp {
  
  constructor(user, categoryInfo = null, recForCategoryInfo = null) {
    super(user, categoryInfo);
    // Also store the recommendationsFor category info, to store the compUser's 
    // answers to these questions in order to calculate recommendations later.
    this.recForCategoryInfo = new CategoryInfo();
    this._initRecForCatInfo(user, recForCategoryInfo);
  }
  
  _initRecForCatInfo(user, recForCategoryInfo) {
    this.recForCategoryInfo.catTypes = structuredClone(recForCategoryInfo.catTypes);
    
    for (let catType in this.recForCategoryInfo.catTypes) {
      const thisCatType = this.recForCategoryInfo.catTypes[catType];
      for (let category in thisCatType.categories) {
        const userAnswers = dbHelpers.getCategoryAnswers(user, catType, category);
          
        this.recForCategoryInfo.catTypes[catType].categories[category] = {
          userAnswers: userAnswers
        };
      };
    };
  }
}