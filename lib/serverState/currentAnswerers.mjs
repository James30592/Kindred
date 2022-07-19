import * as dbHelpers from "../dbHelpers.mjs";
import * as models from "../../models/models.mjs";


class Answerer {
    user;
    categoryType;
    category;
    answersList;
    lastActionTime;

    constructor(user, catTypeName, categoryName, answersList, now) {
        this.user = user;
        this.categoryType = catTypeName;
        this.category = categoryName;
        this.answersList = answersList;
        this.lastActionTime = now;
    }

    updateLastActionTime() {
        this.lastActionTime = new Date();
    }
}


// Store current users answering questions for efficient access and updating of 
// the database.
export class CurrAnswerers {
    static inactiveMinsCutoff = 10;
    #users = {};

    // Calls clearExpired every 10 mins.
    init() {
        setInterval(() => {this.#clearExpired()}, 600000);
    }

    // Adds or updates an answerer to this object as necessary.
    async getCurrAnswerer(userId, catTypeName, categoryName) {
        if (userId in this.#users) {
            const isDiffCategory = this.#checkCatAndCatType(userId, catTypeName, 
                categoryName);
            
            if (isDiffCategory) {
                await this.#updateUserCategory(userId, catTypeName, categoryName);
            };
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
        await answersList.initAndCreateIfNeeded(catTypeName, categoryName, userId);

        const thisUser = await models.User.findOne({_id: userId}).exec();

        this.#users[userId] = new Answerer(thisUser, catTypeName, categoryName, 
            answersList, new Date())
    }

    // Gets the relevant answers list for the new category for a user and 
    // updates their entry in this.users.
    async #updateUserCategory(userId, catTypeName, categoryName) {
        const newAnswersList = new dbHelpers.CategoryAnswersList();
        await newAnswersList.initAndCreateIfNeeded(catTypeName, categoryName, userId);

        this.#users[userId].categoryType = catTypeName;
        this.#users[userId].category = categoryName;
        this.#users[userId].answersList = newAnswersList;
        this.#users[userId].endQueueAPIPage = null;
        this.#users[userId].endQueueId = null;
        this.#users[userId].lastActionTime = new Date();
    }

    #checkCatAndCatType(userId, catTypeName, categoryName) {
        const thisUser = this.#users[userId];
        if (catTypeName === thisUser.categoryType && categoryName === 
            thisUser.category) {

            return false;
        }
        return true;
    }

    // Used to clear out any users who aren't actively asking questions....not yet used...
    #clearExpired() {
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