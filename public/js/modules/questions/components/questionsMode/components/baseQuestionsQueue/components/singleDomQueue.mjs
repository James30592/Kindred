import { DomQueue } from "./domQueue.mjs";



export class SingleDomQueue extends DomQueue {
  // Remove an item from the DOM images queue and handle the transition.
  removeQueueItem(idx, doTrans) {
    if (this._queue.hasChildNodes()) {
      if (idx === 0) {
        this._deleteDomQ(idx);
      };
      this._deleteDomQ(0);
    };
  }
}