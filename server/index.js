const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UsersModel = require("./models/users");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/clinic");

app.post('/register', (req, res) => {
    UsersModel.create(req.body)
        .then(clinic => res.json(clinic))
        .catch(err => res.json(err));
});

app.post('/login', (req, res) => {
    const {email,password} = req.body;
    console.log('hello')
   UsersModel.findOne({emailAddress:email})
   .then(user=>{
    if(user){
        console.log(user.phoneNumber)
        if(user.phoneNumber==password){
            res.json("Success")
        } else{
            res.json("Password incorrect")
        }
    } else{
        res.json("email isn't registered")
    }
   })
});

app.listen(3001, () => {
    console.log("Server is running");
});
