const express = require('express');
const {userModel} = require('../models/userModel')
const userRouter = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('joi')
require('dotenv').config();
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY;

// SignUp Validation
const signUpSchema = Joi.object({
    name:Joi.string().required(),
    password: Joi.string().min(5).max(12).required(),
    email: Joi.string().email() 
})

// POST : SignUp backend Implementation

userRouter.post('/signUp' , async (req , res)=>{
    try{
        const { userId, name , email , password , role} = req.body;
        

        // Checking if user already exists
        const ifExist = await userModel.findOne({email});
        if (ifExist){
            return res.status(400).json({message:'User Already Exists!'})
        }

        // data to validate
        const dataToValidate = {
            name,
            email,
            password
        }
        // Validating signIn requirenment
        const {error,value} = signUpSchema.validate(dataToValidate)
        if (error){
            console.log('Invalid input', error)
            return res.status(400).json({message:'Invalid input'})
        }else{
            // Hashing password 
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password,salt);

            // Adding user into database
            const newUser = { // recording user info
                userId,          
                name,
                email,
                password: hashedPassword,
                role: role || 'patient'  // Default role value should be patient
            }

            // inserting data into 
            const insertedData = await userModel.create(newUser);
            console.log(insertedData)
            
            const payload = {id:insertedData._id,email:email,role:role}
            const token = jwt.sign(payload,secretKey,{expiresIn:'2h'})
            console.log(token)
            res.status(201).json({token})

        }

    }catch(error){
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });

    }

})

// POST : LogIn Backend Implementation 
userRouter.post("/login",async (req,res)=>{
    try{
        const {email , password } = req.body;
        // Checking if User Exist:
        const ifExist = await userModel.findOne({email});

        if (ifExist){
            // Checking if password is valid:
            const IsPasswordValid = await bcrypt.compare(password,ifExist.password)
            if (!IsPasswordValid){
                return res.status(401).json({message:"credentials Invalid"})
            }
            // Generating JWT token when credentials matchs:
            const payload = {id:ifExist._id,email:email,role:ifExist.role}
            const token = jwt.sign(payload,secretKey,{expiresIn:'2h'})
            console.log(token)
            // Sending token and user details
            return res.status(201).json({token})


        }else{
            console.log('User dont exist')
            return res.status(404).json({message:'User Not Found'})

        }

    }catch(error){
        console.error('Error in Login:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})







// Getting All existing users:
userRouter.get('/users',async (req,res)=>{
    try{
        // getting users info except for password
        const users = await userModel.find({},'-password')
        res.status(200).json(users)

    }catch(error){
        console.error("Error Fetching Users", error.message)
        res.status(500).json({message: 'Internal server Error'})

    }
})

module.exports = userRouter;