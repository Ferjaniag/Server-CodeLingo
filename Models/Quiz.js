const mongoose=require('mongoose')


const quizSchema=new mongoose.Schema({
    idCourse : {
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          require:false,
    }, 
    title :{
       type:String,
       require:false
    } , 
    resource :{
        type:String,
        require:false
     } , 
     exercises : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        require:false,
     }]


 })

 module.exports= mongoose.model('Quiz', quizSchema )