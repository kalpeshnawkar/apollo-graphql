const mongoose = require('mongoose');
const dbConfig = require('./configURL')
var db = mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
})
mongoose.connection.on("connected", () => {
    console.log("Successfully connected to the database");
})
mongoose.connection.on("disconnected", () => {
    console.log('Could not connect to the database ');
    process.exit();
})
mongoose.connection.on("error", () => {
    console.log('error while connecting to the database ');
    process.exit(1);
})
 module.exports= db