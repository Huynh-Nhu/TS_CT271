const path = require('path');
const currentPath = __dirname;
const parentPath = path.resolve(currentPath, '../../../..');
const config = {
    app: {
        port: process.env.PORT || 3000,
    },

    db:{
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/milk_tea"
    },
    filePath:{
        product: parentPath+"/Vue_User/public/img/products/" ,
        comment: parentPath+"/Vue_User/public/img/comment/" 

    } 
    
};
module.exports = config;