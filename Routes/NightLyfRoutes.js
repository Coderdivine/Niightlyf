const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const router = express.Router();
const uuidv4 = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    Users,
    Response
} = require("../Model/NightLyfSchema");

//Create Admin...
router.post("/create-admin",async (req,res,next)=>{
    try{
        let { username,password } = req.body;
        let user_id = uuidv4.v4();
        if(username.length > 4){
            const exist = await Users.find({username});
            console.log({exist});
          if(exist.length){
            next("Username already exists")
          }else{
            if(password.length < 5){
                const hash = await bcrypt.hash(password,10);
                if(hash){
                    const newUser = new Users({
                        username,
                        user_id,
                        passowrd:hash
                    });
                    const saveRes = await newUser.save();
                    const token = await jwt.sign({username,user_id},process.env.HASH)
                    res.setHeader("Authorization",`Bearer ${token}`);
                    if(saveRes){
                        res.status(201).json({
                            message:`${username} was created!`
                        }).end();
                    }else{
                        next("Unable to create user please try Again!");
                    }
                }
            }else{
                next("Password must be greate than 5")
            }
          }
        }else{
            next("Username must be greate than 4")
        }
    }catch(error){
        next(error.message);
    }
});

//create a post...
router.post("/create-post",async(req,res,next)=>{
    try{
        let { title,description,user_id } = req.body;
        if(title){
            let question_id = uuidv4.v4();
            const createPost = new Response({
                user_id,question_id,
                title,description,
                response:[]
            });
            const saved = await createPost.save();
            console.log({saved});
            if(saved){
                res.status(201).json({
                    message:"New Anonymous created",
                    share:`https://nightlyf.xyz/userId/postId`
                }).end();
            }else{
                next("Unable to create Anonymous. Try again");
            }

        }else{
            next("Title is needed!");
        }
    }catch(error){

        next(error.message);
    }
});

//Answer anonymous...
router.post("/answer",async(req,res,next)=>{
    try{
        const { user_id,question_id,answer } = req.body;
        if(user_id.length > 4){
            if(question_id.length > 4){
                const question = await Response.findOne({question_id});
                if(question){
                question.responses = question.responses.push({
                    text:answer
                  });
                  const saved = await question.save();
                  console.log({saved});
                  if(saved){
                    res.status(201).json({
                        message:"Message sent",
                        answer
                    }).end();
                  }else{
                    next("Unable to send answer try again please")
                  }
                }else{
                    next("Question doesn't exist");
                }
            }else{
                next("This is a broken URL. Invalid Anonymous");
            } 
        }else{
            next("This is a broken URL");
        }
    }catch(error){
        next(error.message);
    }
});

//Get all responses...
router.get("/get-response",async(req,res,next)=>{
    try{
        const answers = await Response.findOne({question_id:req.params.question_id});
        if(answers){
            res.status(200).json({
                message:"Fetched answers",
                data:answers.responses
            }).end();
        } else{
            next("Error something ocurred")
        }
    }catch(error){
        next(error.message);
    }
});

//Get all questions...
router.get("/get-questions",async(req,res)=>{
    try{
        const questions = await Response.findOne({user_id:req.body.user_id});
        if(questions){
            res.status(200).json({
                message:"Questions fetched!",
                data:questions
            }).end();
        }else{
            next("Couldn't find data");
        }
    }catch(error){
        next(error.message);
    }
});


module.exports = router;