import { REQD_NUM_ANSWERS } from "../config.mjs";



// Returns an array containing the names of all the categories for a user that
// they have completed the required number of answers for.
export function getSelectableUserCategories(categoryAnswersLists) {
  let selectableCategories = [];
  
  for (let categoryAnswers of categoryAnswersLists) {
    if (categoryAnswers.answers.length >= REQD_NUM_ANSWERS) {
      selectableCategories.push(categoryAnswers.category);
    };
  };

  return selectableCategories;
};