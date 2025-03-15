const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {type:String,required : true , unique : true},
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: {type: String, enum: ['patient','insurer'] , required:true},
})


mongoose.pluralize(null)
const userModel = mongoose.model("User",userSchema)
module.exports= {userModel}