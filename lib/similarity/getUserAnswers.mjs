// This is user by higher order functions when cloning the category info object, 
// to get the main user's answers for each category.
export function getUserAnswers(catTypeName, categoryName, args) {
  const userResultCatAnswers = args.allCategoryAnswers.getAnswersList(
    args.userId, catTypeName, categoryName);

  return {categoryAnswersList: userResultCatAnswers};
};