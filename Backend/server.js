const express = require('express');
const {connection} = require('./config/db')
require('dotenv').config();
const port = process.env.PORT || 3000;
const cors = require('cors');
const userRoutes = require('../Backend/routes/userRoutes')


const app = express();
app.use(express.json());
app.use(cors())

// Routes:
app.use('/',userRoutes)

// 
app.get('/',(req,res)=>{
    res.send('Claims managament Platform')
})


// 
app.listen(port, async()=>{
    // connecting to mongodb
    try{
        await connection
        console.log("Connected to DB Successfully!")
    }catch(error){
        console.log(`MongoDB Connection Failed:${error.message}`)
    }
console.log(`Server is running on port ${port}`)})
