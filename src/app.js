const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middleware/adminaAuth");
app.listen(3050, () => {
  console.log("Starting Server");
});

app.post("/test", (requess, respp) => {
  respp.send(" wani");
  console.log("Post done");
});
app.use("/admin", adminAuth);
app.get("/admin/data", (req, res, next) => {
  try {
    throw new Error("Admin data error");
  } catch (err) {
    next(err); // pass error to Express
  }
});

app.use("/", (err, req, resp, next) => {
  resp.send("Some");
});
app.get(
  "/user",
  userAuth,
  (req, res, next) => {
    console.log(req.query);
    next();
    // res.send("GG");
  },
  (req, res, next) => {
    console.log(req.query);
    // res.send("GGA");
    next();
  },
  (req, res, next) => {
    console.log(req.query);
    res.send("GGB");
  }
);
