const express = require("express");
const app = express();
const connectDB = require("./config/databse");
const User = require("./models/user");
const { validateSignUpData } = require("./utilsorHelper/validation");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/adminaAuth");
//express sends data in json and this reads it json
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// connectDB()
//   .then(() => {
//     console.log("Connection Established");
//     // app.listen(3050, () => {console.log("Starting Server");});
//     app.listen(3050, () => console.log("Server running on 3050"));
//   })
//   .catch((err) => {
//     console.log(err);
//   });
connectDB()
  .then(() => {
    console.log("DB Connected");
    app.listen(3050, () => console.log("Server running on 3050"));
  })
  .catch(console.error);

//   const express = require("express");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./config/databse");

// const authRouter = require("./routers/auth");
// const profileRouter = require("./routers/profile");
// const requestRouter = require("./routers/requests");

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);

// connectDB()
//   .then(() => {
//     console.log("DB Connected");
//     app.listen(3050, () => console.log("Server running on 3050"));
//   })
//   .catch(console.error);
