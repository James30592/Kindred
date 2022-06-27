import * as dbHelpers from "./dbHelpers.mjs";


class Answerer {
    user;
    categoryType;
    category;
    answers;
    qSource;
    lastActionTime;

    constructor(user, catTypeName, categoryName, answers, qSource, now) {
        this.user = user;
        this.catTypeName = catTypeName;
        this.categoryName = categoryName;
        this.answers = answers;
        this.qSource = qSource;
        this.lastActionTime = now;
    }
}


// Store current users answering questions for efficient access and updating of 
// the database.
class CurrAnswerers {
    static inactiveMinsCutoff = 10;
    #users = {};

    // Adds or updates an answerer to this object as necessary.
    async getCurrAnswerer(userId, catTypeName, categoryName) {
        if (userId in this.#users) {
            const isDiffCategory = this.#checkCatAndCatType(catTypeName, 
                categoryName, userId);
            
            if (isDiffCategory) {
                await this.#updateUserCategory(userId, catTypeName, categoryName);
            }
        }
        else {
            await this.#addUser(userId, catTypeName, categoryName);
        };

        return this.#users[userId];
    }

    removeUser(userId) {
        delete this.#users[userId];
    }

    // Finds a user and their relevant answers list in the database and adds it 
    // to this.users.
    async #addUser(userId, catTypeName, categoryName) {
        const answersList = new dbHelpers.CategoryAnswersList();
        await answersList.init(catTypeName, categoryName, userId);



        this.#users[userId] = new Answerer(thisUser, catTypeName, categoryName, 
            answersList.item.answers, new Date())
    }

    // Gets the relevant answers list for the new category for a user and 
    // updates their entry in this.users.
    async #updateUserCategory(userId, catTypeName, categoryName) {
        const newAnswersList = new dbHelpers.CategoryAnswersList();
        await newAnswersList.init(catTypeName, categoryName, userId);

        this.#users[userId].categoryType = catTypeName;
        this.#users[userId].category = categoryName;
        this.#users[userId].answers = newAnswersList.item.answers;
        this.#users[userId].lastActionTime = new Date();
    }

    #checkCatAndCatType(catTypeName, categoryName, userId) {
        const thisUser = this.#users[userId];
        if (catTypeName === thisUser.categoryType && categoryName === 
            thisUser.category) {

            return false;
        }
        return true;
    }

    // Used to clear out any users who aren't actively asking questions....not yet used...
    clearExpired() {
        const now = new Date();
        for (let userId in this.#users) {
            const minsSinceLastAction = (now - 
                this.#users[userId].lastActionTime) / (1000 * 60)

            if (minsSinceLastAction > CurrAnswerers.inactiveMinsCutoff) {
                this.removeUser(userId);
            };
        };
    }
}

export const currAnswerers = new CurrAnswerers();