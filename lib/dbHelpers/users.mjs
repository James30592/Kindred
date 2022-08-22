import { User } from "../../models/user.mjs";



// Helper class to search for and provide methods on Users from the Users collection.
export class DBUsers {
  allItems = [];

  // Queries the DB for all users with based on IDs in userIds input array.
  async initUsers(userIds = []) {
    const findCriteria = {$or: []};
    for (let userId of userIds) {
      findCriteria.$or.push({_id: userId});
    };
    this.allItems = await User.find(findCriteria).exec();
  }
}