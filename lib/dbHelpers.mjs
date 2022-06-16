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
