import { NewAPIQuestions } from "./newAPIQuestions.mjs";
import * as dbHelpers from "../../dbHelpers.mjs";
import { dbAutoModeMixin } from "./mixins/dbAutoModeMixin.mjs";



// Uses DB for the auto queue mode and API for the other q modes.
export class NewAPIwDBQuestions extends NewAPIQuestions {
  _categoryQsList;
  _idField = "_id";

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this._categoryQsList = new dbHelpers.CategoryQuestionsList();
  }

  // Get questions for the auto queue mode.
  async _getAutoQuestions() {
    await this.getDBAutoQuestions();
  }
}

Object.assign(NewAPIwDBQuestions.prototype, dbAutoModeMixin);