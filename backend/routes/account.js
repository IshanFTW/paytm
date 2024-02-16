const express = require('express');
const router = express.Router();
const {User, Account} = require('../db');
const authMiddleware = require('./middleware');
const { default: mongoose } = require('mongoose');

router.get("/balance", authMiddleware, async (req, res) => {
    try{
        const account = await Account.findOne({userId: req.userId})
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json({
            balance: account.balance
        })
    }catch(e){
        res.status(500).send(e.message)
    }
})

router.post("/transfer", authMiddleware, async (req, res) => {
    try{
        const session = await mongoose.startSession();

        session.startTransaction();
        const {amount, to} = req.body;
    
        const account = await Account.findOne({userId: req.userId}).session(session);
    
        if(!account || account.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            })
        }
    
        const toAccount = await Account.findOne({userId: to}).session(session);
    
        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            })
        }
        await Account.updateOne({userId: req.userId}, { $inc: {balance: -amount}}).session(session);
        await Account.updateOne({userId: to}, { $inc: {balance: amount}}).session(session);
    
        await session.commitTransaction();
        res.json({
            message: "Transfer Successful"
        })
    }
    catch(e){
        res.status(500).send(e.message);
    }


})

module.exports = router;