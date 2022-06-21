import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");



// Collection of category types and their sub-categories (embedded).
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true}
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
  // ansPerc: Number     perhaps store this here, or some other type variable if a non-quantifiable question.
}, {_id: false});

const questionSchema = new mongoose.Schema({
  _id: Number,
  text: String,
  possAnswers: [possAnswerSchema]
});

const categoryQuestionListSchema = new mongoose.Schema({
  categoryTypeId: { type: Schema.Types.ObjectId, ref: "CategoryType" },
  categoryType: String,
  category: String,
  questionSource: String,
  // recommendable: Boolean,
  questions: [questionSchema]
});

export const CategoryQuestionsList = new mongoose.model("CategoryQuestionList", 
categoryQuestionListSchema);



// Collection of users.
const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  profileName: {type: String, required: true},
  location: {type: String, required: true}
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
  categoryType: String,
  category: String,
  answers: [answerDetailSchema]
});

export const CategoryAnswersList = new mongoose.model("CategoryAnswersList", 
  categoryAnswersSchema);
