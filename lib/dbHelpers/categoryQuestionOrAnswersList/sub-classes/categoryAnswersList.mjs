import { DBCategoryQuestionOrAnswersList } from "../categoryQuestionOrAnswersList.mjs";
import { CategoryType } from "../../../../models/categoryType.mjs";
import { CategoryAnswersList } from "../../../../models/categoryAnswersList.mjs"
import { findAndOverwriteElsePush } from "../../../../public/sharedJs/utils.mjs";




// For searching for single categoryAnswersList.
export class DBCategoryAnswersList extends DBCategoryQuestionOrAnswersList {
  static #dbCollection = CategoryAnswersList;

  // Queries the CategoryAnswersList collection.
  async init(categoryTypeName, categoryName, userId) {
    const findCriteria = DBCategoryAnswersList._buildQuery(
      categoryTypeName, categoryName, userId);

    this.item = await DBCategoryAnswersList.#dbCollection.findOne(
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
    const DBcatType = await CategoryType.findOne(
      {name: categoryTypeName}).exec();

    const thisCategoryAnswers = {
      userId: userId,
      categoryTypeId: DBcatType._id,
      category: categoryName,
      categoryType: categoryTypeName,
      // currAPIPage: null,
      answers: []
    };

    this.item = await CategoryAnswersList.create(thisCategoryAnswers);
  }

  // Tries to find a category answers list for a user and if it doesn't find 
  // one, creates one.
  async initAndCreateIfNeeded(categoryTypeName, categoryName, userId) {
    await this.init(categoryTypeName, categoryName, userId);
    if (!this.item) {
        await this.createAnswersList(categoryTypeName, categoryName, userId);
    };
  }

  // Adds an answer to the answers array (or updates if already present for the 
  // question ID).
  updateOrAddAnswer(newAnswer) {
    const matchFunc = (arrItem, newItem) => {
      return arrItem.questionId === newItem.questionId
    };
    
    findAndOverwriteElsePush(this.item.answers, newAnswer, matchFunc);
  }

  // Updates every answer for an array of new answers.
  updateOrAddAnswers(newAnswers) {
    for (let newAnswer of newAnswers) {
      this.updateOrAddAnswer(newAnswer);
    };
  }
}