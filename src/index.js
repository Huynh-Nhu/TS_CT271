const express = require('express');
const path = require('path');
const morgan = require('morgan')
const app = express();
const route = require('./routes');
const cors = require('cors');
const mongodb = require('./app/util/mongodb')
const fileUpload = require('express-fileupload');
const ApiError = require('./app/api-error');

// connect to mongoose 
const config = require('./app/config/index.js');
async function startServer() {
  try {
    await mongodb.connect(config.db.uri);
    console.log("Connected to the database");
    const PORT = config.app.port;
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`)
      ;
    });
  }catch(err){
    console.log("Cannot connecting to the database",err);
    process.exit();
  }
}

startServer();
// //Template engine
app.use(cors());
app.options('*',cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({
  express:true
}));
app.use(express.json());
app.use(fileUpload());
// HTTP logger
app.use(morgan('combined'));

//khởi tạo tuyến đương
route(app);

app.use((req,res, next) => {
  return next(new ApiError(400, "Resource not found"));
})
app.use((err,req,res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});
