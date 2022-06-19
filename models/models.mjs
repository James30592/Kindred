import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");



// Collection of category types and their sub-categories (embedded).
const categorySchema = new mongoose.Schema({
  name: String
});

const categoryTypeSchema = new mongoose.Schema({
  name: String,
  categories: [categorySchema]
});

export const CategoryType = new mongoose.model("CategoryType", categoryTypeSchema);



// Collection of questions for each category, linked to categoryType and 
// category by id.
const possAnswerSchema = new mongoose.Schema({
  ansId: Number,
  ansText: String
}, {_id: false});

const questionSchema = new mongoose.Schema({
  _id: Number,
  categoryTypeId: { type: Schema.Types.ObjectId, ref: "CategoryType" },
  category: String,
  text: String,
  possAnswers: [possAnswerSchema]
});

export const CategoryQuestionList = new mongoose.model("CategoryQuestionList", 
questionSchema);



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
    type: String,
    required: true
  }
});

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

export const User = new mongoose.model("User", userSchema);



// Collection of user answers for each category for each user, linked to user 
// and categoryType through ids.
const answerDetailSchema = new mongoose.Schema({
  questionId: Number,
  answerId: Number,
  answerPercentile: Number
}, {_id: false});

const categoryAnswersSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  categoryTypeId: { type: Schema.Types.ObjectId, ref: "CategoryType" },
  category: String,
  categoryType: String,
  answers: [answerDetailSchema]
});

export const CategoryAnswersList = new mongoose.model("CategoryAnswersList", 
  categoryAnswersSchema);
