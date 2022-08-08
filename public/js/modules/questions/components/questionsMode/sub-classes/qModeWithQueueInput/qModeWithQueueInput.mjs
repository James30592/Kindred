import { QuestionsMode } from "../../questionsMode.mjs";



export class QModeWithQueueInput extends QuestionsMode {
  queueInputPanel;

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
  async updateQueueAndShowFirst() {
    await this.updateQueue();
    this._showCurrQ();
  }

  // Updates the questions queue.
  async updateQueue() {
    // Queue will only update if it's short on answers.
    await this.questionsQueue.update();

    // Checks the queue to see if any questions in it are now outdated based on 
    // recently POSTed answers or recent answers from other questions modes that 
    // haven't yet been POSTed.
    this.questionsQueue.checkForOutdatedQs();
  }
}