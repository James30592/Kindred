import { DBCategoryAnswersLists } from "../../dbHelpers/categoryQuestionOrAnswersLists/sub-classes/categoryAnswersLists.mjs";
import { KindredList } from "../kindredList/kindredList.mjs";
import { clamp } from "../../../public/sharedJs/utils.mjs";
import { CategoryInfo } from "../../../public/sharedJs/categoryInfo.mjs";
import { UserSimCompForRecommendations } from "./components/userSimCompForRecommendations.mjs";
import { Recommendation } from "./components/recommendation.mjs";



// Object to generate and store a list of Recommendation objects.
export class RecommendationList extends KindredList {
  // Stores the list of all the recommendation objects.
  recommendList = [];
  // Minimum similarity score for a user to factor in to recommendations.
  #simThreshold;
  // CategoryInfo object - category/categories they want recommendations for.
  #resultCategoryInfo = new CategoryInfo();
  // Store all the relevant answers for result categories.
  #resultCategoryAnswers = new DBCategoryAnswersLists();
  // CategoryInfo object to store arrays of main user answered question Ids
  // for each category in resultCategories.
  #userAnsweredQIds = new CategoryInfo();

  constructor(mainUser, simThreshold = 75) {
    super(mainUser);
    this.#simThreshold = simThreshold;
  }

  // Creates a new UserSimComp object for the current compUser.
  _createSimComp(compUser) {
    const thisSimComp = new UserSimCompForRecommendations(compUser, 
      this.basedOnCategoryInfo, this.basedOnCategoryAnswers.allItems, 
      this.#resultCategoryInfo, this.#resultCategoryAnswers);

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

    // For cloning the category info object, to get the question IDs for each 
    // question main user answered in each category.
    const getUserResultQIds = (catTypeName, categoryName, userAnswersInfo) => {
      const userResultCatAnswers = userAnswersInfo.resultCategoryAnswers.getAnswersList(
        userAnswersInfo.mainUserId, catTypeName, categoryName)?.answers ?? [];

      const nonSkipQs = userResultCatAnswers.filter(ans => !ans.skip);
      const nonSkipQIds = nonSkipQs.map(ans => ans.questionId);

      return {answeredQIds: nonSkipQIds};
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

    this.findKindred();
  }

  getRecommendations() {
    this.simRatingList.forEach(simComp => {

      const thisSimScore = simComp.simInfo.simScore;
      const thisPercDiff = simComp.simInfo.percDiff;
      const resultCategoriesAndTypes = this.#resultCategoryInfo.getAllCategories();

      for (let categoryAndType of resultCategoriesAndTypes) {
        const category = categoryAndType.category;
        const categoryType = categoryAndType.categoryType;

        const userAnsweredQIds = this.#userAnsweredQIds?.
          catTypes[categoryType]?.categories[category]?.answeredQIds ?? [];

        const compUserAnswers = simComp.recForCategoryInfo?.catTypes[categoryType]?.
          categories[category]?.categoryAnswersList?.answers ?? [];
        
        const nonSkipCompUserAnswers = compUserAnswers.filter(ans => !ans.skip);
        
        for (let answer of nonSkipCompUserAnswers) {
          const questionId = answer.questionId;
          if (userAnsweredQIds.includes(questionId)) continue;

          // For all questions completed by the compUser but not by mainUser.
          const alreadyRecommended = this.#checkIfAlreadyRecommended(questionId,
            categoryType, category);

          // Adjust recommendation score based on overall positivity difference 
          // in the main user's and comp user's answers.
          const adjustedScore = clamp(answer.answerPercentile + 
            thisPercDiff, 0, 100);

          if (alreadyRecommended) {
            alreadyRecommended.updateRating(adjustedScore, thisSimScore);
          }
          else {
            const thisRecommendation = new Recommendation(categoryType, category,
              questionId, answer.questionDetails, thisSimScore, adjustedScore);
              
            this.recommendList.push(thisRecommendation);
          };

        };
      };
    });

    this.#finaliseRecommendList();
  }

  // Set the strength and  for each recommendation, and sort the list.
  #finaliseRecommendList() {
    this.recommendList.forEach(recommendation => {
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