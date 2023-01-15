const jwt = require("jsonwebtoken");

module.exports = async function DecodeToken(req,res,next){
    let token = req.headers["x-access-token"] || req.headers["authorization"];
        if(token == undefined){
            res.status(401).json({
                message:"Token is undefined!",
                access:false 
            }).end();
        }
        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.length);
        }
        console.log({token})
        let hash = process.env.SIT;
        if(token){
            jwt.verify(token,hash,(err,decoded)=>{
                if(err){
                    res.status(401).json({
                        message:"wrong token try Login again!",
                        access:false
                    }).end()
                }else{
                    console.log("decoded",decoded);
                    req.body.decoded = decoded;
                    console.log({decoded});
                    req.user_id = decoded.user.user_id
                    req.body.user_id = decoded.user.user_id;
                    next();
                }
            })
        }else{
            res.status(401).json({
                message:"token is undefined",
                access:false
            })
        }
}