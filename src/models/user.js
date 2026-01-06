const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Galt address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    //       enum:{
    //     values:["male","female","others"],
    //     message:`${VALUE} is incorrect`
    // }
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("woo");
        }
      },
    },
    about: {
      type: String,
      default: "Hey there I am using Devtinfer",
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function name(params) {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Arpitttt", {
    expiresIn: "7D",
  });
  return token;
};
userSchema.methods.validatePassword = async function name(password) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(password, passwordHash);
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);

// const userModel=mongoose.model("User",userSchema);
// module.exports=userModel;
//* schema banane k baad model banate hai "model ka naam",schema =>this is how we create usermodel
