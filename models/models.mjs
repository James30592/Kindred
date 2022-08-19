import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");





// Collection of category types and their sub-categories (embedded).
const categorySchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    unique: true
  }
});

const categoryTypeSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    unique: true
  },
  categories: [categorySchema]
});

export const CategoryType = new mongoose.model("CategoryType", categoryTypeSchema);





// - removed for now to just do 0 - 10 numeric answers--------------------

// // Collection of questions for each category, linked to categoryType and 
// // category by id.
// const possAnswerSchema = new mongoose.Schema({
//   ansId: Number,
//   ansText: String
//   // ansPerc: Number     perhaps store this here, or some other type variable if a non-quantifiable question.
// }, {_id: false});

const questionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },

  text: {
    type: String, 
    required: false
  },
  // possAnswers: [possAnswerSchema]                  - removed for now to just do 0 - 10 numeric answers
}, {strict: false});

const apiInfo = new mongoose.Schema({
  _id: {type: Number, required: true},
  name: String
});

const categoryQuestionsListSchema = new mongoose.Schema({
  categoryTypeId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "CategoryType", 
    required: true
  },

  categoryType: {
    type: String, 
    required: true
  },

  category: {
    type: String, 
    required: true
  },

  // recommendable: Boolean,
  // isSourceAPI: { type: Boolean, required: true },                      - not needed anymore
  apiInfo: apiInfo,
  questions: [questionSchema]
  // possAnswers: [{ type: Schema.Types.ObjectId, ref: "PossAnswer" }]      - default possAnswers for this category, removed for now
});

export const CategoryQuestionsList = new mongoose.model("CategoryQuestionsList", 
  categoryQuestionsListSchema);







const locationSchema = new mongoose.Schema({
  placeName: {
    type: String, 
    required: true
  },

  googlePlaceId: {
    type: String, 
    required: true
  },

  formattedAddress: {
    type: String, 
    required: true
  },

  coords: {
    lat: {
      type: Number, 
      required: true
    },
    lng: {
      type: Number, 
      required: true
    }
  },

  country: {
    short: {
      type: String, 
      required: true
    },
    long: {
      type: String, 
      required: true
    }
  },

  fullAddress: [{
    type: String, 
    required: true
  }]

}, {_id: false});

// Collection of users.
const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true, 
    unique: true
  },

  profileName: {
    type: String, 
    required: true
  },

  location: {
    type: locationSchema, 
    required: true
  }
});

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

export const User = new mongoose.model("User", userSchema);







const answerQuestionDetails = new mongoose.Schema({}, 
  {_id: false, strict: false});

// Collection of user answers for each category for each user, linked to user 
// and categoryType through ids.
const answerDetailSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.Mixed, 
    required: true
  },

  skip: {
    type: Boolean, 
    required: true
  },

  answerVal: {
    type: Number,
    min: [0, "Score must be at least 0."],
    max: [10, "Score must be at most 10."]
  },

  answerPercentile: Number,
  questionDetails: answerQuestionDetails
}, {_id: false});

const categoryAnswersListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },

  categoryTypeId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "CategoryType", 
    required: true
  },

  categoryType: {
    type: String, 
    required: true
  },

  category: {
    type: String, 
    required: true
  },
  
  answers: [answerDetailSchema]
});

export const CategoryAnswersList = new mongoose.model("CategoryAnswersList", 
  categoryAnswersListSchema);
