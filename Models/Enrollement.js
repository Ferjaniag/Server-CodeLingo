const mongoose=require('mongoose')

const EnrollmentSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,  // Assuming it's mandatory for each enrollment
  },
  idCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,  // Assuming it's mandatory for each enrollment
  },
  overallProgress: {  // Stores total progress as a percentage (0-100)
    type: Number,
    default: 0,
  },
  progress: [
    {
      unitId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Unit', 
        required: true 
      },
      unitCompleted: { 
        type: Boolean, 
        default: false 
      },
      percentage: {  // Tracks progress within each lesson, if applicable
        type: Number, 
        default: 0 
      },
      lessons: [
        {
          lessonId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Lesson', 
            required: true 
          },
          completed: { 
            type: Boolean, 
            default: false 
          },
          percentage: {  // Tracks progress within each lesson, if applicable
            type: Number, 
            default: 0 
          },
          lastAccessed: { 
            type: Date, 
            default: Date.now 
          },
        },
      ],
    },
  ],
  enrolledDate: { 
    type: Date, 
    default: Date.now 
  },
});

// Ensure indexes for efficient querying
EnrollmentSchema.index({ idUser: 1, idCourse: 1 });



module.exports=mongoose.model('Enrollement',EnrollmentSchema)