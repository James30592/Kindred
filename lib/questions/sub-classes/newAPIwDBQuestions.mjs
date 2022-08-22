import { NewAPIQuestions } from "./newAPIQuestions.mjs";
import { DBCategoryQuestionsList } from "../../dbHelpers/categoryQuestionOrAnswersList/sub-classes/categoryQuestionsList.mjs";
import { dbAutoModeMixin } from "./mixins/dbAutoModeMixin.mjs";



// Uses DB for the auto queue mode and API for the other q modes.
export class NewAPIwDBQuestions extends NewAPIQuestions {
  _categoryQsList;
  _idField = "_id";

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this._categoryQsList = new DBCategoryQuestionsList();
  }

  // Get questions for the auto queue mode.
  async _getAutoQuestions() {
    await this.getDBAutoQuestions();
  }
}

Object.assign(NewAPIwDBQuestions.prototype, dbAutoModeMixin);