import { QueueInputPanel } from "../queueInputPanel.mjs";



export class AutoQueueInputPanel extends QueueInputPanel {
  includeAlreadyAnsweredCheckbox;

  constructor(qModeDiv) {
    super(qModeDiv);
    this.includeAlreadyAnsweredCheckbox = this.mainDiv.querySelector(".incl-prev-ans");
  }
}