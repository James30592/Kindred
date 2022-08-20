import express from "express";



export const adminRouter = express.Router();

adminRouter.get("/", async function(req, res){
  res.render("admin");
});

adminRouter.post("/:adminRequest", async function(req, res){
  if (req.params.adminRequest === "createAutoUsers") {
    const numNewUsers = req.body.numNewUsers;

    const currDBCategories = await models.CategoryType.find({}).exec();
    const currDBQuestions = await models.CategoryQuestionsList.find({}).exec();
    const batchUserMaker = new admin.BatchUserCreator(currDBCategories, 
      currDBQuestions);

    const resultMsg = batchUserMaker.createUsers(numNewUsers);

    res.json(resultMsg);
  };
});