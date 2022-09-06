// Stores information on how similar two sets of answers are.
export class SimInfo {
  // Similarity score between 0 and 10 - 10 means completely equal scores, 0 at 
  // opposite ends of the answer scale.
  simScore;
  numCommonAnswers;
  // Stores overall average score difference between main user and 
  // compUser (mainUser score - compUser score average). ie. if positive then 
  // main user has generally more positive scores.
  scoreDiff;

  constructor(simScore = null, numCommonAnswers = 0, scoreDiff = null) {
    this.simScore = simScore;
    this.numCommonAnswers = numCommonAnswers;
    this.scoreDiff = scoreDiff;
  }
}