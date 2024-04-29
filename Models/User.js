const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },


}, { timestamps: true });


UserSchema.virtual("confirmPassword")
    .get(()=>this._confirmPassword)
    .set(value=>this._confirmPassword=value)

    
const User = mongoose.model("User", UserSchema);

module.exports = User;
