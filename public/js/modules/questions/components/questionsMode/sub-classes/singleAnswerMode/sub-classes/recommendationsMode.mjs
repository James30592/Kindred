import { SingleAnswerMode } from "../singleAnswerMode.mjs";



export class RecommendationsMode extends SingleAnswerMode {
  name = "recs";

  // Also remove the answered question from the recommendations list.
  answerQuestion(event) {
    super(event);

    // Remove this answered question from the recommendations list.
    this._qSource.removeAnsweredQ();
  }
}