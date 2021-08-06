const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const {MONGOURI} = require('./config/keys')


mongoose.connect(MONGOURI,{
 useNewUrlParser: true,
 useUnifiedTopology: true
})
 .then(() => console.log("Connected to MongoDB Successfully"))
 .catch(err => console.error('Oops, could not connect to mongoDB', err))

require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

 app.listen(PORT,()=>{
     console.log("Server is up at ",PORT)
 })