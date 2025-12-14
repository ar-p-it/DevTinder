const express = require("express");

const app = express();

app.listen(3050, () => {
  console.log("HIHIIHIHIHI");
});
app.use("/test", (requess, respp) => {
  respp.send("Samina wani");
});
