const mongoose=require('mongoose')


const exerciseSchema=new mongoose.Schema({
   
    idLesson :{
        type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
          require:false,
    } , 
  
   type :{
        type:String,
        require:false
     } , 

     question : {
        type:String,
        require:true  
     } , 
     options :  [{ text: String, checked: Boolean }] , 

     language : {
        type:String , 
        require:false
     } , 
     solution : {
        type:String , 
        require:false
     }
    
   


 })

 module.exports= mongoose.model('Exercise', exerciseSchema )