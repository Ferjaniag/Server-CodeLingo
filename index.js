const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors())

require("dotenv").config()
require("./config/mongoose")



app.use(express.json());

// routes
const course_routes = require("./Routes/CourseRoutes");

app.get("/", (req, res) => {
  res.send("Hello, world!");
});



app.listen(process.env.PORT, () => {
  console.log("App is listening on port", process.env.PORT);
});

//app use
app.use("/", course_routes);
