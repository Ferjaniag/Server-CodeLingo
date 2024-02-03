const mongoose=require('mongoose')


const lessonSchema=new mongoose.Schema({
    idUnit : {
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Unit',
          require:false,
    }, 
  
    type :{
       type:String,
       require:false
    } , 
    
     questions : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        require:false,
     }]


 })

 module.exports= mongoose.model('Lesson', lessonSchema )








