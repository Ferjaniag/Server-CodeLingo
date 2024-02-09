const mongoose = require('mongoose')
const dbName=process.env.DBName

mongoose.connect(`mongodb://127.0.0.1/${dbName}`)
    .then(()=>console.log( `connected to database ${dbName}`))
    .catch(err => console.log(err))