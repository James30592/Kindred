import express from "express";



export const defaultRouter = express.Router();

const NO_LOGIN_ROUTES = [
  "/",
  "/login",
  "/register",
  "/logout"
];

const NO_LOGIN_ROUTE_PREFIXES = [
  "/auth"
];

defaultRouter.get("*", function(req, res, next) {
  const isNoLoginRoute = NO_LOGIN_ROUTES.includes(req.originalUrl);
  const hasNoLoginPrefix = checkStartsNoLoginRoute(req.originalUrl);
  const noAuthenticationReqd = isNoLoginRoute || hasNoLoginPrefix;

  const userIsAuthenticated = req.isAuthenticated();

  if (noAuthenticationReqd) {
    return next();
  }

  else if (userIsAuthenticated) {
    res.locals.user = req.user;
    const userSetupComplete = req.user.setupComplete;
    
    // if (userSetupComplete) {
    if (userSetupComplete || req.originalUrl === "/completeOAuthAcct") {
      next();
    }
    else {
      res.redirect("/completeOAuthAcct");
    };
  }

  else {
    res.redirect("/login");
  };
});

function checkStartsNoLoginRoute(url) {
  return NO_LOGIN_ROUTE_PREFIXES.some(prefix => url.startsWith(prefix));
}