import { SingleAnswerMode } from "../singleAnswerMode.mjs";



export class RecommendationsMode extends SingleAnswerMode {
  name = "recs";

  // Also remove the answered question from the recommendations list.
  answerQuestion(event) {
    const thisAns = super.answerQuestion(event);

    // Remove this answered question from the recommendations list, if user 
    // didn't skip it.
    if (!thisAns.skip) {
      this._qSource.removeAnsweredQ();
    };
  }

  // Makes a question, ready to be shown in the answerUiPanel, from the clicked 
  // on question.
  _makeQuestion(qItem) {
    const thisQ = {
      _id: qItem.questionId,
      categoryTypeName: qItem.categoryType,
      categoryName: qItem.category
    };

    for (let prop in qItem.questionDetails) {
      thisQ[prop] = qItem.questionDetails[prop]
    };

    return thisQ;
  }
}