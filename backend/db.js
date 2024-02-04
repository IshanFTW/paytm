const mongoose = require('mongoose')

mongoose.connect(
    "mongodb+srv://ishanjindal2003:Ishjin2003@ishan.c26veqy.mongodb.net/Paytm"
)

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
})

const User = mongoose.model("User", userSchema)

module.exports = {User}