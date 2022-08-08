import { QueueInputPanel } from "../queueInputPanel.mjs";



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