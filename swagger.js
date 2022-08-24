const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/auth.js', './routes/post.js']

swaggerAutogen(outputFile, endpointsFiles)