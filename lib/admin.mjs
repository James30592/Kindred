import * as models from "../models/models.mjs";

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
  static allLocs = ALL_LOCS;

  constructor(dbCategoryInfo, dbCategoryQuestions) {
    this.categoryInfo = dbCategoryInfo;
    this.categoryQuestions = dbCategoryQuestions;
  }

  // Create numUsers number of users in the database with fully completed questions
  // for all categories, completely randomised.
  createUsers(numUsers = 100) {
    for (let i = 1; i <= numUsers; i++) {
      _createUser(i);
      _createRandAnswers(this.categoryInfo, this.categoryQuestions);
    };

    const resultMsg = `Created ${numUsers} new users!`;
    return resultMsg;
  }

  // Create numUsers number of users in the database with fully completed questions
  // for all categories, completely randomised.
  static _createUser(num){
    const name = "auto" + num;

    const userObj = {
      email: `${name}@${name}.com`,
      profileName: name,
      location: BatchUserCreator._getRandLoc(BatchUserCreator.allLocs),
    };

    // Register this user, with their password set equal to their profile name.
    models.User.register(userObj, name, function(err, user){
      if (err) {
        console.log(err);;
      };
    });
  }

  static _getRandLoc(locations) {
    const index = Math.floor(Math.random() * locations.length);
    return locations[index];
  }

  static async _createRandAnswers(dbCategoryTypes, allCategoryQuestions) {
    let allCategoryAnswers = [];

    for (let categoryQuestions of allCategoryQuestions) {

      const thisCategoryAnswers = {
        categoryTypeId: categoryQuestions.categoryTypeId,
        category: categoryQuestions.category,
        categoryType: categoryQuestions.categoryType,
        answers: []
      };

      for (let question of categoryQuestions.questions) {
        const [ansId, ansPerc] = BatchUserCreator._getRandAnsIdAndPerc(
          question.possAnswers.length);
        
        const thisAnswer = {
          questionId: question._id,
          answerId: ansId,
          answerPercentile: ansPerc          
        };
        
        thisCategoryAnswers.answers.push(thisAnswer);
      };

      allCategoryAnswers.push(thisCategoryAnswers);
    };

    await models.CategoryAnswersList.create(allCategoryAnswers);
  }

  // Returns a randomly generated answerId and corresponding answer percentile
  // for a question, given the number of possible answers.
  static _getRandAnsIdAndPerc(numPossAnswers) {
    const ansId = Math.floor(Math.random() * numPossAnswers)
    const ansPercentile = ansId * 100 / (numPossAnswers - 1)
    return [ansId, ansPercentile];
  }
}





// catTypesAnswers = [
//   {
//     categoryType: "Personality",
//     categoriesAnswers: [
//       {
//         category: "General",
//         answers: [
//           {
//             questionId: 0,
//             answerId: 0,
//             answerPercentile: 0
//           },
//           ...
//         ]
//       },
//       ...
//     ]
//   },
//   ...
// ]



















// import * as models from "./models/models.mjs";

