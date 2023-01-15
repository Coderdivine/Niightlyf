const express = require("express");
const Ip = require("../Model/IPSchema");

async function trace(req,res,next){
    try {
          // Get the IP address from the request headers
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(ip);
         // Create a new Ip object with the IP address
              const newIp = new Ip({ip: ip});
              const saved = await newIp.save();
              if(saved){
                next()
              }else{
                next()
              }
    } catch (error) {
        res.status(500).json({
            message:error.message
        }).end();
    }
};
 

module.exports = trace;