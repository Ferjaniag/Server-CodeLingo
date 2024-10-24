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
const quiz_routes= require("./Routes/QuizRoutes");
const question_routes= require("./Routes/QuestionRoutes");
const auth_routes= require("./Routes/AuthRoutes");
const enrollement_routes=require('./Routes/EnrollementRoutes');
const result_routes= require("./Routes/ResultRoutes");
const badge_routes= require("./Routes/BadgeRoutes");
const user_routes= require("./Routes/UserRoutes");

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
app.use("/", quiz_routes);
app.use("/", question_routes);
app.use("/", auth_routes);
app.use("/",enrollement_routes);
app.use("/", result_routes);
app.use("/", badge_routes);
app.use("/", user_routes);

