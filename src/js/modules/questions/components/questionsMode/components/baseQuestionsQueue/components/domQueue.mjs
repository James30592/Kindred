// Helper class for the base questions queue, to represent the DOM queue items.
import { createQDomItem, getQCategory } from "../../../../../questionsHelpers.mjs";



// (eg. poster images) and handle their transitions when answering questions.
export class DomQueue {
  _queue = [];
  #numTransitions = 0;
  #categoryTypeName;
  #categoryName;

  static LAZY_LOAD_START_IDX = 4;

  constructor(qModeMainDiv, categoryType, category) {
    this._queue = qModeMainDiv.querySelector(".queue-imgs");
    this.#categoryTypeName = categoryType;
    this.#categoryName = category;

    this._queue.addEventListener("transitionend", evt => {
      this.#endTransition(evt);
    });
  }

  // Once DOM queue has done the transition for answering a question, delete 
  // the dom question. Check in case any more transitions are queued and carry 
  // them out if so.
  #endTransition(evt) {
    if (evt.propertyName !== "left") return;

    this.#numTransitions--;
    this._deleteDomQ(0);
    this._queue.classList.remove("queue-imgs-transitioning");
    
    // If user has clicked multiple answers quickly, then carry out any 
    // queued transitions for further answers.
    if (this.#numTransitions > 0) {
      setTimeout(() => this.#doTransition(), 0);
    };    
  }

  // Create DOM queue images and audio (where present) from list of questions.
  addToQueue(qs) {
    for (let q of qs) {
      const [catTypeName, catName] = getQCategory(q, 
        this.#categoryTypeName, this.#categoryName);
      
      const lazyLoad = this._queue.childElementCount >= DomQueue.LAZY_LOAD_START_IDX;

      const newDomQ = createQDomItem(q, catTypeName, catName, lazyLoad);
      newDomQ.setAttribute("data-id", q._id);
      this._queue.appendChild(newDomQ);
    };
  }

  // Remove an item from the DOM images queue and handle the transition.
  removeQueueItem(idx, doTrans) {
    if (this._queue.hasChildNodes()) {
      // If first item in queue (ie. have answered a question), then need to 
      // handle the transition of images.
      if (idx === 0 && doTrans) {
        this.#numTransitions++;
        this.#doTransition();
      }

      // Otherwise just delete the DOM queue item.
      else {
        this._deleteDomQ(idx);
      };
    };
  }

  // Deletes an individual DOM queue item.
  _deleteDomQ(idx) {
    // If removing outdated queue items from middle of queue but queue is still 
    // transitioning, boost the index by 1 to factor in that the previously 
    // answered q will have been removed from the queue but not the dom queue yet 
    // as the transition hasn't yet completed.
    if (this._queue.classList.contains("queue-imgs-transitioning") && idx > 0) {
      idx++;
    };

    this._queue.removeChild(this._queue.children[idx]);
  }

  // Causes transitioning of poster images when answering a question.
  #doTransition() {
    this._queue.classList.add("queue-imgs-transitioning");
  }

  resetQueue() {
    this._queue.innerText = "";
  }
}