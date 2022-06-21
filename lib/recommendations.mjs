import * as dbHelpers from "./dbHelpers.mjs";
import * as similarity from "./similarity.mjs";
import * as utils from "./utils.mjs";
import { CategoryInfo } from "../public/sharedJs/categories.mjs";


// Recommendation for something the main user HASN'T already rated.
class Recommendation {
  constructor(catType, category, qId, simScore, ansPercentile) {
    this.categoryType = catType,
  	this.category = category,
  	this.questionId = qId,
  	this.qText = null,
  	this.rating = {
      numUsersAnswered: 1,
      // Sum of all weighted scores for all users.
      sumWeightedRatings: simScore * ansPercentile,
      // Sum of all the weights (similarity scores) for all users.
      sumWeights: simScore,
      // Weighted average ansPercentile score (weighted by similarity of users).
      strength: null
    }
  }

  updateRating(ansPercentile, userSimScore) {
      this.rating.numUsersAnswered++;
      this.rating.sumWeightedRatings += ansPercentile * userSimScore;
      this.rating.sumWeights += userSimScore;
  }

  setRatingStrength() {
    this.rating.strength = this.rating.sumWeightedRatings / this.rating.sumWeights;
  }

  setQText(text) {
    this.qText = text;
  }
}


// Object to generate and store a list of Recommendation objects.
export class RecommendationList extends similarity.KindredList {
  static defaultSimThreshold = 75;

  constructor(mainUser, maxListLen = null) {
    this.mainUser = mainUser;
    this.mainUserAnswers = null;
    this.relevantAnswers = new dbHelpers.RelevantAnswers();
    this.relevantUsers = [];
    this.categoryInfo = null;
    this.simRatingList = [];
    this.maxListLen = maxListLen;
  }

  constructor(mainUser, simThreshold = 75) {
    super(mainUser);
    this.simThreshold = simThreshold
    // this.recForCategoryInfo = recForCategoryInfo; ............................................................
    // Stores the kindredList of similar users to calculate the recommendations from.
    // this.kindredList = null; ...............................................................................
    // Stores the list of all the recommendation objects.
    this.recommendList = [];
    // CategoryInfo object - selected category/categories to base the recommendations
    // on (can include resultCategory(/ies) or not).
    // this.basedOnCategoryInfo = new CategoryInfo();............................................................
    // CategoryInfo object - category/categories they want recommendations for.
    this.resultCategoryInfo = new CategoryInfo();
    // Store all the relevant answers for result categories.
    this.resultRelevantAnswers = new dbHelpers.RelevantAnswers();
    // CategoryInfo object to store arrays of main user answered question Ids
    // for each category in resultCategories.
    this.userAnsweredQIds = new CategoryInfo();
  }

