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

  init() {
    // Pressing enter in search input carries out the search.
    this.searchInput.addEventListener("keyup", event => {
      if (event.keyCode === 13) {
          event.preventDefault();
          this.searchBtn.click();
      };
    });
  }
}