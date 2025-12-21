const express = require("express");
const app = express();
const connectDB = require("./config/databse");
const User = require("./models/user");
const { validateSignUpData } = require("./utilsorHelper/validation");
app.use(express.json());
const bcrypt = require("bcrypt");
//express sends data in json and this reads it json
app.get("/user", async (req, resp) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      resp.status(404).send("NoT fOUND");
    } else {
      resp.send(users);
    }
  } catch {
    resp.status(204).send("wrong");
  }
});
app.get("/feed", async (res, resp) => {
  try {
    const users = await User.find({});
    resp.send(users);
  } catch (error) {
    resp.status(204).send("wrong");
  }
});
// app.get("/delete", async (res, resp) => {
//   try {
//     const userId = User.find(req.body.userId);
//     // resp.send(users);
//     const user = await User.findByIdAndDelete(userId);
//   } catch (error) {
//     resp.status(204).send("wrong");
//   }
// });
app.delete("/delete", async (req, resp) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.body.Id);
    if (!deletedUser) {
      return resp.status(404).send("User not found");
    }
    resp.send("User deleted");
  } catch (error) {
    resp.status(500).send("Server error");
  }
});
app.patch("/patch/:userId", async (req, resp) => {
  try {
    const allowedupdates = ["age", "gender"];
    const isupdateallowed = Object.keys(req.body).every((k) =>
      allowedupdates.includes(k)
    );
    //     const isupdateallowed = Object.keys(req.body).every((k) => {
    //   return allowedupdates.includes(k);
    // });

    if (!isupdateallowed) {
      throw new Error("WRONG UPDATES");
    }
    await User.findByIdAndUpdate(req.params?.userId, req.body, {
      runValidators: true,
    });
    resp.send("Success patched");
  } catch (err) {
    resp.status(500).send("Server hhh error " + err.message);
  }
});

app.post("/signup", async (req, resp) => {
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

app.post("/login", async (req, resp) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return resp.status(404).send("EMAIL NOT FOUND");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return resp.status(401).send("INCORRECT PASSWORD");
    }

    resp.status(200).send("LOGIN SUCCESS");
  } catch (err) {
    resp.status(400).send("ERROR: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connection Established");
    app.listen(3050, () => {
      console.log("Starting Server");
    });
  })
  .catch((err) => {
    console.log(err);
  });
