const express = require("express");
const profileRouter = express.Router();

// const connectDB = require("./config/databse");
// const User = require("./models/user");
// const { validateSignUpData } = require("./utilsorHelper/validation");

// const bcrypt = require("bcrypt");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/adminaAuth");

profileRouter.get("/profile", userAuth, async (req, resp) => {
  try {
    const userbyid = req.user;

    console.log(userbyid);
    resp.send(userbyid);
  } catch (err) {
    resp.status(400).send("ERROR: " + err.message);
  }
});

module.exports=profileRouter;

// const express = require("express");
// const profileRouter = express.Router();
// const { userAuth } = require("../middleware/adminaAuth");

// profileRouter.get("/profile", userAuth, async (req, resp) => {
//   try {
//     resp.send(req.user);
//   } catch (err) {
//     resp.status(400).send("ERROR: " + err.message);
//   }
// });

// module.exports = profileRouter;
