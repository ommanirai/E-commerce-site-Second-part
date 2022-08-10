const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')
const jwt = require('jsonwebtoken')
const { expressjwt } = require('express-jwt')

exports.addUser = async (req, res) => {
    // check if email already exists
    let user = await User.findOne({ email: req.body.email })
    // if not then add user
    if (!user) {
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        // generate token and send in email
        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            user: user._id
        })
        token = await token.save()
        if (!token) {
            return res.status(400).json({ error: "Failed to generate token. Something went wrong" })
        }
        // const url = `http://localhost:5000/api/confirmuser/${token.token}`
        const url = `${process.env.FRONTEND_URL}/confirmuser/${token.token}`

        // send email
        sendEmail({
            from: "noreply@ourstore.com",
            to: user.email,
            subject: "Verification/Confirmation email",
            text: `Please click on the following link to verify your account. ${token.token}`,
            html: `<a href = ${url}><button> Verify Account </button></a>`

        })

        user = await user.save()
        if (!user) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.send(user)
    }
    else {
        return res.status(400).json({ error: "User/Email already exists." })
    }
}


exports.confirmUser = async (req, res) => {
    const token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "TOKEN not found or may have expired." })
    }
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified. Login to continue" })
    }
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Failed to verify" })
    }
    return res.status(200).json({ error: "User verified successfully" })
}


// resend confirmation
exports.resendConfirmation = async (req, res) => {
    //check if email exists or not
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email is not registered, Please register" })
    }
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified" })
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "Failed to generate token. Something went wrong" })
    }
    const url = `${process.env.FRONTEND_URL}/confirmuser/${token.token}`
    // send email
    sendEmail({
        from: "noreply@ourstore.com",
        to: user.email,
        subject: "Verification/Confirmation email",
        text: `Please click on the following link to verify your account. ${token.token}`,
        html: `<a href = ${url}><button> Verify Account </button></a>`

    })
    res.status(200).json({ error: "Verification link has been sent to your email." })
}

//forget password
exports.forgetPassword = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered. Please register" })
    }
    // generate token and send in email
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "Failed to generate token. Something went wrong" })
    }
    const url = `${process.env.FRONTEND_URL}/resetpassword/${token.token}`

    // send email
    sendEmail({
        from: "noreply@ourstore.com",
        to: user.email,
        subject: "Password Reset Link",
        text: `Please click on the following link to Reset your password. ${token.token}`,
        html: `<a href = ${url}><button> RESET PASSWORD </button></a>`

    })
    res.status(200).json({ error: "Password Reset Link has been sent to your email" })
}


//reset password
exports.resetPassword = async (req, res) => {
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Token Not Found or Token May Have Expired" })
    }
    let user = await User.findOne({ _id: token.user })
    if (!user) {
        return res.status(400).json({ error: "User Not Found" })
    }
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Failed to Save Password" })
    }
    return res.status(200).json({ error: "Password Reset Successfully" })
}

// signin
exports.signin = async (req, res) => {
    const { email, password } = req.body

    let user = await User.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: "Incorrect Password. PLease try again" })
    }
    if (!user.isVerified) {
        return res.status(400).json({ error: "Email not verified. Please verify your account" })
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    res.cookie('myCookie', token, { expire: Date.now() + 86000 })

    const { _id, username, role } = user
    res.json({ token, user:{_id, username, role, email }})
}

// user list
exports.userList = async (req, res) => {
    let users = await User.find().select('-hashed_password').select('-salt')
    if (!users) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(users)
}

// user detail
exports.userDetails = async (req, res) => {
    let user = await User.findById(req.params.id).select('-hashed_password').select('-salt')
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(user)
}

// find user by email
exports.findUserByEmail = async (req, res) => {
    let user = await User.findOne({ email: req.body.email }).select('-hashed_password').select('-salt')
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    res.send(user)
}

// update user
exports.updateUser = async (req, res) => {
    let user = await User.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }, { new: true })
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(user)
}

// delete user
exports.deleteUser = async (req, res) => {
    let user = await User.findByIdAndRemove(req.params.id)
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    else {
        return res.status(200).json({ error: "User daleted successfully" })
    }
}

// for authorization
exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})