const User = require('../model/user')
const Todo = require('../model/todo')

export interface todoData{
    date: string,
    title: string,
    details: string
}

interface userData{

    firstName : string,
    lastName : string,
    password : string,
    email : string
}

export async function getTodos(completed: boolean, user: any) {
    try{
        console.log(user, "service")
        const todos = await Todo.find({completed, user: user._id})
        return todos
    }catch(err){
        console.log(err)
    }
}

export async function getSingleTodo(id: string, user: any) {
    try{
        const todo = await Todo.findById(id)
        return todo
    }catch(err){
        console.log(err)
    }
}

export async function createTodo(todoData: todoData, user: any){
    try{
        const todo = new Todo({
            user: user._id,
            date : todoData.date,
            details : todoData.details,
            title : todoData.title
        })
        let saveTodo = await todo.save()
        if(saveTodo){
            return saveTodo
        }else{
            throw{
                message : "Unable to save this form."
            }
        }
    }catch(err){
        console.log(err)
    }
}

export async function updateTodo(id: string,todoData: todoData, completed = false){
    try{
        const todo = await Todo.findById(id)
        if(completed){
            todo.completed = completed
        }else{
            const {title, details} = todoData
            todo.title = title,
            todo.details = details
        }
        const saved = await todo.save()
        if(saved){
            return saved
        }else {
            throw{
                message : "Error updating."
            }
        }
    }catch(err){
        console.log(err)
    }
}

export async function deleteTodo(id: string){
    try{
        await Todo.findByIdAndDelete(id)
        return {
            message: `Todo with id ${id} deleted`
        }
    }catch(err){
        console.log(err)
    }
}