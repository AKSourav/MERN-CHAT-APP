const express=require("express");
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const {notFound,errorHandler} =require('.//middleware/errorMiddleware')

const app=express();
dotenv.config();

connectDB();  // This should be after dotenv.config();

app.use(express.json()); // to accept JSON Data

app.get('/', (req,res)=>{
    res.send("API is Running");
});

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)

//error handling for invalid routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server Started on PORT ${PORT}`.yellow.bold));