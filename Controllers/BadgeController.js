const Badge = require("../Models/Badge");
const User = require("../Models/User");
const Quiz = require("../Models/Quiz");
const e = require("../utils/error");

module.exports = {
  awardBadge: async (userId, quizId) => {
    try {
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
        console.error("Quiz not found for ID:", quizId);
        return; // Exit if the quiz doesn't exist
      }

      // Check if a badge already exists for the quiz
      let badge = await Badge.findOne({ quizId });

      // If badge doesn't exist, create a new one
      if (!badge) {
        badge = new Badge({
          badgeName: `Completed ${quiz.quizName}`, // You can customize this
          quizId,
        });
        await badge.save(); // Save the new badge
      }

      const user = await User.findById(userId);

      // Check if the user already has this badge
      const hasBadge = user.badges.some(
        (userBadge) => userBadge.badgeId.toString() === badge._id.toString()
      );
      if (hasBadge) {
        return; // Badge already exists, no need to award again
      }

      // Add the badge to the user's badges array
      user.badges.push({
        badgeId: badge._id,
      });

      await user.save(); // Save the updated user document
    } catch (error) {
      console.error("Error awarding badge:", error);
    }
  },

  getBadgeById: async (req, res) => {
    try {
      const { badgeId } = req.params;
      const badge = await Badge.findById(badgeId);

      if (!badge) {
        return res.status(404).json({ message: "Badge not found" });
      }

      res.status(200).json(badge);
    } catch (error) {
      console.error("Error fetching badge:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
