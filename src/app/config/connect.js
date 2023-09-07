const mongoose = require('mongoose');

function connect (){
    mongoose.connect('mongodb://0.0.0.0:27017/milk_tea')
    .then(() => {console.log('Connected');})
    .catch(()=> {console.log('Connect failed');})

}

module.exports =  {connect};