// const personalityGenQs = [
//   {
//     _id: 0,
//     text: "What is your favourite colour?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Red"
//       },
//     	{
//         ansId: 1,
//         ansText: "Blue"
//       },
//     	{
//         ansId: 2,
//         ansText: "Green"
//       },
//     	{
//         ansId: 3,
//         ansText: "Yellow"
//       }
//     ]
//   },
//
//   {
//     _id: 1,
//     text: "What is your favourite country?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "England"
//       },
//     	{
//         ansId: 1,
//         ansText: "Scotland"
//       },
//     	{
//         ansId: 2,
//         ansText: "Wales"
//       },
//     	{
//         ansId: 3,
//         ansText: "Russia"
//       },
//     	{
//         ansId: 4,
//         ansText: "Kazahkstan"
//       }
//     ]
//   },
//
//   {
//     _id: 2,
//     text: "What is your favourite animal?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Dog"
//       },
//     	{
//         ansId: 1,
//         ansText: "Cat"
//       },
//     	{
//         ansId: 2,
//         ansText: "Badger"
//       },
//     	{
//         ansId: 3,
//         ansText: "Platypus"
//       },
//     	{
//         ansId: 4,
//         ansText: "Rat"
//       },
//     	{
//         ansId: 5,
//         ansText: "Goldfish"
//       }
//     ]
//   },
//
//   {
//     _id: 3,
//     text: "What is your favourite food?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Steak"
//       },
//     	{
//         ansId: 1,
//         ansText: "Pie"
//       },
//     	{
//         ansId: 2,
//         ansText: "Pizza"
//       },
//     	{
//         ansId: 3,
//         ansText: "Pasta"
//       },
//     	{
//         ansId: 4,
//         ansText: "Chips"
//       },
//     	{
//         ansId: 5,
//         ansText: "Sticky toffee pudding"
//       }
//     ]
//   }
// ];
//
//
//
//
//
//
//
// const filmQs = [
//   {
//     _id: 0,
//     text: "What do you think of The Shawshank Redemption (1994)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 1,
//     text: "What do you think of The Godfather (1972)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 2,
//     text: "What do you think of The Dark Knight (2008)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 3,
//     text: "What do you think of The Godfather: Part II (1974)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 4,
//     text: "What do you think of 12 Angry Men (1957)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 5,
//     text: "What do you think of Schindler's List (1993)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 6,
//     text: "What do you think of The Lord of the Rings: The Return of the King (2003)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 7,
//     text: "What do you think of Pulp Fiction (1994)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 8,
//     text: "What do you think of The Lord of the Rings: The Fellowship of the Ring (2001)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 9,
//     text: "What do you think of The Good, the Bad and the Ugly (1966)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   }
//
// ]
//
//
//
//
//
// const tvQs = [
//   {
//     _id: 0,
//     text: "What do you think of Planet Earth II (2016)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 1,
//     text: "What do you think of Breaking Bad (2008)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 2,
//     text: "What do you think of Planet Earth (2006)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 3,
//     text: "What do you think of Band of Brothers (2001)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 4,
//     text: "What do you think of Chernobyl (2019)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 5,
//     text: "What do you think of The Wire (2002)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 6,
//     text: "What do you think of Blue Planet II (2017)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 7,
//     text: "What do you think of Avatar: The Last Airbender (2005)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 8,
//     text: "What do you think of Cosmos: A Spacetime Odyssey (2014)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 9,
//     text: "What do you think of The Sopranos (1999)?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   }
//
// ]
//
//
// const bookQs = [
//   {
//     _id: 0,
//     text: "What do you think of Anna Karenina by Leo Tolstoy?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 1,
//     text: "What do you think of Madame Bovary by Gustave Flaubert?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 2,
//     text: "What do you think of War and Peace by Leo Tolstoy?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 3,
//     text: "What do you think of The Great Gatsby by F. Scott Fitzgerald?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 4,
//     text: "What do you think of Lolita by Vladimir Nabokov?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 5,
//     text: "What do you think of Middlemarch by George Eliot?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 6,
//     text: "What do you think of The Adventures of Huckleberry Finn by Mark Twain?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 7,
//     text: "What do you think of The Stories of Anton Chekhov by Anton Chekhov?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 8,
//     text: "What do you think of In Search of Lost Time by Marcel Proust?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 9,
//     text: "What do you think of Hamlet by William Shakespeare?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   }
//
// ]
//
//
//
//
//
// const sportsPlayQs = [
//   {
//     _id: 0,
//     text: "Do you like to play tennis?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 1,
//     text: "Do you like to play football?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 2,
//     text: "Do you like to play basketball?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 3,
//     text: "Do you like to play rugby?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 4,
//     text: "Do you like to play cricket?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 5,
//     text: "Do you like to play hockey?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 6,
//     text: "Do you like to rock climb?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 7,
//     text: "Do you like to play bowls?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 8,
//     text: "Do you like to play croquet?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   },
//
//   {
//     _id: 9,
//     text: "Do you like to play baseball?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Hate it"
//       },
//     	{
//         ansId: 1,
//         ansText: "Don't like it"
//       },
//     	{
//         ansId: 2,
//         ansText: "Like it"
//       },
//     	{
//         ansId: 3,
//         ansText: "Love it"
//       }
//     ]
//   }
//
// ]
//
//
//
//
//
// const personalityGen = {
//   name: "General",
//   questions: personalityGenQs
// };
//
// const personalityScens = {
//   name: "Scenarios",
//   questions: []
// };
//
// const personalityLogic = {
//   name: "Logic",
//   questions: []
// };
//
// export const personality = {
//   name: "Personality",
//   categories: [personalityGen, personalityScens, personalityLogic]
// };
//
//
// const interestsFilms = {
//   name: "Films",
//   questions: filmQs
// };
//
// const interestsTv = {
//   name: "TV",
//   questions: tvQs
// };
//
// const interestsBooks = {
//   name: "Books",
//   questions: bookQs
// };
//
// const interestsSportsPlay = {
//   name: "Sports (play)",
//   questions: sportsPlayQs
// };
//
// export const interests = {
//   name: "Interests",
//   categories: [interestsFilms, interestsTv, interestsBooks, interestsSportsPlay]
// };
//
//
//
// import {interests} from "../questions.mjs";
//
// insertCategoryType(interests);
//
// async function insertCategoryType (categoryType){
//   await models.CategoryType.create(categoryType);
// }
//
//
// import {personality} from "../questions.mjs";
//
// insertCategoryType(personality);






// export const newQs = [
//   {
//     _id: 4,
//     text: "What is your favourite weather?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Sunny"
//       },
//     	{
//         ansId: 1,
//         ansText: "Rainy"
//       },
//     	{
//         ansId: 2,
//         ansText: "Cloudy"
//       },
//     	{
//         ansId: 3,
//         ansText: "Stormy"
//       }
//     ]
//   },
//
//   {
//     _id: 5,
//     text: "What is your favourite season?",
//     possAnswers: [
//     	{
//         ansId: 0,
//         ansText: "Spring"
//       },
//     	{
//         ansId: 1,
//         ansText: "Summer"
//       },
//     	{
//         ansId: 2,
//         ansText: "Winter"
//       },
//     	{
//         ansId: 3,
//         ansText: "Autumn"
//       }
//     ]
//   }
//
// ];
//
//
// export async function addQuestions(categoryTypeName, categoryName, newQuestions){
//   const thisCatType = await models.CategoryType.findOne({name: categoryTypeName});
//
//   thisCatType.categories.forEach(function(category){
//     if (category.name === categoryName){
//       category.questions = category.questions.concat(newQuestions);
//     }
//   });
//
//   thisCatType.save(function(){
//     console.log("added new questions to " + categoryTypeName + " - " + categoryName);
//   });
// }
//
//
//
// import * as updateDB from "../questions.mjs";
//
// updateDB.addQuestions("Personality", "General", updateDB.newQs);
