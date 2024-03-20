const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors"); // hope it works now

require("dotenv").config();
require("./config/mongoose");


app.use(bodyParser.json()) 
app.use(cors());
app.use(express.json());

// routes
const course_routes = require("./Routes/CourseRoutes");
const unit_routes = require("./Routes/UnitRoute");
const lesson_routes = require("./Routes/LessonRoutes");
const exercise_routes= require("./Routes/ExerciseRoutes");

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(process.env.PORT, () => {
  console.log("App is listening on port", process.env.PORT);
});

//app use
app.use("/", course_routes);
app.use("/", unit_routes);
app.use('/', lesson_routes);
app.use("/",exercise_routes) ;

