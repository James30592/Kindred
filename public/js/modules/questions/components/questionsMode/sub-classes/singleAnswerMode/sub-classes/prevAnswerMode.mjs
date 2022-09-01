import { SingleAnswerMode } from "../singleAnswerMode.mjs";

import { SingleQuestionQueue } from "../../../components/baseQuestionsQueue/\
sub-classes/singleQuestionQueue.mjs";



export class PrevAnswerMode extends SingleAnswerMode {
  name = "prevAns";

  constructor(mainDiv, qSource, catTypeName, catName) {
    super(mainDiv, qSource);
    this.questionsQueue = new SingleQuestionQueue(mainDiv, catTypeName, catName);
  }

  // Passes the latestSession answers on to the qSource.
  setRecentAnswers(latestSessionAnswers) {
    this._qSource.updateAnswersList(latestSessionAnswers);
  }

  async activate() {
    super.activate();
    await this._qSource.activate();
  }

  deactivate() {
    this._qSource.deactivate();
    super.deactivate();

    // Hide the answer ui panel.
    this._answerUiModal.hide();
  }

  // Makes a question, ready to be shown in the answerUiPanel, from the clicked 
  // on prevAnswer.
  _makeQuestion(prevAns) {
    const thisQ = {
      _id: prevAns.questionId,
      currAns: {
        skip: prevAns?.skip,
        answerVal: prevAns?.answerVal
      }
    };

    for (let prop in prevAns.questionDetails) {
      thisQ[prop] = prevAns.questionDetails[prop]
    };

    return thisQ;
  }
}