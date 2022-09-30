import express from "express";
import { serverState } from "../lib/serverState/serverState.mjs";



export const adminRouter = express.Router();

adminRouter.get("/", async function(req, res){
  res.render("pages/admin");
});

adminRouter.post("/:adminRequest", async function(req, res){
  if (req.params.adminRequest === "createAutoUsers") {
    const numNewUsers = req.body.numNewUsers;

    const currDBCategories = serverState.allCategories;
    const currDBQuestions = await models.CategoryQuestionsList.find({}).exec();
    const batchUserMaker = new admin.BatchUserCreator(currDBCategories, 
      currDBQuestions);

    const resultMsg = batchUserMaker.createUsers(numNewUsers);

    res.json(resultMsg);
  };
});