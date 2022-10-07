import { REQD_NUM_ANSWERS } from "../config.mjs";



// Returns an array containing the names of all the categories for a user that
// they have completed the required number of answers for.
export function getBasedOnUserCategories(categoryAnswersLists) {
  let selectableCategories = [];
  
  for (let categoryAnswers of categoryAnswersLists) {
    if (categoryAnswers.answers.length >= REQD_NUM_ANSWERS) {
      const numNotSkipped = categoryAnswers.answers.reduce((currTot, ans) => {
        return ans.skip ? currTot : currTot + 1;
      }, 0);

      if (numNotSkipped >= REQD_NUM_ANSWERS) {
        selectableCategories.push(categoryAnswers.category);
      };
    };
  };

  return selectableCategories;
};