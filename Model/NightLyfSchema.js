const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminResponse = new Schema({
    user_id:{
        type:String,
        required:true
    },
    title:{
        type:String,
        default:"Write a secrect Anonymous"
    },
    description:{
        type:String,
        default:"Write a secret anonymous to one will see"
    },
    question_id:{
        type:String,
        required:true
    },
    responses:[
        {
            text:String,
            date:String
        }
    ]
});

const NightLyf = new Schema({
   username:{
    type:String,
    required:true
   },
   user_id:{
    type:String,
    required:true
   },
   password:{
        type:String,
        required:true
   },
   joined:{
    type:Date,
    default:Date.now()
   }
});


const NightLyfs = mongoose.model("NightLyf", NightLyf);
const AdminResponses = mongoose.model("NigthLyf-responses",AdminResponse);
module.exports = {
    Users:NightLyfs,
    Response:AdminResponses
};