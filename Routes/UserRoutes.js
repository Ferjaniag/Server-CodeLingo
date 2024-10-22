const userController = require("../Controllers/UserController");
const verifyToken =require("../utils/verifyUser")
const Router = require("express");
const router = Router();


router.post("/signout", userController.signout);
router.patch('/update/:userId',userController.updateUser)
router.delete('/delete/:userId', userController.deleteUser);
router.get('/getusers', userController.getUsers);
router.get('/getuser/:userId', userController.getUser);
router.get('/getuserbadges/:userId', userController.getUserWithBadges);

module.exports = router;
