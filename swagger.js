const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    title: 'C4 Forum',
    description: 'Description'
  },
  host: 'localhost:3000',
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'X-API-KEY', // name of the header, query parameter or cookie
      description: 'Some description...'
    }
  }
}

const outputFile = './swagger-output.json'
const routes = ['./routes/apis/index.js']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)
