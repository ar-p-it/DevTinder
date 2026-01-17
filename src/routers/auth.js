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
    // const { firstName, lastName, emailId, password } = req.body;
    // const passwordhash = await bcrypt.hash(password, 10);
    // // console.log(passwordhash);

    // const user = new User({
    //   firstName,
    //   lastName,
    //   emailId,
    //   password: passwordhash,
    // });
    // await user.save();
    const {
  firstName,
  lastName,
  emailId,
  password,
  gender,
  age,
  photoUrl,
  about
} = req.body;

const passwordhash = await bcrypt.hash(password, 10);

const user = new User({
  firstName,
  lastName,
  emailId,
  password: passwordhash,
  gender,   // required
  age,
  photoUrl,
  about
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

// authRouter.post("/login", async (req, resp) => {
//   try {
//     const { emailId, password } = req.body;

//     if (!emailId || !password) {
//       throw new Error("Email and password are required");
//     }

//     const user = await User.findOne({ emailId });
//     if (!user) {
//       return resp.status(404).send("EMAIL NOT FOUND");
//     }

//     // const isPasswordValid = await bcrypt.compare(password, user.password);
//     const isPasswordValid = await user.validatePassword(password);

//     if (!isPasswordValid) {
//       return resp.status(401).send("INCORRECT PASSWORD");
//     }

//     const token = await user.getJWT();
//     // console.log(token);

//     resp.cookie("token", token);
//     // resp.status(200).send("LOGIN SUCCESS");
//     resp.send(user);

//   } catch (err) {
//     resp.status(400).send("ERROR: " + err.message);
//   }
// });


// ✅ NEW CODE (structured error messages)

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // 🔹 Validation
    if (!emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 🔹 User not found
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // 🔹 Password mismatch
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 🔹 Success
    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

// authRouter.post("/logout", async (req, res) => {
//   res.cookie("token", null, {
//     expires: new Date(Date.now()),
//   });
//   res.send("Log out Sucess");
// });

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax", // must match login
    secure: false,   // true in production (https)
    path: "/",       // VERY IMPORTANT
  });

  res.status(200).json({ message: "Logged out successfully" });
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
