const express = require("express");
const app = express();
const bodyParser = require("body-parser");




require("dotenv").config()
require("./config/mongoose")

app.use(bodyParser.json()) 
app.use(cors());
app.use(express.json());

// routes
const course_routes = require("./Routes/CourseRoutes");
const unit_routes = require("./Routes/UnitRoute")

app.get("/", (req, res) => {
  res.send("Hello, world!");
});



app.listen(process.env.PORT, () => {
  console.log("App is listening on port", process.env.PORT);
});

//app use
app.use("/", course_routes);
app.use("/",unit_routes);
