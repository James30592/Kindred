import { DomQueue } from "./domQueue.mjs";



export class SingleDomQueue extends DomQueue {
  // Remove an item from the DOM images queue and handle the transition.
  removeQueueItem(idx) {
    if (this._queue.hasChildNodes()) {
      // If first item in queue (ie. have answered a question), then need to 
      // handle the transition of images.
      if (idx === 0) {
        this._deleteDomQ(idx);
      };
    };
  }
}