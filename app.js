const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');

const app = express();
const port = process.env.PORT || 8000;
const router = require("./config/routes");

let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/edsserver';

mongoose.connect(mongoUri);


// app.set("view engine", "ejs");
// app.set("views", `${__dirname}/views`);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));



app.use("/api", router);
app.use(express.static(`${__dirname}/public`));

app.listen(port, () => console.log(`Running on port: ${port}`));
