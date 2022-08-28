import { QModeWithQueueInput } from "../qModeWithQueueInput.mjs";

import { SearchQueueInputPanel } from "../../../components/queueInputPanel/\
sub-classes/searchQueueInputPanel.mjs";

import { SearchQuestionsQueue } from "../../../components/baseQuestionsQueue/\
sub-classes/questionsQueue/sub-classes/searchQuestionsQueue.mjs";



export class SearchMode extends QModeWithQueueInput {
  name = "search";

  constructor(mainDiv, categoryType, category) {
    super(mainDiv);
    this.questionsQueue = new SearchQuestionsQueue(mainDiv, categoryType, category);
    this.queueInputPanel = new SearchQueueInputPanel(mainDiv);
  }

  // Updates the questions queue and then displays the first question of it, 
  // called when switching to this questions mode.
  async updateQueueAndShowFirst() {
    if (this.queueInputPanel.searchInput.value !== "") {
      this.answerUiPanel.showLoader();
      await super.updateQueue();
    };
  
    this.answerUiPanel.hideLoader();
    this._showCurrQ();
  }

  // Sets up the queue input panel and answer UI panel button event listeners.
  init() {
    super.init();
    this.questionsQueue.inputPanel = this.queueInputPanel;
    this.questionsQueue.inputPanel.init();

    this.queueInputPanel.searchBtn.addEventListener("click", async () => {
      const searchTermChanged = this.questionsQueue.newSearch();
      if (searchTermChanged) await this.updateQueueAndShowFirst();
    });

    this.queueInputPanel.includeAlreadyAnsweredCheckbox.addEventListener(
      "click", async () => {

      this.questionsQueue.newSearch();
      await this.updateQueueAndShowFirst();
    });
  }
}