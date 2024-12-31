const mongoose = require('mongoose');

const mongoconnect = async()=>{
    try{
        await  mongoose.connect(process.env.MONGO_URI);
        console.log("connect to mongo")
    }
    catch(e){
        console.log(e);
    }
 
}

module.exports = mongoconnect;