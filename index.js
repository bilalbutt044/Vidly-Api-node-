require('express-async-errors');


const express = require("express");
const app = express();

require('./startup/routes.js')(app);
require('./startup/db.js')();
require('./startup/validation');
require('./startup/config')(app);
require('./startup/prod.js')(app);


app.use(express.static("public"));



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
