// Clamp number between two values.
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Searches for a newItem in an array given an elemCompFunc that determines 
// whether it is present or not (eg. to find based on question ID). If present, 
// element in array is overwritten with newItem, otherwise newItem is pushed to 
// end of array.
export function findAndOverwriteElsePush(array, newItem, elemCompFunc) {
  const foundIndex = array.findIndex(arrItem => elemCompFunc(arrItem, newItem));

  // If found, overwrite.
  if (foundIndex > -1) {
    array.splice(foundIndex, 1, newItem);
  }
  // Otherwise add.
  else {
    array.push(newItem);
  };
}

// Fade transition helper functions, used with transparent, fully-hidden and 
// fade-trans css classes.
// Makes display property visible and then removes transparency.
export function fadeIn(elem) {
  elem.classList.remove("fully-hidden");
  setTimeout(() => elem.classList.remove("transparent"), 10);
}

export function fadeOut(elem) {
  elem.classList.add("transparent");
}

// Function that returns a promise that resolves when opacity transition on the 
// given element is completed. Also fully hides the element.
export async function finishFadeOut(elem) {
  return new Promise(resolve => {
    elem.addEventListener('transitionend', evt => {
      if (evt.propertyName === "opacity") {
        elem.classList.add("fully-hidden");
        resolve();
      };
    }, {once: true});
  })
};

// Fade out and fully hide the given element.
export function fullyFadeOut(elem) {
  fadeOut(elem);
  finishFadeOut(elem);
}





// Returns the category and type for a given question and object. If object has 
// no category then use that of the question. Used on baseQuestions Queue and 
// singleModeQSource.
export function getQCategory(q, objCatType, objCat) {
  return (objCat) ? [objCatType, objCat] : 
    [q.categoryTypeName ?? q.categoryType, q.categoryName ?? q.category];
}

// Gets the correct image path, depending on the category.
export function getQInfo(q, detail, catTypeName, catName) {
  let info;

  switch(catTypeName, catName) {

    case ("Interests", "Films") :
      info = {
        imgPath: q?.posterPath ? `https://image.tmdb.org/t/p/w185/${q.posterPath}` : null,
        qDisplayText: `${q?.title} (${q?.releaseDate})`,
        qSourceDisplayText: `${q?.title}`
      };
      break;

    case ("Interests", "TV") :
      info = {
        imgPath: q?.posterPath ? `https://image.tmdb.org/t/p/w185/${q.posterPath}` : null,
        qDisplayText: `${q?.title} (${q?.releaseDate})`,
        qSourceDisplayText: `${q?.title}`
      };
      break;

    case ("Interests", "Music"):
      info = {
        imgPath: q?.image,
        qDisplayText: `${q?.trackName} - ${q?.artist} (${q?.album} - ${q?.releaseDate})`,
        qSourceDisplayText: `${q?.trackName} - ${q?.artist}`
      };
      break;

    case ("Interests", "Video Games"):
      info = {
        imgPath: q?.image ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${q.image}.jpg` : null,
        qDisplayText: `${q?.title} (${q?.releaseDate}) (${q.platforms})`,
        qSourceDisplayText: `${q?.title}`
      };
      break;

    case ("Interests", "Books"):
      info = {
        imgPath: q?.image ? `https://covers.openlibrary.org/b/id/${q.image}-M.jpg` : null,
        qDisplayText: `${q?.title} (${q?.author})`,
        qSourceDisplayText: `${q?.title}`
      };
      break;

    default:
      info = {
        imgPath: null,
        qDisplayText: q?.text,
        qSourceDisplayText: q?.text
      };
  };

  return info[detail];
}

// Used in the dom queue for answering questions (search and auto) and also in 
// prev answers and recommendations pages.
export function createQDomItem(q, catTypeName, catName) {
  const newDomQ = document.createElement("div");;

  const imgPath = getQInfo(q, "imgPath", catTypeName, catName);
  
  if (imgPath) {
    const domImg = document.createElement("img");
    domImg.setAttribute("src", imgPath);
    newDomQ.appendChild(domImg);
  }
  else {
    const noImgDiv = document.createElement("div");
    noImgDiv.classList.add("placeholder-img");
    const noImgText = document.createElement("span");
    noImgText.innerText = "No image available";
    noImgDiv.appendChild(noImgText);
    newDomQ.appendChild(noImgDiv);
  };

  if (q.previewUrl) {
    const domMusicPlayer = document.createElement("audio");
    domMusicPlayer.setAttribute("controls", "true");
    domMusicPlayer.setAttribute("src", q.previewUrl);
    newDomQ.appendChild(domMusicPlayer);
  };

  return newDomQ;
}

// For testing long running functions.
// await new Promise(resolve => setTimeout(resolve, 5000)); //........................................................