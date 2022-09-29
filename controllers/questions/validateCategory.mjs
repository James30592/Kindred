// Checks if a category and category type is present in the database (currently 
// used for validating route parameters for questions page).
export function validateCategory(categoryName, categoryTypeName, serverState) {

  const isValid = serverState.allCategories.some(catType => {
    if (catType.name !== categoryTypeName) {
      return false;
    }
    else {
      const catMatch = catType.categories.some(cat => cat.name === categoryName);
      return catMatch;
    };
  });

  return isValid;
}