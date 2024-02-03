const mongoose=require('mongoose')


const questionSchema=new mongoose.Schema({
    idCourse : {
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          require:false,
    }, 
  
    idQuiz :{
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Quiz',
          require:false,
    } , 
    idExercise :{
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          require:false,
    } , 
    
    content :{
        type:String,
        require:false
     } , 
    
     answer :{
        type:String,
        require:false
     } , 


 })

 module.exports= mongoose.model('Question', questionSchema )