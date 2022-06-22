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






// Generic base class helper for running a query on either the 
// CategoryQuestionsList or CategoryAnswersList DB models and storing the results.
class CategoryQuestionOrAnswersLists {
  conDBQuestionOrAnswersListsstructor() {
    this.allItems = [];
  }

  // Builds the query to use on the relevant model.
  static _buildDBQuery(categoryInfo) {
    const allCategoriesWithTypes = categoryInfo.getAllCategories();

    let findCriteria = {$or: []};
    
    // Build the query.
    for (let catWithType of allCategoriesWithTypes) {
      thisCatQuery = {
        $and: [
          {categoryType: catWithType.categoryType},
          {category: catWithType.category}
        ]
      };

      findCriteria[$or].push(thisCatQuery);
    };

    return findCriteria;
  }
}


// Does a DB search for all relevant CategoryAnswersList documents and returns 
// them, given a CategoryInfo tree as input (ie. searches for multiple categories).
export class CategoryAnswersLists extends CategoryQuestionOrAnswersLists {
  constructor() {
    super();
  }

  // Queries the DB for all the relevant CategoryAnswerLists (any that match a 
  // category from categoryInfo).
  async initRelevantAnswers(categoryInfo, userId = null) {
    const findCriteria = CategoryAnswersLists._buildQuery(categoryInfo, userId);
    this.allItems = await models.CategoryAnswersList.find(
      findCriteria).exec();
  }

  // Builds the query to use on the relevant model.
  static _buildDBQuery(categoryInfo, userId = null) {
    const allCategoriesWithTypes = categoryInfo.getAllCategories();

    let findCriteria = {$or: []};
    let subQuery = findCriteria[$or];

    // If userId is provided then only query db for this user's answers.
    if (userId) {
      findCriteria = {
        $and: [
          {userId: userId},
          {$or: []}
        ]
      };

      subQuery = findCriteria[$and][1][$or];
    };
    
    // Build the query.
    for (let catWithType of allCategoriesWithTypes) {
      thisCatQuery = {
        $and: [
          {categoryType: catWithType.categoryType},
          {category: catWithType.category}
        ]
      };

      subQuery.push(thisCatQuery);
    };

    return findCriteria;
  }

  // Returns an array of all unique userIds for all users of these category answers lists.
  getAllUniqueUserIds() {
    let allUniqueIds = [];

    for (categoryAnswers of this.allItems) {
      const thisUserId = categoryAnswers.userId;
      if (!(allUniqueIds.includes(thisUserId))) {
        allUniqueIds.push(thisUserId);
      };
    };

    return allUniqueIds;
  }

  // Gets the correct CategoryAnswersList / CategoryQuestionsList for a given 
  // user, categoryType and category.
  getUserAnswers(categoryType, category, userId) {
    return this.allItems.filter(this._checkIfCorrectItem(relCategoryAnswers, 
      categoryType, category, userId));
  }

  _checkIfCorrectItem(item, categoryType, category, userId) {
    return (item.userId === userId && 
      item.categoryType === categoryType && 
      item.category === category);
  }
}


// Does a DB search for all relevant CategoryQuestionsList documents and returns 
// them, given a CategoryInfo tree as input.
export class CategoryQuestionsLists extends CategoryQuestionOrAnswersLists {
  constructor() {
    super();
  }

  // Queries the DB for all the relevant CategoryQuestionsLists (any that match a 
  // category from categoryInfo).
  async initRelevantQuestions(categoryInfo) {
    const findCriteria = CategoryQuestionsLists._buildQuery(categoryInfo, userId);
    this.allItems = await models.CategoryAnswersList.find(
      findCriteria).exec();
  }

  // Returns reference to specific question list in the database.
  getQuestionList(categoryType, category) {
    return this.allItems.filter(this._checkIfCorrectItem(item, 
      categoryType, category));
  }

  // Returns reference to specific question in database.
  getQuestion(categoryType, category, qId) {
    const questions = this.getQuestionList(categoryType, category).questions;
    return questions.filter(question => question._id === qId);
  }

  _checkIfCorrectItem(item, categoryType, category) {
    return (item.categoryType === categoryType && item.category === category);
  }
}


// Helper class to search for and provide methods on Users from the Users collection.
export class Users {
  constructor() {
    this.allItems = [];
  }

  // Queries the DB for all users with based on IDs in userIds input array.
  async initUsers(userIds = []) {
    const findCriteria = {$or: []};
    for (let userId of userIds) {
      findCriteria[$or].push({_id: userId});
    };
    this.allItems = await models.User.find(findCriteria).exec();
  }
}
