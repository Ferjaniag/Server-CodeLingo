const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors"); // hope it works now
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

const puppeteer = require("puppeteer");

require("dotenv").config();
require("./config/mongoose");
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Upload certificate
// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save files
  },
  filename: (req, file, cb) => {
    // Save the file with the original name and extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Get the original file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Initialize Multer with the storage configuration
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Validate file type (accept only images)
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

app.post("/upload&notify", upload.single("certificate"), (req, res) => {
  console.log("File uploaded:", req.file);
  // File path for the uploaded file
  const filePath = path.resolve(req.file.path);
  console.log("file path", filePath);

  const { reciever, course } = req.body;

  sendCertificateEmail(reciever, course, filePath);
  res.json({ message: "Upload successful", file: req.file });
});

const generateContentCertificate = (user, course, date) => {
  return ` <html>
      <head>
        <style>
         @import url('https://fonts.googleapis.com/css?family=Open+Sans|Pinyon+Script|Rochester');

.cursive {
  font-family: 'Pinyon Script', cursive;
}

.sans {
  font-family: 'Open Sans', sans-serif;
}

.bold {
  font-weight: bold;
}

.block {
  display: block;
}

.underline {
  border-bottom: 1px solid #777;
  padding: 5px;
  margin-bottom: 15px;
}

.margin-0 {
  margin: 0;
}

.padding-0 {
  padding: 0;
}

.pm-empty-space {
  height: 40px;
  width: 100%;
}

body {
 
 padding: 20px 0;
  background: #ccc;
 
}

.pm-certificate-container {
  position: relative;
  width: 800px;
  height: 600px;
  background-color: #1F1244;
  padding: 30px;
  color: #333;
  font-family: 'Open Sans', sans-serif;
  box-shadow: 0 0 5px rgba(0, 0, 0, .5);
  

  .outer-border {
    width: 794px;
    height: 594px;
    position: absolute;
    left: 50%;
    margin-left: -397px;
    top: 50%;
    margin-top:-297px;
    border: 2px solid #35E9BC;
  }
  
  .inner-border {
    width: 730px;
    height: 530px;
    position: absolute;
    left: 50%;
    margin-left: -365px;
    top: 50%;
    margin-top:-265px;
    border: 2px solid #35E9BC;
  }

  .pm-certificate-border {
    position: relative;
    width: 720px;
    height: 520px;
    padding: 0;
    border: 1px solid #E1E5F0;
    background-color: rgba(255, 255, 255, 1);
    background-image: none;
    left: 50%;
    margin-left: -360px;
    top: 50%;
    margin-top: -260px;

    .pm-certificate-block {
      width: 650px;
      height: 150px;
      position: relative;
      left: 50%;
      margin-left: -325px;
      top: 70px;
      margin-top: 0;
    }

    .pm-certificate-header {
      margin-bottom: 10px;
    }

    .pm-certificate-title {
      position: relative;
      top: 40px;

      h2 {
        font-size: 34px !important;
      }
    }

    .pm-certificate-body {
      padding: 20px;

      .pm-name-text {
        font-size: 25px;
      }
    }

    .pm-earned {
      margin: 15px 0 20px;
      .pm-earned-text {
        font-size: 25px;
      }
      .pm-credits-text {
        font-size: 25px;
      }
    }

    .pm-course-title {
      .pm-earned-text {
        font-size: 25px;
      }
      .pm-credits-text {
        font-size: 25px;
      }
    }

    .pm-certified {
      font-size: 12px;

      .underline {
        margin-bottom: 5px;
      }
    }

    .pm-certificate-footer {
      width: 650px;
      height: 100px;
      position: relative;
      left: 50%;
      margin-left: -325px;
      bottom: -150px;
    }
  }
}

        </style>
      </head>
     <body>
  <div class="container pm-certificate-container">
    <div class="outer-border"></div>
    <div class="inner-border"></div>
    
    <div class="pm-certificate-border col-xs-12">
      <div class="row pm-certificate-header">
        <div class="pm-certificate-title cursive col-xs-12 text-center">
          <h2>CodeLinguo application for learning</h2>
        </div>
      </div>

      <div class="row pm-certificate-body">
        
        <div class="pm-certificate-block">
            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                <div class="pm-certificate-name underline margin-0 col-xs-8 text-center">
                  <span class="pm-name-text bold"> ${user}</span>
                </div>
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
              </div>
            </div>          

            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                <div class="pm-earned col-xs-8 text-center">
                  <span class="pm-earned-text padding-0 block cursive">has earned</span>
                  <span class="pm-credits-text block bold sans">a certificate</span>
                </div>
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                <div class="col-xs-12"></div>
              </div>
            </div>
            
            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                <div class="pm-course-title col-xs-8 text-center">
                  <span class="pm-earned-text block cursive">while completing the training course entitled</span>
                </div>
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
              </div>
            </div>

            <div class="col-xs-12">
              <div class="row">
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
                <div class="pm-course-title underline col-xs-8 text-center">
                  <span class="pm-credits-text block bold sans">${course}</span>
                </div>
                <div class="col-xs-2"><!-- LEAVE EMPTY --></div>
              </div>
            </div>
        </div>       
        
        <div class="col-xs-12">
          <div class="row">
            <div class="pm-certificate-footer">
              
                <div class="col-xs-4">
                  <!-- LEAVE EMPTY -->
                </div>
                <div class="col-xs-4 pm-certified col-xs-4 text-center">
                  <span class="pm-credits-text block sans">Date Completed</span>
                 
                  <span class="bold block">${date} </span>
                
                </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</body>
    </html>`;
};

async function htmlToImage(user, course, date) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page to your HTML
  let htmlContent = generateContentCertificate(user, course, date);
  await page.setContent(htmlContent);

  // Convert the content to PNG
  const buffer = await page.screenshot({ type: "png", fullPage: true });
  // Force the content to be a Buffer if it's not
  const pngBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

  await browser.close();
  console.log("TYPE PNGBUFFER ", pngBuffer instanceof Buffer);
  return pngBuffer;
}

