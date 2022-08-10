const express = require('express')
const { demofunction } = require('../controllers/democontroller')
const router = express.Router()


router.get('/hello', (req, res) => {
    res.send("This message is from route.")
})

router.get('./controller', demofunction)

module.exports = router