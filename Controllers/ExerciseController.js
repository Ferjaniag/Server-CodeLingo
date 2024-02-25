const Exercise = require('../Models/Exercise') ; 



const getRecentExercises = async (req,res)=>  {

    try {
      
        const recentExercises = await Exercise.find()
            .sort({ createdAt: -1 }) // Sorting by creation date in descending order
            .limit(10); // Limiting to 10 recent exercises
        res.status(200).json(recentExercises);
    } catch (error) {
        console.error("Error fetching recent exercises:", error);
        res.status(500).json({ message: "Failed to fetch recent exercises" });
    }
}


const createExercise = async (req,res)=> {
    try {
        // Extract exercise details from request body
        const { idLesson, type, question, options, response } = req.body;

        // Create exercise document
        const exercise = new Exercise({
            idLesson,
            type,
            question,
            options,
            response
        });

        // Save exercise to the database
        const createdExercise = await exercise.save();

        // Send success response with the created exercise
        res.status(201).json(createdExercise);
    } catch (error) {
        // Handle errors
        console.error("Error creating exercise:", error);
        res.status(500).json({ message: "Failed to create exercise" });
    }
}

const getExerciseByIdEx = async (req,res)=> {
    try {
        const exercise = await Exercise.findById(req.params.Id).populate('idLesson'); // Assuming you want to populate the lesson referenced by idLesson
    
        if (!exercise) {
          return res.status(404).json({ message: 'Exercise not found' });
        }
    
        res.status(200).json(exercise);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
}

const getExerciseByIdLesson = async (req,res)=> {

    const lessonId = req.params.lessonId; 

  try {
    const exercises = await Exercise.find({ idLesson: lessonId });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ message: 'Exercises for this lesson not found' });
    }

    res.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}


module.exports = { createExercise,getRecentExercises,getExerciseByIdEx,getExerciseByIdLesson} ; 
