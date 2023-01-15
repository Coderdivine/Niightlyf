const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Ip schema...
const IpSchema = new Schema({
    ip: String,
    date: { type: Date, default: Date.now() }
});

// Create a Mongoose model for the IpSchema...
const Ip = mongoose.model('NightLyf-Ip', IpSchema);

module.exports = Ip;