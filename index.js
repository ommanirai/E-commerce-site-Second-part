const express = require('express')
require('dotenv').config()
const db = require('./database/connection')

const app = express()

const port = process.env.PORT || 8000

const bodyparser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')



const DemoRoute = require('./routes/demoroute')
const CategoryRoute = require('./routes/categoryRoute')
const ProductRoute = require('./routes/productRoute')
const UserRoute = require('./routes/userRoute')
const OrderRoute = require('./routes/orderRoute')
const paymentRoute = require('./routes/paymentRoute')


app.use(bodyparser.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors()) // for external connection like to connect React and Express

app.use('/api', DemoRoute)
// app.use(DemoRoute)
app.use('/api', CategoryRoute)
app.use('/api', ProductRoute)
app.use('/api', UserRoute)
app.use('/api', OrderRoute)
app.use('/api', paymentRoute)

app.use('/public/uploads', express.static('public/uploads'))

app.get('/', (request, response) => {
    response.send("Good Evening. Welcome to Express JS.")
})


app.get('/welcome', (req, res) => {
    res.send("This is express js.")
})

app.listen(port, () => {
    console.log(`app started at port ${port}`)
})