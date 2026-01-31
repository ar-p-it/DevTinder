const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/adminaAuth");
const ConnectionReqModel = require("../models/connectionRequest");
const User = require("../models/user");

// const sendEmail = require("../utils/sendEmail");
const sendEmail = require("../utilsorHelper/sendEmail");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Not valid request : " + status });
      }
      const statusMessages = {
        interested: "Connection request sent",
        ignored: "Connection request ignored",
        accepted: "Connection accepted",
        rejected: "Connection rejected",
      };
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingConnectionRequest = await ConnectionReqModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Already exists " + status });
      }

      const connectionRequest = new ConnectionReqModel({
        fromUserId,
        toUserId,
        status,
      });

      // console.log("Sending Connection request");
      const data = await connectionRequest.save();

      let emailRes;
      try {
        emailRes = await sendEmail.run(
          "A new friend request from " + req.user.firstName,
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        );
        console.log("Email sent:", emailRes);
      } catch (emailErr) {
        console.error("Email failed:", emailErr.message);
      }

      res.json({
        // message: "DONE CONNECTION",
        message: statusMessages[status],
        data,
      });

      // res.send(userr.firstName + " HAS SEND TEH REQUEST FOR CONNECTION");
    } catch (err) {
      res.status(404).send("Error: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      // const { status, reqId } = req.params;
      const { status, requestId } = req.params;

      const allowedStatus = ["rejected", "accepted"];

      if (!allowedStatus.includes(status)) {
        // throw new Error("invalid req");
        return res.status(400).json({ message: "Invalid req" });
      }
      const connectionRequest = await ConnectionReqModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        // throw new Error("invalid req");
        return res.status(404).json({ message: "Connection Not Found" });
      }

      connectionRequest.status = status;
      res.json({ message: "Connection " + status + " is succesfull" });
      const datasave = await connectionRequest.save();
    } catch (err) {
      res.status(404).send("Error: " + err.message);
    }
  },
);
module.exports = requestRouter;
