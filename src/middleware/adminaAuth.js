const adminAuth = (req, resp, next) => {
  console.log("Check authh");
  const token = "xyz";
  const isauthorised = token === "xyz";
  if (!isauthorised) {
    req.send("ERROR");
  } else {
    console.log("Passing to next");
    next();
  }
};
const userAuth = (req, resp, next) => {
  console.log("Check authh");
  const token = "xyz";
  const isauthorised = token === "xyz";
  if (!isauthorised) {
    req.send("ERROR");
  } else {
    console.log("Passing to next");
    next();
  }
};
module.exports = {
  adminAuth,userAuth
};
