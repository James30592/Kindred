import express from "express";
import { BatchUserCreator } from "../lib/admin.mjs";
import { serverState } from "../lib/serverState/serverState.mjs";



export const adminRouter = express.Router();

adminRouter.get("/", async function(req, res) {
  const renderPage = req.user.isAdmin ? "pages/admin" : "pages/profile";
  res.render(renderPage);
});

adminRouter.post("/:adminRequest", async function(req, res) {
  if (!req.user.isAdmin) res.end();

  if (req.params.adminRequest === "createAutoUsers") {
    const numNewUsers = req.body.numNewUsers;

    const allDBCategories = serverState.allCategories;
    const batchUserMaker = new BatchUserCreator(allDBCategories);

    const resultMsg = await batchUserMaker.createUsers(numNewUsers);

    res.json(resultMsg);
  };
});