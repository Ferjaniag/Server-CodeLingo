const Course = require('../Models/Course');

exports.add_course = async (req, res) =>{
    try{
        const {title,description,category,unit} = req.body;
        const data = { title, description, category,unit };
        const new_course = await Course.create(data);
        res.status(200).send(new_course);
    }catch(err){
        res.status(500).send({message:err.message});
    }
}

exports.get_all_courses = async (req, res) =>{
    try{
        await Course.find({})
        .then((courses) => {
            if(courses){
                res.status(200).send(courses);
            }else{
                res.status(404).send("Courses not found");
            }
        })
    }catch(err){
        res.status(500).send({err:err.message});
    }
}


exports.delete_course = async (req, res) => {
    try {
        const result = await Course.findByIdAndDelete({_id: req.params.courseID});
        
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (err) {
        res.status(400).json(err);
    }
}
