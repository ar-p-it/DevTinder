const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//     },
//     emailId: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       validate(value) {
//         if (!validator.isEmail(value)) {
//           throw new Error("Galt address" + value);
//         }
//       },
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     age: {
//       type: Number,
//     },
//     gender: {
//       type: String,
//     //       enum:{
//     //     values:["male","female","others"],
//     //     message:`${VALUE} is incorrect`
//     // }
//       validate(value) {
//         if (!["male", "female"].includes(value)) {
//           throw new Error("woo");
//         }
//       },
//     },
//     photoUrl: {
//       type: String,
//       default: "https://geographyandyou.com/images/user-profile.png",
//       validate(value) {
//         if (!validator.isURL(value)) {
//           throw new Error("Invalid Photo URL: " + value);
//         }
//       },
//     },
//     about: {
//       type: String,
//       default: "Hey there I am using Devtinfer",
//     },
//   },
//   { timestamps: true }
// );

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },

    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL");
        }
      },
    },

    // 🔥 Multiple photos (Tinder-style)
    photos: {
      type: [String],
      validate(value) {
        value.forEach((url) => {
          if (!validator.isURL(url)) {
            throw new Error("Invalid photo URL in photos array");
          }
        });
      },
    },

    about: {
      type: String,
      default: "Hey there 👋 I am using DevTinder",
      maxlength: 300,
    },

    // 🔥 Interests / hobbies
    interests: {
      type: [String],
      default: [],
    },

    // 🔥 Location info
    location: {
      city: String,
      country: String,
    },

    // 🔥 Dating intent
    lookingFor: {
      type: String,
      enum: ["dating", "friendship", "serious"],
      default: "dating",
    },

    height: {
      type: Number, // in cm
    },

    verified: {
      type: Boolean,
      default: false,
    },

    // 🔥 Swipe logic
    likedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dislikedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function name(params) {
  const user = this;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  const token = await jwt.sign({ _id: user._id }, secret, {
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
