const express = require("express");

const app = express();

app.listen(3050, () => {
  console.log("Starting Server");
});

app.post("/test", (requess, respp) => {
  respp.send(" wani");
  console.log("Post done");
});

app.get("/test", (req, res) => {
  console.log(req.query);
  res.send("GG");
});
