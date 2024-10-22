const badgeController = require("../Controllers/BadgeController");
const Router = require("express");
const router = Router();

router.post("/awardbadge", badgeController.awardBadge);
router.get("/getBadgeById/:badgeId", badgeController.getBadgeById);


module.exports = router;
