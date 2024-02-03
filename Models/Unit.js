const mongoose=require('mongoose')

const unitSchema=new mongoose.Schema({
    idCourse : {
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          require:false,
    }, 
  
    title :{
       type:String,
       require:false
    } , 
    lessons : [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        require:false,
    }] , 
    quizId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        require:false,
    } ,

})


module.exports=mongoose.model('Unit',unitSchema)