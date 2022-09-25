import { QModeWithQueueInput } from "../qModeWithQueueInput.mjs";

import { AutoQueueInputPanel } from "../../../components/queueInputPanel/\
sub-classes/autoQueueInputPanel.mjs";

import { AutoQuestionsQueue } from "../../../components/baseQuestionsQueue/\
sub-classes/questionsQueue/sub-classes/autoQuestionsQueue.mjs";



export class AutoMode extends QModeWithQueueInput {
  name = "auto";

  constructor(mainDiv, categoryType, category, btn = null) {
    super(mainDiv, btn);
    this.questionsQueue = new AutoQuestionsQueue(mainDiv, categoryType, category);
    this.queueInputPanel = new AutoQueueInputPanel(mainDiv);
  }

  // Sets up the queue input panel and answer UI panel button event listeners.
  init() {
    super.init();
    this.questionsQueue.inputPanel = this.queueInputPanel;

    this.queueInputPanel.includeAlreadyAnsweredCheckbox.addEventListener(
      "click", async () => {

      this.questionsQueue.reset();
      await this.updateQueueAndShowFirst(true);
    });
  }
}