  // Creates a new UserSimComp object for the current compUser.
  _createSimComp(compUser) {
    const thisSimComp = new UserSimCompForRecommendations(compUser, 
      this.categoryInfo, this.relevantAnswers, this.resultCategoryInfo);

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

  // Creates a categoryInfo object to store the questions main user has answered
  // for each category in resultCategories.
  _initUserAnsweredQsInfo() {

    await this.resultRelevantAnswers.initRelevantAnswers(this.resultCategoryInfo);
    
    const args = {
      resultRelevantAnswers: this.resultRelevantAnswers, 
      mainUserId: this.mainUser._id
    };

    const getUserResultQIds = (catTypeName, categoryName, args) => {
      const resultRelevantAnswers = args.resultRelevantAnswers;
      const mainUserId = args.mainUserId;

      const userResultCatAnswers = resultRelevantAnswers.getUserAnswers(mainUserId, 
        catTypeName, categoryName).answers;
      
      const catUserQIds = [];

      for (let answeredQ of userResultCatAnswers) {
        const thisQId = answeredQ.questionId;
        catUserQIds.push(thisQId);
      };

      data = {};
    };

    this.userAnsweredQIds = this.resultCategoryInfo.cloneWithData(getUserResultQIds, args);

    



    const newCatInfo = new CategoryInfo();

    const allCategoriesWithTypes = categoryInfo.getAllCategories();

    for (let categoryWithType in allCategoriesWithTypes) {
      const catTypeName = categoryWithType.categoryType;
      const categoryName = categoryWithType.category;

      const userCatAnswers = allRelevantAnswers.getUserAnswers(mainUserId, 
        catTypeName, categoryName)

      newCatInfo.checkAndAddCategoryWithType(catTypeName, categoryName, 
        {answers: userCatAnswers})
    };
  }

  // Given a list of compUsers and a similarity percentage threshold, populates
  // this kindredlist with a KindredListForRecommendations object for all users
  // that meet the threshold.
  async initRecommendationList(basedOnCategoryInfo, resultCategoryInfo,
    simThreshold = RecommendationList.defaultSimThreshold) {

    await this.initKindredList(basedOnCategoryInfo);

    this.resultCategoryInfo.catTypes = structuredClone(resultCategoryInfo.catTypes);

    this._initUserAnsweredQsInfo();

    this.kindredList.findKindred();
  }

  getRecommendations(dbCatTypes) {
    this.kindredList.simRatingList.forEach(simComp => {

      const thisSimScore = simComp.simInfo.simScore;
      const thisPercDiff = simComp.simInfo.percDiff;
      const resultCategoriesAndTypes = this.resultCategoryInfo.getAllCategories();

      for (let categoryAndType of resultCategoriesAndTypes) {
        const category = categoryAndType.category;
        const categoryType = categoryAndType.categoryType;

        const userAnsweredQIds = this.userAnsweredQIds?.catTypes[categoryType]?.categories[category]?.answeredQIds ?? [];

        const compUserAnswers = simComp.recForCategoryInfo?.catTypes[categoryType]?.categories[category]?.userAnswers ?? [];
        
        for (let answer of compUserAnswers) {
          const questionId = answer.questionId;
          if (userAnsweredQIds.includes(questionId)) continue;

          // For all questions completed by the compUser but not by mainUser.
          const alreadyRecommended = this._checkIfAlreadyRecommended(questionId,
            categoryType, category);

          const adjustedScore = utils.clamp(answer.answerPercentile + thisPercDiff, 0, 100);

          if (alreadyRecommended) {

            alreadyRecommended.updateRating(adjustedScore, thisSimScore);
          }
          else {
            const thisRecommendation = new Recommendation(categoryType, category,
              questionId, thisSimScore, adjustedScore);
              
            this.recommendList.push(thisRecommendation);
          };

        };
      };
    });

    this._finaliseRecommendList(dbCatTypes);
  }

  // Set the strength and get the question text for each recommendation, and sort
  // the list.
  _finaliseRecommendList(dbCatTypes) {
    this.recommendList.forEach(recommendation => {
      recommendation.setRatingStrength();

      const thisQText = dbHelpers.getQuestion(dbCatTypes, recommendation.questionId,
        recommendation.categoryType, recommendation.category).text;

      recommendation.setQText(thisQText);
    });

    this._sortRecommendations();
  }

  _checkIfAlreadyRecommended(questionId, categoryType, category) {
    for (let recommendation of this.recommendList) {
      let isMatch = ((recommendation.categoryType === categoryType) &&
                    (recommendation.category === category) &&
                    (recommendation.questionId === questionId));
      if (isMatch) return recommendation;
    };
    return false;
  }

  _sortRecommendations() {
    this.recommendList.sort((rec1, rec2) => {
      return rec2.rating.strength - rec1.rating.strength;
    });
  }
}



// Similar to normal KindredList but doesn't store top x kindred only, instead
// stores list of all that meet similarity threshold value.
export class KindredListForRecommendations extends KindredList {

  constructor(mainUser, recForCategoryInfo = null, simThreshold = 75) {
    super(mainUser, null);
    this.simThreshold = simThreshold
    this.recForCategoryInfo = recForCategoryInfo;
  }

  // Creates a new UserSimComp object for the current compUser.
  _createSimComp(compUser) {
    const thisSimComp = new UserSimCompForRecommendations(compUser, 
      this.categoryInfo, this.relevantAnswers, this.recForCategoryInfo);

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