import { DBCategoryQuestionOrAnswersList } from "../categoryQuestionOrAnswersList.mjs";
import { CategoryQuestionsList } from "../../../../models/categoryQuestionsList.mjs";



// For searching for single categoryAnswersList.
export class DBCategoryQuestionsList extends DBCategoryQuestionOrAnswersList {
  // Queries the CategoryQuestionsList collection.
  async init(categoryTypeName, categoryName) {
    const findCriteria = DBCategoryQuestionsList._buildQuery(
      categoryTypeName, categoryName);

    this.item = await CategoryQuestionsList.findOne(
      findCriteria).exec();
  }
}