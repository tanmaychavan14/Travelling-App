const mongoose = require('mongoose');

const mongoconnect = async()=>{
    try{
        await  mongoose.connect("mongodb://127.0.0.1:27017/Travelling");
        console.log("connect to mongo")
    }
    catch(e){
        console.log(e);
    }
 
}

module.exports = mongoconnect;