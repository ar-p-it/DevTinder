// const mongoose = require("mongoose");

// const connectionRequestSchema = new mongoose.Schema(
//   {
//     fromUserId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     toUserId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,

//       enum: {
//         values: ["accepted", "rejected", "ignored", "interested"],
//         message: `${VALUE} is incorrect`,
//       },
//     },
//   },
//   { timestamps: true }
// );

// const ConnectionReqModel = new mongoose.model(
//   "connectionRequest",
//   connectionRequestSchema
// );

// module.exports=ConnectionReqModel;
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: "{VALUE} is incorrect",
      },
    },
  },
  { timestamps: true }
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("CANT SEND TO URSELF");
  }
  next();
});
const ConnectionReqModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionReqModel;
