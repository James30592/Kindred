import * as dbHelpers from "./dbHelpers.mjs";
import * as similarity from "./similarity.mjs";
import * as utils from "./utils.mjs";
import { CategoryInfo } from "../public/sharedJs/categoryInfo.mjs";


// Recommendation for something the main user HASN'T already rated.
class Recommendation {
  categoryType;
  category;
  questionId;
  qText;
  rating;

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
  // Stores the list of all the recommendation objects.
  recommendList = [];
  // Minimum similarity score for a user to factor in to recommendations.
  #simThreshold;
  // CategoryInfo object - category/categories they want recommendations for.
  #resultCategoryInfo = new CategoryInfo();
  // Store all the relevant answers for result categories.
  #resultCategoryAnswers = new dbHelpers.CategoryAnswersLists();
  // CategoryInfo object to store arrays of main user answered question Ids
  // for each category in resultCategories.
  #userAnsweredQIds = new CategoryInfo();
  // Store categoryQuestionLists for all recommend for categories.
  #resultCategoryQuestions = new dbHelpers.CategoryQuestionsLists();

  constructor(mainUser, simThreshold = 75) {
    super(mainUser);
    this.#simThreshold = simThreshold;
  }

  // Creates a new UserSimComp object for the current compUser.
  _createSimComp(compUser) {
    const thisSimComp = new UserSimCompForRecommendations(compUser, 
      this.basedOnCategoryInfo, this.basedOnCategoryAnswers, this.#resultCategoryInfo, 
      this.#resultCategoryAnswers);

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
    return simComp.simInfo.simScore >= this.#simThreshold;
  }

  // Updates a simRatingList by inserting the new simRating.
  _updateSimRatingList(simComp) {
    this.simRatingList.push(simComp);
  }

  // Creates a categoryInfo object to store the questions main user has answered
  // for each category in resultCategories.
  #initUserAnsweredQsInfo() {    
    const userAnswersInfo = {
      resultCategoryAnswers: this.#resultCategoryAnswers, 
      mainUserId: this.mainUser._id
    };

    // This is a higher order function that is used when cloning the category 
    // info object, to get the question IDs for each question main user answered 
    // in each category.
    const getUserResultQIds = (catTypeName, categoryName, userAnswersInfo) => {
      const userResultCatAnswers = userAnswersInfo.resultCategoryAnswers.getAnswersList(
        userAnswersInfo.mainUserId, catTypeName, categoryName).answers;
      
      const catUserQIds = [];

      for (let answeredQ of userResultCatAnswers) {
        catUserQIds.push(answeredQ.questionId);
      };

      return {answeredQIds: catUserQIds};
    };

    this.#userAnsweredQIds = this.#resultCategoryInfo.cloneWithData(getUserResultQIds,
      userAnswersInfo);
  }

  // Given a list of compUsers and a similarity percentage threshold, populates
  // this kindredlist with a KindredListForRecommendations object for all users
  // that meet the threshold.
  async initRecommendationList(basedOnCategoryInfo, resultCategoryInfo) {

    await this.initKindredList(basedOnCategoryInfo);
      
    // Get the relevant answers lists for all users for results categories.
    this.#resultCategoryInfo.catTypes = structuredClone(resultCategoryInfo.catTypes);
    await this.#resultCategoryAnswers.initAnswersLists(this.#resultCategoryInfo);

    // Get info on which questions main user answered.
    this.#initUserAnsweredQsInfo();

    // Get all the questionsLists for recommend for categories.
    await this.#resultCategoryQuestions.initQuestionsLists(this.#resultCategoryInfo);

    this.kindredList.findKindred();
  }

  getRecommendations() {
    this.kindredList.simRatingList.forEach(simComp => {

      const thisSimScore = simComp.simInfo.simScore;
      const thisPercDiff = simComp.simInfo.percDiff;
      const resultCategoriesAndTypes = this.#resultCategoryInfo.getAllCategories();

      for (let categoryAndType of resultCategoriesAndTypes) {
        const category = categoryAndType.category;
        const categoryType = categoryAndType.categoryType;

        const userAnsweredQIds = this.#userAnsweredQIds?.catTypes[categoryType]?.categories[category]?.answeredQIds ?? [];

        const compUserAnswers = simComp.recForCategoryInfo?.catTypes[categoryType]?.categories[category]?.categoryAnswersList?.answers ?? [];
        
        for (let answer of compUserAnswers) {
          const questionId = answer.questionId;
          if (userAnsweredQIds.includes(questionId)) continue;

          // For all questions completed by the compUser but not by mainUser.
          const alreadyRecommended = this.#checkIfAlreadyRecommended(questionId,
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

    this.#finaliseRecommendList();
  }

  // Set the strength and get the question text for each recommendation, and sort
  // the list.
  #finaliseRecommendList() {
    this.recommendList.forEach(recommendation => {
      const thisQText = this.#resultCategoryQuestions.getQuestion(recommendation.categoryType, 
        recommendation.category, recommendation.questionId);

      recommendation.setQText(thisQText);
      recommendation.setRatingStrength();
    });

    this.#sortRecommendations();
  }

  #checkIfAlreadyRecommended(questionId, categoryType, category) {
    for (let recommendation of this.recommendList) {
      let isMatch = ((recommendation.categoryType === categoryType) &&
                    (recommendation.category === category) &&
                    (recommendation.questionId === questionId));
      if (isMatch) return recommendation;
    };
    return false;
  }

  #sortRecommendations() {
    this.recommendList.sort((rec1, rec2) => {
      return rec2.rating.strength - rec1.rating.strength;
    });
  }
}