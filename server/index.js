const app = require('express')();

require('./middlewares/middleware')(app); //set middleware

require('./routes/router')(app); //set route

const { connection } = require('./services/pg');

// require('dotenv').config();

const port = process.env.PORT || 3000;

connection();

app.listen(port, () => console.log('Server listening on port ' + port));
