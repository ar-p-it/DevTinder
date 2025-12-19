const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mainarpithoon_db_user:vuXtved6drJjrJfH@cluster0.j4iylwl.mongodb.net/HelloWorld"
  );
};

 module.exports = connectDB;