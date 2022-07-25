import { NewAPIQuestions } from "./newAPIQuestions.mjs";
import { dbAutoModeMixin } from "./mixins/dbAutoModeMixin.mjs";



// Uses DB for the auto queue mode and API for the other q modes.
export class NewAPIwDBQuestions extends NewAPIQuestions {
  _categoryQsList;
  _idField = "_id";  

  // Get questions for the auto queue mode.
  async _getAutoQuestions() {
    await getDBAutoQuestions();
  }
}

Object.assign(NewAPIwDBQuestions.prototype, dbAutoModeMixin);