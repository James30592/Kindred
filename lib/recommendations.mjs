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
export class RecommendationList {
  static defaultSimThreshold = 75;

  constructor(thisUser) {
    // Stores the kindredList of similar users to calculate the recommendations from.
    this.kindredList = null;
    this.mainUser = thisUser;
    // Stores the list of all the recommendation objects.
    this.recommendList = [];
    // CategoryInfo object - selected category/categories to base the recommendations
    // on (can include resultCategory(/ies) or not).
    this.basedOnCategoryInfo = new CategoryInfo();
    // CategoryInfo object - category/categories they want recommendations for.
    this.resultCategoryInfo = new CategoryInfo();
    // CategoryInfo object to store arrays of main user answered question Ids
    // for each category in resultCategories.
    this.userAnsweredQIds = new CategoryInfo();
  }

  // Creates and returns an object to store the questions main user has answered
  // for each category.
  _initUserAnsweredQsInfo() {
    this.mainUser.categoryTypesAnswers.forEach(categoryTypeAnswers => {
      categoryTypeAnswers.categoriesAnswers.forEach(categoryAnswers => {

        const data = {answeredQIds: []};
        categoryAnswers.answers.forEach(answer => {
          data.answeredQIds.push(answer.questionId);
        });

        this.userAnsweredQIds.checkAndAddCategoryWithType(categoryTypeAnswers.categoryType,
          categoryAnswers.category, data);
      });
    });
  }

  // Given a list of compUsers and a similarity percentage threshold, populates
  // this kindredlist with a KindredListForRecommendations object for all users
  // that meet the threshold.
  initRecommendationList(dbUsers, basedOnCategoryInfo, resultCategoryInfo,
    simThreshold = RecommendationList.defaultSimThreshold) {

    this.basedOnCategoryInfo.catTypes = structuredClone(basedOnCategoryInfo.catTypes);
    this.resultCategoryInfo.catTypes = structuredClone(resultCategoryInfo.catTypes);
    this._initUserAnsweredQsInfo();

    this.kindredList = new similarity.KindredListForRecommendations(
      this.basedOnCategoryInfo, this.resultCategoryInfo, simThreshold);

    this.kindredList.findKindred(this.mainUser, dbUsers);
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
