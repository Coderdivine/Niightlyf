const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const router = express.Router();
const uuidv4 = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const Decode = require("../Public/Decode");
const {
    Users,
    Response
} = require("../Model/NightLyfSchema");
const trace = require("../Public/IP");

async function generateLetters() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
  
    for (let i = 0; i < 9; i++) {
      result += letters[Math.floor(Math.random() * letters.length)];
    }
  
    return result.slice(0, 3) + '-' + result.slice(3, 6) + '-' + result.slice(6);
}
///Create Admin...
router.post("/create-admin",async (req,res,next)=>{
    try{
        let { username,password } = req.body;
        let user_id = await generateLetters()//uuidv4.v4();
        if(username.length > 4){
            const exist = await Users.find({username});
            console.log({exist});
          if(exist.length){
            next("Username already exists");
          }else{
            if(password !== ""){
                const hash = await bcrypt.hash(password,10);
                if(hash){
                    const newUser = new Users({
                        username,
                        user_id,
                        password:hash
                    });
                    const saveRes = await newUser.save();
                    const user = { username,password,user_id };
                    const random = process.env.SIT; //maybe Object...
                    const token = await jwt.sign({user}, random, {
                        expiresIn: '4d',
                    });
                    console.log({token});
                    if(saveRes){
                        res.status(201).json({
                            message:`${username} was created!`,
                            token,
                            user_id
                        }).end();
                    }else{
                        next("Unable to create user please try Again!");
                    }
                }
            }else{
                next("Password must be greater than 5")
            }
          }
        }else{
            next("Username must be greate than 4")
        }
    }catch(error){
        next(error.message);
    }
});

router.post("/login",async(req,res,next)=>{
    try {
            const {username,password} = req.body;
            if(username !== "" && password !== ""){
                const user = await Users.findOne({username});
                const valid = await bcrypt.compare(password,user.password);
                if(valid){
                    const random = process.env.SIT; //maybe Object...
                        const token = await jwt.sign({ user }, random, {
                            expiresIn: '4d',
                        });
                        console.log({token});
                    res.status(200).json({
                        message:`${username} is logged in`,
                        data:user,
                        token
                    }).end();
                }else{
                   next("Invalid password");
                }
            }else{
                next(`Username and password required`)
               
            }
    } catch (error) {
        next(error.message);
    }
});

//create a post...
router.post("/create-post",
Decode,
async(req,res,next)=>{
    try{
        let { title,description,user_id } = req.body;
        if(title){
            let question_id = await generateLetters();
            const createPost = new Response({
                user_id,question_id,
                title,description,
                response:[
                    { text: 'Good!', date: '15th January, 2023' }
                ]
            });
            const saved = await createPost.save();
            console.log({saved});
            if(saved){
                res.status(201).json({
                    message:"New Anonymous created",
                    share:`https://nightlyf.netlify.com/answer/${question_id}`
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
router.post("/answer",
trace,
async(req,res,next)=>{
    try{
        const { question_id,answer } = req.body;
        if(question_id.length > 4){
            if(question_id.length > 4){
                const question = await Response.findOne({question_id});
                console.log(question);
                if(question){
                    let now = moment(Date.now());
                    const add = {
                        text:answer,
                        date:now.format('Do MMMM, YYYY')
                      };
                      console.log(question.responses);
                question.responses = question.responses = [...question.responses, add];
                //question.responses.push(add);
                console.log(question.responses);
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
router.get("/get-response/:question_id",
Decode,
async(req,res,next)=>{
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
router.get("/get-questions/:user_id",
Decode,
async(req,res,next)=>{
    try{
        const questions = await Response.find({user_id:req.params.user_id});
        console.log(questions);
        if(questions){
            res.status(200).json({
                message:"Questions fetched!",
                data:questions
            }).end();
        }else{
            res.status(200).json({
                message:"Questions fetched!",
                data:[]
            }).end();
        }
    }catch(error){
        next(error.message);
    }
});


module.exports = router;