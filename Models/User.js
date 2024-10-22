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
    badges: [{
        badgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Badge", 
            required: true,
        },
        dateAwarded: {
            type: Date,
            default: Date.now,
        },
    }],


}, { timestamps: true });


UserSchema.virtual("confirmPassword")
    .get(()=>this._confirmPassword)
    .set(value=>this._confirmPassword=value)

    
const User = mongoose.model("User", UserSchema);

module.exports = User;
