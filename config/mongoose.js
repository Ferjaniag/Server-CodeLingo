const mongoose = require("mongoose");
const dbName = process.env.DB_URL;

mongoose
  .connect(dbName)
  .then(() => console.log(`connected to database `))
  .catch((err) => console.log(err));
