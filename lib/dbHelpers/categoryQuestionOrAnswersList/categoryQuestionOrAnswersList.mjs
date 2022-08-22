// Generic base class helper for running a query on either the 
// CategoryQuestionsList or CategoryAnswersList DB models, difference with below 
// classes is this is for searching for a single questions / answers list.
export class DBCategoryQuestionOrAnswersList {
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