import { NewQuestions } from "../newQuestions.mjs";
import { DBCategoryQuestionsList } from "../../dbHelpers/categoryQuestionOrAnswersList/sub-classes/categoryQuestionsList.mjs";
import { dbAutoModeMixin } from "./mixins/dbAutoModeMixin.mjs";
import FuzzySearch from "fuzzy-search";



// For NewQuestions object, used to check and create list of next available (not 
// already answered by the user) questions for a given category, from either API or DB.
export class NewDBQuestions extends NewQuestions {
  _categoryQsList;
  _idField = "_id";
  _searchProp = "text";

  constructor(catTypeName, catName, userAnswers, queueReqInfo) {
    super(catTypeName, catName, userAnswers, queueReqInfo);
    this._categoryQsList = new DBCategoryQuestionsList();
  }

  // Get questions for the auto queue mode.
  async _getAutoQuestions() {
    await this.getDBAutoQuestions();
  }

  // Get questions for the search queue mode.
  async _getSearchQuestions() {
    await this._categoryQsList.init(this._categoryTypeName, this._categoryName);
    const categoryQs = this._categoryQsList.item.questions;

    const qTextSearcher = new FuzzySearch(categoryQs, [this._searchProp], {
      sort: true
    });

    const qTextSearchResult = qTextSearcher.search(this._searchQuery);

    // Test new questions from source to see if new and add to results.
    const eligibleNewQs = this._getEligibleNewQs(qTextSearchResult);
    const newQObjects = this._makeQObjects(eligibleNewQs); 
    
    this.results.push(...newQObjects);
  }

  // Creates question object, individualised for each category as necessary.
  _getNewQObj(newQ) {
    return {
      _id: newQ._id,
      text: newQ?.text,
      shortText: newQ?.shortText
    };
  }
}

Object.assign(NewDBQuestions.prototype, dbAutoModeMixin);