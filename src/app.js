const express = require("express");
const app = express();
const connectDB = require("./config/databse");
const User = require("./models/user");

app.use(express.json());
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
  const user = new User(req.body);
  // const user = new User(userObj);
  await user.save();
  resp.send("User added");

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
