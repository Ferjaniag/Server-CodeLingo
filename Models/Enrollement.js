const mongoose=require('mongoose')

const EnrollementSchema=new mongoose.Schema({
    idUser : {
        type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          require:false,
    }, 
    progress :{
       type:mongoose.Types.Decimal128,
       require:false
    } , 
    idCourse : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        require:false,
    },

})



module.exports=mongoose.model('Enrollement',EnrollementSchema)