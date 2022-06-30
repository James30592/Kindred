import * as models from "../models/models.mjs";



// Generic base class helper for running a query on either the 
// CategoryQuestionsList or CategoryAnswersList DB models, difference with below 
// classes is this is for searching for a single questions / answers list.
class CategoryQuestionOrAnswersList {
  item;

  // A query to be used when searching for a single category.
  static _buildQuery(categoryTypeName, categoryName) {
    let findCriteria = {
      $and: [
        {categoryType: categoryTypeName},
        {category: categoryName}
      ]
    };

    return findCriteria;
  }
}


// For searching for single categoryAnswersList.
export class CategoryAnswersList extends CategoryQuestionOrAnswersList {
  static #dbCollection = models.CategoryAnswersList;

  // Queries the CategoryAnswersList collection.
  async init(categoryTypeName, categoryName, userId) {
    const findCriteria = CategoryAnswersList._buildQuery(
      categoryTypeName, categoryName, userId);

    this.item = await CategoryAnswersList.#dbCollection.findOne(
      findCriteria).exec();
  }

  // Also need a user Id if searching for a specific answers list.
  static _buildQuery(categoryTypeName, categoryName, userId) {
    let findCriteria = {
      $and: [
        {userId: userId},
        {categoryType: categoryTypeName},
        {category: categoryName}
      ]
    };

    return findCriteria;
  }

  // Creates an empty answers list for a specific user, for a given user, 
  // category type and category. Assigns it to this.item.
  async createAnswersList(categoryTypeName, categoryName, userId) {
    const DBcatType = await models.CategoryType.findOne(
      {name: categoryTypeName}).exec();

    const thisCategoryAnswers = {
      userId: userId,
      categoryTypeId: DBcatType._id,
      category: categoryName,
      categoryType: categoryTypeName,
      currAPIPage: null,
      answers: []
    };

    this.item = await models.CategoryAnswersList.create(thisCategoryAnswers);
  }

  // Tries to find a category answers list for a user and if it doesn't find 
  // one, creates one.
  async initAndCreateIfNeeded(categoryTypeName, categoryName, userId) {
    await this.init(categoryTypeName, categoryName, userId);
    if (!this.item) {
        await this.createAnswersList(categoryTypeName, categoryName, userId);
    };
  }
}


// For searching for single categoryAnswersList.
export class CategoryQuestionsList extends CategoryQuestionOrAnswersList {
  static #dbCollection = models.CategoryQuestionsList;

  // Queries the CategoryQuestionsList collection.
  async init(categoryTypeName, categoryName) {
    const findCriteria = CategoryQuestionsList._buildQuery(
      categoryTypeName, categoryName);

    this.item = await models.CategoryQuestionsList.findOne(
      findCriteria).exec();

    // this.item = await CategoryQuestionsList.#dbCollection.findOne(
    //   findCriteria).exec();
  }
}




// Generic base class helper for running a query on either the 
// CategoryQuestionsList or CategoryAnswersList DB models and storing the results.
class CategoryQuestionOrAnswersLists {
  allItems = [];

  // Builds the query to use on the relevant model, takes a categoryInfo 
  // object as input.
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

  // Queries the DB for all the relevant CategoryAnswerLists (any that match a 
  // category from categoryInfo).
  async initAnswersLists(categoryInfo, userId = null) {
    const findCriteria = CategoryAnswersLists._buildDBQuery(categoryInfo, userId);
    this.allItems = await models.CategoryAnswersList.find(findCriteria).exec();
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

  // Gets the correct CategoryAnswersList for a given user, categoryType and category.
  getAnswersList(categoryType, category, userId) {
    for (let item of this.allItems) {
      const isCorrectItem = this._checkIfCorrectItem(item, categoryType, 
        category, userId);

      if (isCorrectItem) return item;
    };
    return null;
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

  // Queries the DB for all the relevant CategoryQuestionsLists (any that match a 
  // category from categoryInfo).
  async initQuestionsLists(categoryInfo) {
    const findCriteria = CategoryQuestionsLists._buildDBQuery(categoryInfo, userId);
    this.allItems = await models.CategoryQuestionsList.find(findCriteria).exec();
  }

  // Gets the correct CategoryQuestionsList for a given categoryType and category.
  getQuestionsList(categoryType, category) {
    for (let item of this.allItems) {
      const isCorrectItem = this._checkIfCorrectItem(item, categoryType, 
        category);

      if (isCorrectItem) return item;
    };
    return null;
  }

  // Returns reference to specific question in database.
  getQuestion(categoryType, category, qId) {
    const questions = this.getQuestionsList(categoryType, category).questions;
    return questions.filter(question => question._id === qId);
  }

  _checkIfCorrectItem(item, categoryType, category) {
    return (item.categoryType === categoryType && item.category === category);
  }
}



// Helper class to search for and provide methods on Users from the Users collection.
export class Users {
  allItems = [];

  // Queries the DB for all users with based on IDs in userIds input array.
  async initUsers(userIds = []) {
    const findCriteria = {$or: []};
    for (let userId of userIds) {
      findCriteria[$or].push({_id: userId});
    };
    this.allItems = await models.User.find(findCriteria).exec();
  }
}