app.post("/notify", async (req, res) => {
  console.log("body", req.body);
  const { reciever, course, date, name } = req.body;
  let imageBuffer = await htmlToImage(name, course, date);
  console.log("image buffer before ", imageBuffer instanceof Buffer);
  sendCertificateEmail(reciever, course, imageBuffer);
  res.json({ message: "Notified successful", file: req.file });
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Fonction pour envoyer une notification
const sendCertificateEmail = async (reciever, course, filePath) => {
  console.log("buffer ::", filePath instanceof Buffer);
  try {
    const mailOptions = {
      from: "ferjeniag@gmail.com",
      to: reciever,
      subject: `Your Completion Certificate for ${course} course`,
      html: `
        <h1>Congratulations!</h1>
        <p>You've completed your course. Your certificate is attached.</p>
      `,
      attachments: [
        {
          filename: "certificate.png", // The name shown in the email
          content: filePath, // Relative or absolute path to the file
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail : ", error);
  }
};

// routes
const course_routes = require("./Routes/CourseRoutes");
const unit_routes = require("./Routes/UnitRoute");
const lesson_routes = require("./Routes/LessonRoutes");
const exercise_routes = require("./Routes/ExerciseRoutes");
const quiz_routes = require("./Routes/QuizRoutes");
const question_routes = require("./Routes/QuestionRoutes");
const auth_routes = require("./Routes/AuthRoutes");
const enrollement_routes = require("./Routes/EnrollementRoutes");
const result_routes = require("./Routes/ResultRoutes");
const badge_routes = require("./Routes/BadgeRoutes");
const user_routes = require("./Routes/UserRoutes");
const req = require("express/lib/request");

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(process.env.PORT, () => {
  console.log("App is listening on port", process.env.PORT);
});

//app use
app.use("/hello", (req, res) => {
  res.json({ msg: "Hello it works !!!" });
});
app.use("/", course_routes);
app.use("/", unit_routes);
app.use("/", lesson_routes);
app.use("/", exercise_routes);
app.use("/", quiz_routes);
app.use("/", question_routes);
app.use("/", auth_routes);
app.use("/", enrollement_routes);
app.use("/", result_routes);
app.use("/", badge_routes);
app.use("/", user_routes);
