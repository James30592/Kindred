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
  async updateQueueAndShowFirst(isNewQueue = false) {
    if (this.queueInputPanel.searchInput.value !== "") {
      this.answerUiPanel.showLoader();
      await super.updateQueue(isNewQueue);
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
      const searchTermChanged = this.questionsQueue.checkSearchTermChanged();
      if (searchTermChanged) {
        this.#resetQueueAndUpdate();
      };
    });

    this.queueInputPanel.includeAlreadyAnsweredCheckbox.addEventListener(
      "click", async () => {
      this.#resetQueueAndUpdate();
    });
  }

  async #resetQueueAndUpdate() {
    this.questionsQueue.reset();
    this.questionsQueue.setSearchQuery();
    await this.updateQueueAndShowFirst(true);
  }
}