import { QuestionsMode } from "../../questionsMode.mjs";



export class QModeWithQueueInput extends QuestionsMode {
  queueInputPanel;

  // Save answer information, update the queue if necessary.
  async answerQuestion(event) {
    const currQuestion = this.questionsQueue.removeQueueItem(0, true);

    this.questionsQueue.savePrevQ(currQuestion._id);

    // Get the answer object as it should be stored in the DB.
    const answerObj = this.getAnswerObj(event, currQuestion);

    // Emit event to be picked up by the questions page.
    this.dispatchEvent(
      new CustomEvent("answeredQ", {detail: {answerObj: answerObj}})
    );

    console.log("----------------------------------------------------");
    console.log("Answering question:");
    console.log(answerObj);
    console.log("current queue:");
    console.log(this.questionsQueue.queue.slice());
    console.log("current allRecentAnswers:");
    console.log(this.questionsQueue.allRecentAnswers.slice());
    console.log("current DOM queue:");
    const domQueueAsArray = Array.prototype.slice.call(this.questionsQueue._domQueue._queue.children);
    const domQueueIds = domQueueAsArray.map(itm => itm.getAttribute("data-id"));
    console.log(domQueueIds);
    console.log("Current queue prev Qs:");
    console.log(this.questionsQueue._queuePrevQs);
    console.log("----------------------------------------------------");

    // Updates the displayed question in the answer UI panel with the new first 
    // queue item.
    this._showCurrQ();

    // Adds more questions to the questions queue if necessary.
    let queueUpdated = await this.questionsQueue.update();
    if (queueUpdated) {
      this.questionsQueue.checkForOutdatedQs(true);
    };
  }

  // Updates the displayed question in the answer UI panel with the new first 
  // queue item. 
  _showCurrQ() {
    const inclAlreadyAnswered = this.queueInputPanel?.
      includeAlreadyAnsweredCheckbox.checked;

    super._showCurrQ(inclAlreadyAnswered);
  }

  async activate() {
    super.activate();
  }

  // Updates the questions queue and then displays the first question of it, 
  // called when switching to this questions mode.
  async updateQueueAndShowFirst(isNewQueue = false) {
    this.answerUiPanel.showLoader();
    await this.updateQueue(isNewQueue);
    this.answerUiPanel.hideLoader();
    this._showCurrQ();
  }

  // Updates the questions queue.
  async updateQueue(isNewQueue) {
    // Queue will only update if it's short on answers.
    await this.questionsQueue.update(isNewQueue);

    // Checks the queue to see if any questions in it are now outdated based on 
    // recently POSTed answers or recent answers from other questions modes that 
    // haven't yet been POSTed.
    this.questionsQueue.checkForOutdatedQs();
  }
}