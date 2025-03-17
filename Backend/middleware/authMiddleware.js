const jwt = require('jsonwebtoken') ;
const {userModel} = require('../models/userModel');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

// Verifying Token
const authenticateUser = async (req,res,next)=>{
    const Authorization = req.headers["authorization"];
    // checking if token exist
    if (!Authorization || !Authorization.startsWith('Bearer ')){
        return res.status(401).json({message:"Unauthorized: No token provided."})
    }
    const token = Authorization.replace("Bearer ","");
    try{
    // Verifying Token: 
        const decodedPayload = jwt.verify(token,secretKey);
        const user = await userModel.findOne({email:decodedPayload.email});
        if(!user){
            return res.status(401).json({message:"Invalid token"})
        }
        req.user = user;
        next()

    }catch(error){
        return res.status(500).json({ message: "Invalid or Expired Token" });
    }
}
module.exports={authenticateUser};