import { DBCategoryQuestionOrAnswersLists } from "../categoryQuestionOrAnswersLists.mjs";
import { CategoryAnswersList } from "../../../../models/categoryAnswersList.mjs";



// Does a DB search for all relevant CategoryAnswersList documents and returns 
// them, given a CategoryInfo tree as input (ie. searches for multiple categories).
export class DBCategoryAnswersLists extends DBCategoryQuestionOrAnswersLists {

  // Queries the DB for all the relevant CategoryAnswerLists (any that match a 
  // category from categoryInfo).
  async initAnswersLists(categoryInfo, userId = null) {
    const findCriteria = DBCategoryAnswersLists._buildDBQuery(categoryInfo, userId);
    this.allItems = await CategoryAnswersList.find(findCriteria).exec();
  }

  // Builds the query to use on the relevant model.
  static _buildDBQuery(categoryInfo, userId = null) {
    const allCategoriesWithTypes = categoryInfo.getAllCategories();

    let findCriteria = {$or: []};
    let subQuery = findCriteria.$or;

    // If userId is provided then only query db for this user's answers.
    if (userId) {
      findCriteria = {
        $and: [
          {userId: userId},
          {$or: []}
        ]
      };

      subQuery = findCriteria.$and[1].$or;
    };
    
    // Build the query.
    for (let catWithType of allCategoriesWithTypes) {
      const thisCatQuery = {
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

    for (let categoryAnswers of this.allItems) {
      const thisUserId = categoryAnswers.userId;
      if (!(allUniqueIds.includes(thisUserId))) {
        allUniqueIds.push(thisUserId);
      };
    };

    return allUniqueIds;
  }

  // Gets the correct CategoryAnswersList for a given user, categoryType and category.
  getAnswersList(userId, categoryType, category) {
    for (let item of this.allItems) {
      const isCorrectItem = this._checkIfCorrectItem(item, categoryType, 
        category, userId);

      if (isCorrectItem) return item;
    };
    return null;
  }

  _checkIfCorrectItem(item, categoryType, category, userId) {
    return (item.userId.equals(userId) && 
      item.categoryType === categoryType && 
      item.category === category);
  }
}