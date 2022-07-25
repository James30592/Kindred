// Used to allow a hybrid "newAPIwDBQuestions" class to use API way for 
// getSearchQuestions but DB way for getAutoQuestions.
export const dbAutoModeMixin = {
  // Get questions for the auto queue mode, for DB source.
  async getDBAutoQuestions() {
    await this._categoryQsList.init(this._categoryTypeName, this._categoryName);

    // Test new questions from source to see if new and add to results.
    const eligibleNewQs = this._getEligibleNewQs(this._categoryQsList.item.questions);

    this._buildResults(eligibleNewQs);
  }
};