const express = require("express");
const app = express();
const connectDB = require("./config/databse");
const User = require("./models/user");

app.post("/signup", async (req, resp) => {
  const userObj = {
    firstName: "Arpit",
    lastName: "Kesari",
    emailId: "nahidunga@gmail.com",
    password: "12345678",
    // age: 23,
    // gender: "Female",
  };
  //* creating new instance of usermodel
  const user = new User(userObj);
  await user.save();
  resp.send("User added")
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
