const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/adminaAuth");
const ConnectionReqModel = require("../models/connectionRequest");
const User = require("../models/user");
// const USER_SAFE_DATA = "firstName lastName   gender age photoUrl about ";
const USER_SAFE_DATA =
  "firstName lastName gender age photoUrl photos about interests location lookingFor verified";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionReqModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName email");
    res.json({
      message: "DATA of recieving data",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

userRouter.get("/user/requests/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await ConnectionReqModel.find({
      status: "accepted",
      $or: [{ toUserId: loggedInUserId }, { fromUserId: loggedInUserId }],
    })
      .populate("fromUserId", "firstName lastName email photoUrl gender age about lookingFor height ")
      .populate("toUserId", "firstName lastName email photoUrl gender age about lookingFor height");

    const connections = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUserId)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "All accepted connections",
      data: connections,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// userRouter.get("/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.page) || 10;

//     const skip = (page - 1) * limit;
//     const connectionRequests = await ConnectionReqModel.find({
//       $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
//     });

//     //   .populate("fromUserId", "firstName")
//     //   .populate("toUserId", "firstName");
//     res.send(connectionRequests);

//     const hideUsersFromFeed = new Set();
//     connectionRequests.forEach((req) => {
//       hideUsersFromFeed.add(req.fromUserId.toString());
//       hideUsersFromFeed.add(req.toUserId.toString());
//     });

//     // console.log(hideUsersFromFeed);

//     const users = await User.find({
//       $and: [
//         { _id: { $nin: Array.from(hideUsersFromFeed) } },
//         { _id: { $ne: loggedInUserId } },
//       ],
//     })
//     //   .select(USER_SAFE_DATA)
//       // .select("fromUserId toUserId")
//       .skip(skip)
//       .limit(limit);
//     // .select("fromUserId toUserId");
//     console.log(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // ✅ FIX 1: correct pagination values
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10; // was using page ❌
    const skip = (page - 1) * limit;

    limit = limit > 10 ? 10 : limit;
    // Step 1: find all users already connected or requested
    const connectionRequests = await ConnectionReqModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    // Step 2: build exclusion set
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((connection) => {
      // renamed from req ✅
      hideUsersFromFeed.add(connection.fromUserId.toString());
      hideUsersFromFeed.add(connection.toUserId.toString());
    });

    // Also exclude logged-in user
    hideUsersFromFeed.add(loggedInUserId.toString());

    // Step 3: fetch feed users with pagination (CORRECT PLACE)
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip) // ✅ pagination applied here
      .limit(limit);

    // ✅ FIX 3: send final response once
    res.json({
      page,
      limit,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;
