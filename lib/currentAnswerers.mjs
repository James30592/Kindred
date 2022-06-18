import { getCategoryAnswers } from "./dbHelpers.mjs";
import * as models from "../models/models.mjs";


// Store current users answering questions for efficient access and updating of 
// the database.
class CurrAnswerers {
    constructor() {
        this.users = {};
    }

    // Adds or updates an answerer to this object as necessary.
    async getCurrAnswerer(userId, catTypeName, categoryName) {
        if (userId in this.users) {
            const isDiffCategory = this._checkCatAndCatType(catTypeName, categoryName, 
                userId);
            
            if (isDiffCategory) {
                this._updateUser(userId, catTypeName, categoryName);
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


    async _addUser(userId, catTypeName, categoryName) {
        const thisUser = await models.User.findOne({_id: userId}).exec();
        const answers = getCategoryAnswers(thisUser, catTypeName, categoryName);

        this.users[userId] = {
            user: thisUser,
            categoryType: catTypeName,
            category: categoryName,
            answers: answers
        };
    }


    _updateUser(userId, catTypeName, categoryName) {
        this.users[userId].categoryType = catTypeName;
        this.users[userId].category = categoryName;

        const newAnswers = getCategoryAnswers(this.users[userId].user, 
            catTypeName, categoryName);

        this.users[userId].answers = newAnswers;
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