const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
"mongodb+srv://mainarpithoon_db_user:dDujPRJoIEgzLFYV@clusteron6jan.jqnrnkc.mongodb.net/devTinder"
  );
  // dDujPRJoIEgzLFYV
};

 module.exports = connectDB;