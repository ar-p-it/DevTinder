const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/adminaAuth");
const { validateEditData } = require("../utilsorHelper/validation");
const bcrypt = require("bcrypt");
// const User = require("../models/user");


profileRouter.get("/profile/view", userAuth, async (req, resp) => {
  try {
    const userbyid = req.user;

    // console.log(userbyid);
    resp.send(userbyid);
  } catch (err) {
    resp.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditData(req);
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    // res.send("Profile updated successfully");
    await user.save();
res.json({
  message: "Profile updated successfully",
  data: user
});

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// profileRouter.patch("/profile/passwordupdate", async (req, res) => {
//   try {
//     const { emailId, password, newpassword } = req.body;

//     if (!emailId || !password) {
//       throw new Error("Email and password are required");
//     }
//     const user = await User.findOne({ emailId });
//     if (!user) {
//       return res.status(404).send("EMAIL NOT FOUND");
//     }

//     const passwordHash = user.password;

//     const isPasswordValid = await bcrypt.compare(password, passwordHash);

//     if (isPasswordValid) {
//       const newpasswordhash = await bcrypt.hash(newpassword, 10);
//       user.password = newpasswordhash;
//       await user.save(); // 🔥 THIS WAS MISSING
//       res.send(`${user.firstName}, password updated successfully`);
//     } else {
//       throw new Error("PASSWORD CHECK FAIL");
//     }
//   } catch (error) {
//     res.status(400).send("ERROR: " + err.message);
//   }
//   //req main password hoga
// });

profileRouter.patch("/profile/passwordupdate", userAuth, async (req, res) => {
  try {
    const { password, newpassword } = req.body;

    if (!password || !newpassword) {
      throw new Error("Old and new passwords are required");
    }

    const user = req.user; // 🔐 trusted user

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Incorrect current password");
    }

    user.password = await bcrypt.hash(newpassword, 10);
    await user.save(); // 🔥 THIS WAS MISSING

    res.send(`${user.firstName}, password updated successfully`);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;

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
