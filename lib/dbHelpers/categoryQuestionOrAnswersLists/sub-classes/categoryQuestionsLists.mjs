import { CategoryQuestionOrAnswersLists } from "../categoryQuestionOrAnswersLists.mjs";
import { CategoryQuestionsList } from "../../../../models/categoryQuestionsList.mjs";



// Does a DB search for all relevant CategoryQuestionsList documents and returns 
// them, given a CategoryInfo tree as input.
export class DBCategoryQuestionsLists extends CategoryQuestionOrAnswersLists {

  // Queries the DB for all the relevant CategoryQuestionsLists (any that match a 
  // category from categoryInfo).
  async initQuestionsLists(categoryInfo) {
    const findCriteria = DBCategoryQuestionsLists._buildDBQuery(categoryInfo, userId);
    this.allItems = await CategoryQuestionsList.find(findCriteria).exec();
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