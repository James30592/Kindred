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
        qDisplayText: `${q?.title} (${getDisplayReleaseDate(q?.releaseDate)})`,
        qSourceDisplayText: `${q?.title}`,
        imgPlaceHolderTxt: `${q?.title}`
      };
      break;

    case ("Interests", "TV") :
      info = {
        imgPath: q?.posterPath ? `https://image.tmdb.org/t/p/w185/${q.posterPath}` : null,
        qDisplayText: `${q?.title} (${getDisplayReleaseDate(q?.releaseDate)})`,
        qSourceDisplayText: `${q?.title}`,
        imgPlaceHolderTxt: `${q?.title}`
      };
      break;

    case ("Interests", "Music"):
      info = {
        imgPath: q?.image,
        qDisplayText: `${q?.trackName} - ${q?.artist} (${q?.album} - ${new Date(q?.releaseDate).getFullYear()})`,
        qSourceDisplayText: `${q?.trackName} - ${q?.artist}`,
        imgPlaceHolderTxt: `${q?.trackName}`
      };
      break;

    case ("Interests", "Video Games"):
      info = {
        imgPath: q?.image ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${q.image}.jpg` : null,
        qDisplayText: `${q?.title} (${getDisplayReleaseDate(q?.releaseDate)}) (${q.platforms})`,
        qSourceDisplayText: `${q?.title}`,
        imgPlaceHolderTxt: `${q?.title}`
      };
      break;

    case ("Interests", "Books"):
      info = {
        imgPath: q?.image ? `https://covers.openlibrary.org/b/id/${q.image}-M.jpg` : null,
        qDisplayText: `${q?.title} (${q?.author})`,
        qSourceDisplayText: `${q?.title}`,
        imgPlaceHolderTxt: `${q?.title}`
      };
      break;

    default:
      info = {
        imgPath: null,
        qDisplayText: q?.text,
        qSourceDisplayText: q?.text,
        imgPlaceHolderTxt: q?.shortText ?? q.text
      };
  };

  return info[detail];
}

function getDisplayReleaseDate(releaseDate) {
  return releaseDate ? new Date(releaseDate).getFullYear() : "Unknown";
}

// Used in the dom queue for answering questions (search and auto) and also in 
// prev answers and recommendations pages.
export function createQDomItem(q, catTypeName, catName) {
  const newDomQ = document.createElement("div");;

  const imgPath = getQInfo(q, "imgPath", catTypeName, catName);
  
  if (imgPath) {
    const domImg = document.createElement("img");
    domImg.setAttribute("src", imgPath);
    domImg.setAttribute("loading", "lazy");
    newDomQ.appendChild(domImg);
  }
  else {
    const noImgDiv = document.createElement("div");
    noImgDiv.classList.add("placeholder-img");
    const noImgText = document.createElement("span");
    const placeholderText = getQInfo(q, "imgPlaceHolderTxt", catTypeName, catName);
    noImgText.innerText = placeholderText;

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