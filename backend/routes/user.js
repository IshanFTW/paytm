const express = require('express');
const router = express.Router();
const {User, Account} = require('../db');
const zod = require('zod');
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('./config')
const authMiddleware = require('./middleware');

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
        }
            const user = await User.create({
                firstName: firstName,
                lastName: lastName,
                userName : userName,
                password: password

            })
        
        const userId = user._id;

        await Account.create({
            userId,
            balance: 1 + Math.random()*10000
        })

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
            const userId = existingUser._id;
            const token = jwt.sign({userId}, JWT_SECRET);
            res.status(200).json({  
                token: token
            })
        }
    }catch(e){
        res.status(500).send(e.message)
    }
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/' ,authMiddleware ,async (req, res) => {
    try{
        const {success} = updateBody.safeParse(req.body);
        if(!success){
            res.status(411).json({message: "Error while updating information"})
        }
        await User.updateOne(req.body, {
            _id: req.userId
        })
       
    }catch(e){
        return res.status(400).send(e.message);
    }
    res.status(200).json({message: "Updated successfully"})

})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;