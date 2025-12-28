const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/adminaAuth");

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  const userr = req.user;
  console.log("Sending Connection request");
  res.send(userr.firstName + " HAS SEND TEH REQUEST FOR CONNECTION");
});

module.exports = requestRouter;
 

