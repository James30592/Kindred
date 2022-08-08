import { SingleAnswerMode } from "../singleAnswerMode.mjs";



export class PrevAnswerMode extends SingleAnswerMode {
  name = "prevAns";

  _handleClickSingleQ(evt) {
    // Get the question from this prev answer and make it the queue contents.
    const thisPrevAns = evt.detail.answer;
    const thisQuestion = this.#makeQuestion(thisPrevAns);
    this.questionsQueue.update(thisQuestion);

    // Show the answer ui panel.
    this.answerUiPanel.mainDiv.classList.remove("fully-hidden");

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();
  }

  // Makes a question, ready to be shown in the answerUiPanel, from the current 
  // user answer.
  #makeQuestion(prevAns) {
    const thisQ = {
      _id: prevAns.questionId,
      currAns: {
        skip: prevAns.skip,
        answerVal: prevAns.answerVal
      }
    };

    for (let prop in prevAns.questionDetails) {
      thisQ[prop] = prevAns.questionDetails[prop]
    };

    return thisQ;
  }

  async activate() {
    super.activate();
    await this._qSource.activate();
  }

  // Passes the allRecentAnswers on to the questions queue.
  setRecentAnswers(latestSessionAnswers) {
    this._qSource.updateAnswersList(latestSessionAnswers);
  }

  deactivate() {
    this._qSource.deactivate();

    // Hide the answer ui panel.
    this.answerUiPanel.mainDiv.classList.add("fully-hidden");
  }
}