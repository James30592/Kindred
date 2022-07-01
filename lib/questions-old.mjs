// For retrieving and answering questions.

import * as models from "../models/models.mjs";


// To store refs to users categoryType, category and answers.
class UserCategoryAnswersInfo {
  constructor(categoryType = null, category = null, answers = null){
    this.categoryType = categoryType;
    this.category = category;
    this.answers = answers;
  }
}


// Returns object with questions information for specific category, to render
// questions page.
export async function getQuestionsRenderInfo(categoryTypeName, categoryName,
  userAnswers){

  const categoryType = await models.CategoryType.findOne({
    name: categoryTypeName}).exec();
  const category = getCategory(categoryType, categoryName);
  const categoryQuestions = category.questions;

  return {
    categoryType: categoryType,
    category: category,
    questions: categoryQuestions,
    userAnswers: userAnswers
  };
}


// Updated a user's answers with their newly answered questions (does not save here).
export function updateUserAnswers(answeredQs, userAnswers){
  // For each answered question in the page...
  for (let questionId in answeredQs) {
    const ansInfo = answeredQs[questionId].split("/");
    const newAnsId = ansInfo[0];
    const possAnswers = ansInfo[1];
    const thisAnsPercentile = newAnsId * 100 / (possAnswers - 1);

    // If user already has answer for this question then update it.
    const currUserAnsIndex = userAnswers.findIndex(
      answer => answer.questionId == questionId);

    if (currUserAnsIndex > -1) {
      userAnswers[currUserAnsIndex].answerId = newAnsId;
      userAnswers[currUserAnsIndex].answerPercentile = thisAnsPercentile;
    }
    // Otherwise add to their answers.
    else {
      const newAnswer = {
        questionId: questionId,
        answerId: newAnsId,
        answerPercentile: thisAnsPercentile
      };
      userAnswers.push(newAnswer);
    };
  };
}


// Given a categoryType DB document and a category name within it, finds the
// relevant category item within the categories array and returns this element.
function getCategory(categoryType, categoryName){
  const categories = categoryType.categories;
  for (let i = 0; i < categories.length; i++){
    const thisCategory = categories[i];
    if (thisCategory.name === categoryName){
      return categoryType.categories[i];
    };
  };
}

// Finds and returns an object with references to the user's categoryType object,
// category and answers object for this category - given the category type and
// category to look up the answers for.
export function getCategoryAnswersInfo(user, categoryTypeName, categoryName){
  let userCategoryType = null;
  let userCategory = null;
  let userAnswers = null;

  user.categoryTypesAnswers.forEach(function(categoryTypeAnswers){
    if (categoryTypeAnswers.categoryType === categoryTypeName){
      userCategoryType = categoryTypeAnswers;
      categoryTypeAnswers.categoriesAnswers.forEach(function(categoryAnswers){
        if (categoryAnswers.category === categoryName){
          userCategory = categoryAnswers;
          userAnswers = categoryAnswers.answers;
        };
      });
    };
  });

  const userCategoryAnsInfo = new UserCategoryAnswersInfo(userCategoryType,
    userCategory, userAnswers);
    
  return userCategoryAnsInfo;
}


// Creates new DB objects for user with the relevant categoryType / category if
// they do not have any already and returns an updated UserCategoryAnswersInfo object
export function initUserCategory(user, userCategoryAnswersInfo, categoryTypeName,
  categoryName){

  // New category type for the user.
  if (userCategoryAnswersInfo.categoryType === null){
    const userCategoryTypesAnswers = user.categoryTypesAnswers;
    userCategoryTypesAnswers.push({
      categoryType: categoryTypeName,
      categoriesAnswers: [{
        category: categoryName,
        answers: []
      }]
    });
    return getUpdatedUserAnsInfo(true, userCategoryTypesAnswers, userCategoryAnswersInfo);
  }

  // New category but not new category type for the user.
  else if (userCategoryAnswersInfo.category === null){
    const userCategoriesAnswers = userCategoryAnswersInfo.categoryType.categoriesAnswers;
    userCategoriesAnswers.push({
      category: categoryName,
      answers: []
    });
    return getUpdatedUserAnsInfo(false, userCategoriesAnswers, userCategoryAnswersInfo);
  }

  // Neither category type nor category needs creating for the user.
  else return userCategoryAnswersInfo;
}


// Returns UserCategoryAnswersInfo object for new category / category Type that
// was just created for the user in case that they had no answers for this category type previously.
// includesCatType argument is true if category type was also just created for
// the user, false if only category and answers were initialised.
function getUpdatedUserAnsInfo(includesCatType, array, userCategoryAnswersInfo){
  const userCategoryAnsInfo = new UserCategoryAnswersInfo();

  if (includesCatType) {
    userCategoryAnsInfo.categoryType = array[array.length - 1];
    userCategoryAnsInfo.category = userCategoryAnsInfo.categoryType.categoriesAnswers[0];
  }

  else {
    userCategoryAnsInfo.categoryType = userCategoryAnswersInfo.categoryType;
    userCategoryAnsInfo.category = array[array.length - 1];
  }

  userCategoryAnsInfo.answers = userCategoryAnsInfo.category.answers;

  return userCategoryAnsInfo;
}
