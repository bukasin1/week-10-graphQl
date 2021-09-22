import { Request, Response, NextFunction } from "express"
import { HttpError } from "http-errors"


const User = require('../model/user')
const Todo = require('../model/todo')


export async function getList(req: any, res: Response){
    try{
        // if(req.session.email){
            // const user = await User.findOne({email : req.session.email})
            // const todos = await Todo.find({user : user._id, completed : false})
            if(req.url.includes('completed')){
                const todos = await Todo.find({user: req.user._id ,completed: true})
                res.render('todolist', {title : "ToDo List", todos : todos, completed: true})
            }else{
                const todos = await Todo.find({user: req.user._id ,completed: false})
                res.render('todolist', {title : "ToDo List", todos : todos})
            }
        // }else{
        //     res.redirect('/login')  
        // }
    }catch(err){
        res.send(err)
    }
}


export async function getTodoForm(req: Request, res: Response){
    try{
        // if(req.session.email){
            // const user = await User.findOne({email : req.session.email})
            res.render('createTodo', {title : "ToDo List"})
        // }else{
        //     res.redirect('/login')  
        // }
    }catch(err){
        res.send(err)
    }
}

export async function postTodo(req: any, res: Response){
    try{
        // if(req.session.email){
        //     const user = await User.findOne({email : req.session.email})
            const todo = new Todo({
                user : req.user._id,
                date : req.body.date,
                details : req.body.details,
                title : req.body.title
            })
            let saveTodo = todo.save()
            if(saveTodo){
                res.render('createTodo', {title : "ToDo List", message : "Record Saved."})
            }else{
                throw{
                    message : "Unable to save this form."
                }
            }
        // }else{
        //     res.redirect('/login')
        // }
    }catch(err){
        res.send(err)
    }
}

export async function getSingleTodo(req: any, res: Response){
    try{
        // if(req.session.email){
        //     const user = await User.findOne({email : req.session.email})
            const todo = await Todo.findOne({_id : req.params.todoID, user: req.user._id})
            if(todo){
                res.render('singleTodo', {title : "Record.", todo : todo})
            }else{
                res.redirect('/todos')
            }
        // }else{
        //     res.redirect('/login')
        // }
    }catch(err){
        res.send(err)
    }
}

export async function updateTodo(req: Request, res: Response){
    try{
        // if(req.session.email){
            const todo = await Todo.findOne({_id : req.params.todoID})
            if(req.url.includes('complete')){
                todo.completed = true        
            }else{
                const {title, details} = req.body
                todo.title = title,
                todo.details = details
            }
            const saved = await todo.save()
            if(saved){
                let redirectUrl = "/todos/" + req.params.todoID
                res.redirect(redirectUrl)
            }else {
                res.send({
                    message: "Error updating"
                })
            }
        // }else{
        //     res.redirect('/login')
        // }
    }catch(err: any){
        console.log(err)
        res.send(err.message)
    }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction){
    try{
        // if(req.session.email){
            Todo.findByIdAndDelete(req.params.todoID, (err: any, data: any) => {
                if(err){
                    res.send({
                        message: err.message
                    })
                }else{
                    let redirectUrl = "/todos"
                    res.redirect(redirectUrl)
                }
            })
        // }
    }catch(err: any){
        res.send(err.message)
    }
}
