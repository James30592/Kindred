import * as dbHelpers from "./dbHelpers.mjs";


// Store current users answering questions for efficient access and updating of 
// the database.
class CurrAnswerers {
    constructor() {
        this.users = {};
    }

    // Adds or updates an answerer to this object as necessary.
    async getCurrAnswerer(userId, catTypeName, categoryName) {
        if (userId in this.users) {
            const isDiffCategory = this._checkCatAndCatType(catTypeName, 
                categoryName, userId);
            
            if (isDiffCategory) {
                await this._updateUser(userId, catTypeName, categoryName);
            }
        }
        else {
            await this._addUser(userId, catTypeName, categoryName);
        };

        return this.users[userId];
    }

    removeUser(userId) {
        delete this.users[userId];
    }

    // Finds a user and their relevant answers list in the database and adds it 
    // to this.users.
    async _addUser(userId, catTypeName, categoryName) {
        const answersList = new dbHelpers.CategoryAnswersList();
        await answersList.init(catTypeName, categoryName, userId);

        this.users[userId] = {
            user: thisUser,
            categoryType: catTypeName,
            category: categoryName,
            answers: answersList.item.answers
        };
    }

    // Gets the relevant answers list for the new category for a user and 
    // updates their entry in this.users.
    async _updateUser(userId, catTypeName, categoryName) {
        const newAnswersList = new dbHelpers.CategoryAnswersList();
        await newAnswersList.init(catTypeName, categoryName, userId);

        this.users[userId].categoryType = catTypeName;
        this.users[userId].category = categoryName;
        this.users[userId].answers = newAnswersList.item.answers;
    }

    _checkCatAndCatType(catTypeName, categoryName, userId) {
        const thisUser = this.users[userId];
        if (catTypeName === thisUser.categoryType && categoryName === 
            thisUser.category) {

            return false;
        }
        return true;
    }
}

export const currAnswerers = new CurrAnswerers();