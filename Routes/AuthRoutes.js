const authController = require("../Controllers/AuthController");
const Router = require("express");
const router = Router();


router.post("/signup", authController.signup);
router.post("/signin", authController.signin);


module.exports = router;
