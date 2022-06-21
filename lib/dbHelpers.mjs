// Finds reference to categoryAnswers in categoryTypesAnswers of DB, given user,
// categoryTypeName and categoryName. Returns null if categoryType / category not found.
export function getCategoryAnswers(user, categoryTypeName, categoryName){
  for (let categoryTypeAnswers of user.categoryTypesAnswers) {
    if (categoryTypeAnswers.categoryType === categoryTypeName){
      for (let categoryAnswers of categoryTypeAnswers.categoriesAnswers) {
        if (categoryAnswers.category === categoryName){
          return categoryAnswers.answers;
        };
      };
    };
  };
  return [];
}

// Returns reference to a particular question object in the database, given the
// databaseCatTypes object, a question ID, a category type and a category.
export function getQuestion(dbCatTypes, questionId, categoryTypeName, categoryName) {
  for (let catType of dbCatTypes) {
    if (catType.name !== categoryTypeName) continue;

    for (let category of catType.categories) {
      if (category.name !== categoryName) continue;

      for (let question of category.questions) {
        if (question._id === questionId) {
          return question;
        };
      };

    };
  };
  return null;
}


// Does a DB search for all relevant CategoryAnswerList documents and returns 
// them, given a CategoryInfo tree as input.
export class RelevantAnswers {
  constructor() {
    this.allRelAnswers = [];
  }

  // Queries the DB for all the relevant CategoryAnswerLists (any that match a 
  // category from categoryInfo).
  async initRelevantAnswers(categoryInfo, userId = null) {
    const allCategoriesWithTypes = categoryInfo.getAllCategories();
    const findCriteria = {$or: []};

    for (let catWithType of allCategoriesWithTypes) {
      thisCatQuery = {
        $and: [
          {categoryType: catWithType.categoryType},
          {category: catWithType.category}
        ]
      };

      findCriteria.$or.push(thisCatQuery);
    }

    const allRelevantAnswers = await models.CategoryAnswersList.find(findCriteria
      ).exec();

    this.allRelAnswers = allRelevantAnswers;
  }

  // Gets the correct CategoryAnswerList for a user, categoryType and category.
  getUserAnswers(userId, categoryType, category) {
    for (let relCategoryAnswers of this.allRelAnswers) {
      if (relCategoryAnswers.userId === userId && 
        relCategoryAnswers.categoryType === categoryType && 
        relCategoryAnswers.category === category) {

        return relCategoryAnswers;
      }
      return null;
    };
  }

  // Returns an array of all unique userIds for all users of these relevant answers.
  getAllUniqueUserIds() {
    let allUniqueIds = [];

    for (categoryAnswers of this.allRelAnswers) {
      const thisUserId = categoryAnswers.userId;
      if (!(allUniqueIds.includes(thisUserId))) {
        allUniqueIds.push(thisUserId);
      };
    };

    return allUniqueIds;
  }
}


