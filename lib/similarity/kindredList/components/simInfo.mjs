// Stores information on how similar two sets of answers are.
export class SimInfo {
  // Percentage similarity difference in scores, 100% - this number to give
  // positive score, 100% means completely equal scores, 0% at opposite ends
  // of the answer scale.
  simScore;
  numCommonAnswers;
  // Stores overall average percentile difference between main user and 
  // compUser (mainUser score - compUser score average). ie. if positive then 
  // main user has generally more positive scores.
  percDiff;

  constructor(simScore = null, numCommonAnswers = 0, percDiff = null) {
    this.simScore = simScore;
    this.numCommonAnswers = numCommonAnswers;
    this.percDiff = percDiff;
  }
}