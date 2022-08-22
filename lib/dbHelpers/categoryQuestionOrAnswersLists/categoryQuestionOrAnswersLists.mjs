// Generic base class helper for running a query on either the 
// CategoryQuestionsList or CategoryAnswersList DB models and storing the results.
export class DBCategoryQuestionOrAnswersLists {
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

      findCriteria.$or.push(thisCatQuery);
    };

    return findCriteria;
  }
}