const Result = require("../Models/Result");
const e = require("../utils/error");
const badgeController = require("../Controllers/BadgeController");

module.exports = {

        getAllResults: async (req, res, next) => {
            const { quizId } = req.params;
            try {
            const results = await Result.find({ quizId });
            res.status(200).json(results);
            } catch (error) {
            next(error);
            }
        },
        
        getUserResults: async (req, res, next) => {
            const { userId } = req.params;
            try {
            const results = await Result.find({ userId });
            res.status(200).json(results);
            } catch (error) {
            next(error);
            }
        },
        
        getOneResult: async (req, res, next) => {
            try {
            const { quizId, userId } = req.params;
            const result = await Result.findOne({ quizId, userId });
            if (!result) {
                return next(e.errorHandler(404, "Result not found"));
            }
            res.status(200).json(result);
            } catch (error) {
            next(error);
            }
        },

        createResult: async (req, res, next) => {
            try {
                const { quizId, userId, points, answers, resultStatus, quizName } = req.body;
        
                const existingResult = await Result.findOne({ quizId, userId });
        

                if (existingResult) {
                    return res.status(200).json(existingResult);
                }
        

                const newResult = new Result({
                    quizId,
                    quizName,
                    userId,
                    points,
                    answers,
                    resultStatus
                });
                const savedResult = await newResult.save();
                // Check if the result status is 'Success' to award a badge
                if (resultStatus === "Success") {
                    await badgeController.awardBadge(userId, quizId); // Award the badge
                }
                res.status(201).json(savedResult);
            } catch (error) {
                next(error);
            }
        },
        
        
        updateresult: async (req, res, next) => {
            try {
                const { userId, quizId } = req.params;
                const { points, answers, resultStatus } = req.body;
        
                // Check if the result exists
                const result = await Result.findOne({ userId, quizId });
                if (!result) {
                    return next(e.errorHandler(404, "Result not found"));
                }
        
                // Update the result
                const updatedResult = await Result.findByIdAndUpdate(
                    result._id,
                    {
                        $set: {
                            points,
                            answers,
                            resultStatus,
                        },
                    },
                    { new: true }
                );
                if (resultStatus === "Success") {
                    await badgeController.awardBadge(userId, quizId); // Award the badge
                }
        
                res.status(200).json(updatedResult);
            } catch (error) {
                next(error);
            }
        },
};
