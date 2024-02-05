const express = require('express');
const router = express.Router();
const {User} = require('../db')


router.post('/signup', async (req, res) => {
    try{
        const {firstName, lastName, userName, password} = req.body;
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
            res.status(200).json({message: "Signed Up"})
        }
        
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router;