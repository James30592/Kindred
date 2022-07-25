import { NewQuestions } from "../newQuestions.mjs";
import * as dbHelpers from "../../dbHelpers.mjs";
import { dbAutoModeMixin } from "./mixins/dbAutoModeMixin.mjs";



// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, from either API or DB.
export class NewDBQuestions extends NewQuestions {
  _categoryQsList;
  _idField = "_id";

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this._categoryQsList = new dbHelpers.CategoryQuestionsList();
  }

  // Get questions for the auto queue mode.
  async _getAutoQuestions() {
    await getDBAutoQuestions();
  }

  // Get questions for the search queue mode.
  async _getSearchQuestions() {
    // Fill this in once I figure out how to search through DB questions...

    // ...........................

  }

  // Creates question object, individualised for each category as necessary.
  _getNewQObj(newQ) {
    return {
      _id: newQ._id,
      text: newQ.text
    };
  }

  // Makes questions objects for each eligible question and builds this.results.
  _buildResults(eligibleNewQs) {
    for (let eligibleNewQ of eligibleNewQs) {
      const newQObj = this._getNewQObj(eligibleNewQ);
      this._includeUserAnswer(newQObj);
      this.results.push(newQObj);
    };
  }
}

Object.assign(NewDBQuestions.prototype, dbAutoModeMixin);