const path = require('path');
const express = require('express');
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const route = require('./routes');

// connect to mongoose 
const db = require('./app/config/connect');
db.connect();


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  express:true
}));
app.use(express.json());


// HTTP logger
app.use(morgan('combined'));

// //Template engine
app.engine('hbs', handlebars.engine({
  extname:'.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'resource/views'));


//khởi tạo tuyến đương
route(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})