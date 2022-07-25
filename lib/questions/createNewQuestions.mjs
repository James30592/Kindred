import { NewDBQuestions } from "./sub-classes/newDBQuestions.mjs";
import { NewFilmsTVQuestions } from "./sub-classes/sub-classes/newFilmsTVQuestions.mjs";
import { NewMusicQuestions } from "./sub-classes/sub-classes/newMusicQuestions.mjs";
import { NewVideoGamesQuestions } from "./sub-classes/sub-classes/newVideoGamesQuestions.mjs";
import { NewBooksQuestions } from "./sub-classes/sub-classes/newBooksQuestions.mjs";



export function createNewQuestions(catTypeName, catName, userAnswers, queueReqInfo) {
  switch (catTypeName, catName) {
    case ("Interests", "Films"):
      return new NewFilmsTVQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "TV"):
      return new NewFilmsTVQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "Books"):
      return new NewBooksQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "Music"):
      return new NewMusicQuestions(catTypeName, catName, userAnswers, queueReqInfo);

    case ("Interests", "Video Games"):
      return new NewVideoGamesQuestions(catTypeName, catName, userAnswers, queueReqInfo);
    
    default:
      return new NewDBQuestions(catTypeName, catName, userAnswers, queueReqInfo);
  };
}