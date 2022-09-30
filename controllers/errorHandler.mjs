// Generic error handler function.
export function errHandler(err, req, res, next) {
  console.log(err);
  res.status(500).render("pages/error")
}