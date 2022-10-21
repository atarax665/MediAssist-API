const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const {MONGOURI} = require('./config/keys')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

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
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

 app.listen(PORT,()=>{
    console.log("Server is running on", PORT)
    app.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            setTimeout(() => {
                server.close();
                server.listen(PORT);
            }, 1000);
        }
    }
    )
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        console.log(`Logged Error: ${err}`);
        server.close(() => process.exit(1));
    }
    )
 })