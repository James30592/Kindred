// Recommendation for something the main user HASN'T already rated.
export class Recommendation {
  categoryType;
  category;
  questionId;
  questionDetails;
  rating;

  constructor(catType, category, qId, qDetails, simScore, ansPercentile) {
    this.categoryType = catType,
  	this.category = category,
  	this.questionId = qId,
    this.questionDetails = qDetails,
  	this.rating = {
      numUsersAnswered: 1,
      // Sum of all weighted scores for all users.
      sumWeightedRatings: simScore * ansPercentile,
      // Sum of all the weights (similarity scores) for all users.
      sumWeights: simScore,
      // Weighted average ansPercentile score (weighted by similarity of users).
      strength: null
    }
  }

  updateRating(ansPercentile, userSimScore) {
      this.rating.numUsersAnswered++;
      this.rating.sumWeightedRatings += ansPercentile * userSimScore;
      this.rating.sumWeights += userSimScore;
  }

  setRatingStrength() {
    this.rating.strength = this.rating.sumWeightedRatings / this.rating.sumWeights;
  }
}