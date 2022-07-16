class QueueInputPanel {
  mainDiv;

  constructor(qModeDiv) {
    this.mainDiv = qModeDiv.querySelector(".queue-input-panel");
  }
}






export class AutoQueueInputPanel extends QueueInputPanel {
  includeAlreadyAnsweredCheckbox;

  constructor(qModeDiv) {
    super(qModeDiv);
    this.includeAlreadyAnsweredCheckbox = this.mainDiv.querySelector(".incl-prev-ans");
  }
}






export class SearchQueueInputPanel extends QueueInputPanel {
  includeAlreadyAnsweredCheckbox;
  searchInput;
  searchBtn;

  constructor(qModeDiv) {
    super(qModeDiv);
    this.includeAlreadyAnsweredCheckbox = this.mainDiv.querySelector(".incl-prev-ans");
    this.searchInput = this.mainDiv.querySelector(".search-input");
    this.searchBtn = this.mainDiv.querySelector(".search-btn");
  }
}