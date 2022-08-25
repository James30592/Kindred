// Helper class for the base questions queue, to represent the DOM queue items 
// (eg. poster images) and handle their transitions when answering questions.
export class DomQueue {
  #queue = [];
  #numTransitions = 0;
  #categoryTypeName;
  #categoryName;

  constructor(qModeMainDiv, categoryType, category) {
    this.#queue = qModeMainDiv.querySelector(".queue-imgs");
    this.#categoryTypeName = categoryType;
    this.#categoryName = category;

    this.#queue.addEventListener("transitionend", evt => {
      this.#endTransition(evt);
    });
  }

  // Once DOM queue has done the transition for answering a question, delete 
  // the dom question. Check in case any more transitions are queued and carry 
  // them out if so.
  #endTransition(evt) {
    if (evt.propertyName !== "left") return;

    this.#numTransitions--;
    this.#deleteDomQ(0);
    this.#queue.classList.remove("queue-imgs-transitioning");
    
    // If user has clicked multiple answers quickly, then carry out any 
    // queued transitions for further answers.
    if (this.#numTransitions > 0) {
      setTimeout(() => this.#doTransition(), 0);
    };    
  }

  // Create DOM queue images from list of questions.
  addToQueue(qs) {
    for (let q of qs) {
      const [catTypeName, catName] = this.#getQCategory(q);

      const newDomQ = document.createElement("img");
      const imgPath = this.#getImgPath(q, catTypeName, catName);
      newDomQ.setAttribute("src", imgPath);

      this.#queue.appendChild(newDomQ);
    };
  }

  // Remove an item from the DOM images queue and handle the transition.
  removeQueueItem(idx) {
    if (this.#queue.hasChildNodes()) {
      // If first item in queue (ie. have answered a question), then need to 
      // handle the transition of images.
      if (idx === 0) {
        this.#numTransitions++;
        this.#doTransition();
      }

      // Otherwise just delete the DOM queue item.
      else {
        this.#deleteDomQ(idx);
      };
    };
  }

  // Deletes an individual DOM queue item.
  #deleteDomQ(idx) {
    this.#queue.removeChild(this.#queue.children[idx]);
  }

  // Causes transitioning of poster images when answering a question.
  #doTransition() {
    this.#queue.classList.add("queue-imgs-transitioning");
  }

  resetQueue() {
    this.#queue.innerText = "";
  }

  // If the queue has a category / category type assigned then use this,
  //  otherwise the queue contains items of various categories so check what 
  //  category the current question has.
  #getQCategory(q) {
    if (this.#categoryName) {
      return [this.#categoryTypeName, this.#categoryName];
    }
    else {
      return [q.categoryTypeName, q.categoryName];
    };
  }

  // Gets the correct image path, depending on the category.
  #getImgPath(q, catTypeName, catName) {
    let imgPath;

    switch(catTypeName, catName) {
  
      case ("Interests", "Films") :
        imgPath = `https://image.tmdb.org/t/p/w185/${q.posterPath}`;
        break;
  
      case ("Interests", "TV") :
        imgPath = `https://image.tmdb.org/t/p/w185/${q.posterPath}`;
        break;

      case ("Interests", "Music"):
        imgPath = `${q.image}`;
        break;
  
      case ("Interests", "Video Games"):
        imgPath = `https://images.igdb.com/igdb/image/upload/t_cover_big/${q.image}.jpg`;
        break;
  
      case ("Interests", "Books"):
        imgPath = `https://covers.openlibrary.org/b/id/${q.image}-M.jpg`;
        break;
  
      default:
        imgPath = `${q.image}`;
    };
    
    return imgPath;
  }
}