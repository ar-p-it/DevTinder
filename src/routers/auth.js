const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const { validateSignUpData } = require("../utilsorHelper/validation");
const bcrypt = require("bcrypt");
// const { userAuth } = require("./middleware/adminaAuth");
authRouter.post("/signup", async (req, resp) => {
  // const userObj = {
  // firstName: "Arpit",
  // lastName: "NOKesari",
  // emailId: "nahidunga@gmail.com",
  // password: "12345678",
  //   // age: 23,
  //   // gender: "Female",
  // };
  // //* creating new instance of usermodel
  try {
    //!DATA validation
    //!Encrypt the password
    //!UTILITY FUNCTION OR HEPER FUNCTION TO DO IT
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10);
    // console.log(passwordhash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
    });
    await user.save();

    resp.status(201).send("User added successfully");
  } catch (error) {
    resp.status(400).send(error.message);
  }

  // console.log(req.body);

  // const user1= new User({
  //   firstName: "Arpit",
  //   lastName: "Kesari",
  //   emailId: "nahidunga@gmail.com",
  //   password: "12345678",
  //   // age: 23,
  //   // gender: "Female",
  // });
});

authRouter.post("/login", async (req, resp) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return resp.status(404).send("EMAIL NOT FOUND");
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return resp.status(401).send("INCORRECT PASSWORD");
    }

    const token = await user.getJWT();
    console.log(token);

    resp.cookie("token", token);
    resp.status(200).send("LOGIN SUCCESS");
  } catch (err) {
    resp.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRouter;


// const express = require("express");
// const bcrypt = require("bcrypt");
// const authRouter = express.Router();

// const User = require("../models/user");
// const { validateSignUpData } = require("../utilsorHelper/validation");

// authRouter.post("/signup", async (req, resp) => {
//   try {
//     validateSignUpData(req);

//     const { firstName, lastName, emailId, password } = req.body;
//     const passwordhash = await bcrypt.hash(password, 10);

//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordhash,
//     });

//     await user.save();
//     resp.status(201).send("User added successfully");
//   } catch (error) {
//     resp.status(400).send(error.message);
//   }
// });

// authRouter.post("/login", async (req, resp) => {
//   try {
//     const { emailId, password } = req.body;

//     if (!emailId || !password) {
//       throw new Error("Email and password are required");
//     }

//     const user = await User.findOne({ emailId });
//     if (!user) return resp.status(404).send("EMAIL NOT FOUND");

//     const isPasswordValid = await user.validatePassword(password);
//     if (!isPasswordValid) return resp.status(401).send("INCORRECT PASSWORD");

//     const token = await user.getJWT();
//     resp.cookie("token", token);
//     resp.send("LOGIN SUCCESS");
//   } catch (err) {
//     resp.status(400).send("ERROR: " + err.message);
//   }
// });

// module.exports = authRouter;
