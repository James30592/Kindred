import { User } from "../models/user.mjs";
import { CategoryAnswersList } from "../models/categoryAnswersList.mjs";



const ALL_LOCS = [
  "Tokyo",
  "Delhi",
  "Shanghai",
  "São Paulo",
  "Mexico City",
  "Cairo",
  "Mumbai",
  "Beijing",
  "Dhaka",
  "Osaka",
  "New York",
  "Karachi",
  "Buenos Aires",
  "Chongqing",
  "Istanbul",
  "Kolkata",
  "Manila",
  "Lagos",
  "Rio de Janeiro",
  "Tianjin",
  "Kinshasa",
  "Guangzhou",
  "Los Angeles",
  "Moscow",
  "Shenzhen",
  "Lahore",
  "Bangalore",
  "Paris",
  "Bogotá",
  "Jakarta",
  "Chennai",
  "Lima",
  "Bangkok",
  "Seoul",
  "Nagoya",
  "Hyderabad",
  "London",
  "Tehran",
  "Chicago",
  "Chengdu",
  "Nanjing",
  "Wuhan",
  "Ho Chi Minh City",
  "Luanda",
  "Ahmedabad",
  "Kuala Lumpur",
  "Xian",
  "Hong Kong",
  "Dongguan",
  "Hangzhou",
  "Foshan",
  "Shenyang",
  "Riyadh",
  "Baghdad",
  "Santiago",
  "Surat",
  "Madrid",
  "Suzhou",
  "Pune",
  "Harbin",
  "Houston",
  "Dallas",
  "Toronto",
  "Dar es Salaam",
  "Miami",
  "Belo Horizonte",
  "Singapore",
  "Philadelphia",
  "Atlanta",
  "Fukuoka",
  "Khartoum",
  "Barcelona",
  "Johannesburg",
  "Saint Petersburg",
  "Qingdao",
  "Dalian",
  "Washington metropolitan area",
  "Yangon",
  "Alexandria",
  "Jinan",
  "Guadalajara"
];



export class BatchUserCreator {
  static #allLocs = ALL_LOCS;
  #categoryInfo;
  #categoryQuestions;

  constructor(dbCategoryInfo, dbCategoryQuestions) {
    this.#categoryInfo = dbCategoryInfo;
    this.#categoryQuestions = dbCategoryQuestions;
  }

  // Create numUsers number of users in the database with fully completed questions
  // for all categories, completely randomised.
  createUsers(numUsers = 100) {
    for (let i = 1; i <= numUsers; i++) {
      const newUserId = BatchUserCreator.#createUser(i);
      BatchUserCreator.#createRandAnswers(this.#categoryQuestions, newUserId);
    };

    const resultMsg = `Created ${numUsers} new users!`;
    return resultMsg;
  }

  // Create numUsers number of users in the database with fully completed questions
  // for all categories, completely randomised.
  static #createUser(num){
    const name = "auto" + num;

    const userObj = {
      email: `${name}@${name}.com`,
      profileName: name,
      location: BatchUserCreator.#getRandLoc(BatchUserCreator.#allLocs),
    };

    // Register this user, with their password set equal to their profile name.
    User.register(userObj, name, function(err, user){
      if (err) {
        console.log(err);;
      }
      else {
        return user._id;
      };
    });
  }

  static #getRandLoc(locations) {
    const index = Math.floor(Math.random() * locations.length);
    return locations[index];
  }

  static async #createRandAnswers(allCategoryQuestions, userId) {
    let allCategoryAnswers = [];

    for (let categoryQuestions of allCategoryQuestions) {

      const thisCategoryAnswers = {
        userId: userId,
        categoryTypeId: categoryQuestions.categoryTypeId,
        category: categoryQuestions.category,
        categoryType: categoryQuestions.categoryType,
        answers: []
      };

      for (let question of categoryQuestions.questions) {
        const ansVal = BatchUserCreator.#getRandAnsVal();
        
        const thisAnswer = {
          questionId: question._id,
          answerVal: ansVal,
          skip: false       
        };
        
        thisCategoryAnswers.answers.push(thisAnswer);
      };

      allCategoryAnswers.push(thisCategoryAnswers);
    };

    await CategoryAnswersList.create(allCategoryAnswers);
  }

  // Returns a randomly generated answerVal for a question, given the number of 
  // possible answers.
  static #getRandAnsVal() {
    const ansVal = Math.floor(Math.random() * 10);
    return ansVal;
  }
}
