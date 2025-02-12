const mongoose = require('mongoose')

mongoose.connect(
    "mongodb+srv://ishanjindal2003:Ishjin2003@ishan.c26veqy.mongodb.net/Paytm"
)

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }

})

const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountSchema)

module.exports = {User, Account}