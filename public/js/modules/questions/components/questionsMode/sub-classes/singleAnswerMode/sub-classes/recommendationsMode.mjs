import { SingleAnswerMode } from "../singleAnswerMode.mjs";



export class RecommendationsMode extends SingleAnswerMode {
  name = "recs";

  // Also remove the answered question from the recommendations list.
  answerQuestion(event) {
    super.answerQuestion(event);

    // Remove this answered question from the recommendations list.
    this._qSource.removeAnsweredQ();
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

  async refreshRecs() {
    await this._qSource.refreshRecs();
  }
}