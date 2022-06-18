import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const possAnswerSchema = new mongoose.Schema({
  ansId: Number,
  ansText: String
}, {_id: false});

const questionSchema = new mongoose.Schema({
  _id: Number,
  text: String,
  possAnswers: [possAnswerSchema]
});

const categorySchema = new mongoose.Schema({
  name: String,
  questions: [questionSchema]
});

const categoryTypeSchema = new mongoose.Schema({
  name: String,
  categories: [categorySchema]
});

export const CategoryType = new mongoose.model("CategoryType", categoryTypeSchema);




const answerDetailSchema = new mongoose.Schema({
  questionId: Number,
  answerId: Number,
  answerPercentile: Number
}, {_id: false});

const answersSchema = new mongoose.Schema({
  category: String,
  answers: [answerDetailSchema]
}, {_id: false});

const categoryTypeAnswersSchema = new mongoose.Schema({
  categoryType: String,
  categoriesAnswers: [answersSchema]
}, {_id: false});




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
  },
  categoryTypesAnswers: [categoryTypeAnswersSchema]
});

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

export const User = new mongoose.model("User", userSchema);
