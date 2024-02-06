const express = require('express');
const router = express.Router();
const {User} = require('../db');
const zod = require('zod');
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('./config')

const signupSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    userName: zod.string(),
    password: zod.string()
})

router.post('/signup', async (req, res) => {
    try{
        const {firstName, lastName, userName, password} = req.body;
        const {success} = signupSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                message: "Incorrect inputs"
            })
        }
        const existingUser = await User.findOne({userName: userName});
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }else{
            const user = await User.create({
                firstName: firstName,
                lastName: lastName,
                userName : userName,
                password: password

            })
        }
        const userId = User._id;

        const token = jwt.sign({userId}, JWT_SECRET);
        res.json({
            message: "User Created Successful",
            token: token
        })
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.post('/signin', async (req, res) => {
    try{
        const {userName, password} = req.body;
        const existingUser = await User.findOne({userName: userName, password: password});
        if (existingUser){
            const userId = User._id;
            const token = jwt.sign({userId}, JWT_SECRET);
            res.status(200).json({
                token: token
            })
        }
    }catch(e){
        res.status(500).send(e.message)
    }


})

module.exports = router;