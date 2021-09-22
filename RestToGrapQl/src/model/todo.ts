import mongoose from "mongoose"
const Schema = mongoose.Schema

const todoSchema = new Schema ({
    date : {type : Date},
    title : String,
    details : String,
    completed : {type : Boolean, default : false},
    user : String
},{
    timestamps: true
})

module.exports = mongoose.model('todo' , todoSchema)