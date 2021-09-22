import { Request, Response, NextFunction } from "express"
import { HttpError } from "http-errors"
import { userSchema } from '../utils/validation'
import {promises as dns} from 'dns'
import bcrypt from 'bcryptjs'


import { signToken } from '../middleware/auth'

const Users = require('../model/user')
const Todo = require('../model/todo')

export function getSignUp(req: Request, res: Response){
    res.render('signup', {title : "Create an account"})
}

export async function createUser(req: Request, res: Response){
    try{
        // console.log(req.body)
        const validation = userSchema.validate(req.body)
        if(!req.body.cPassword){
            // throw {
            //     message : "Password not confirmed"
            // } 
            res.render('signup', {title : "Create an account", error : "Password not confirmed"})
            return;
        }
        if(validation.error){
            // res.status(404).send({
            //     message : validation.error.details[0].message
            // })
            res.render('signup', {title : "Create an account", error : validation.error.details[0].message})
            return;
        }
        const domainName = req.body.email.split('@')[1]
        const resolveBool = await dns
        .resolveMx(domainName)
        .then((data) => {
          return true;
        })
        .catch((err) => {
          return false;
        });
        if(!resolveBool){
            // throw {
            //     message : "Invalid email"
            // }
            res.render('signup', {title : "Create an account", error : "Invalid email"})
            return;
        }
        const user = await Users.findOne({email : req.body.email})
        if(user){
            // throw {
            //     message : "Email already exists"
            // }
            res.render('signup', {title : "Create an account", error : "Email already exists"})
            return;
        }
        const {firstName, lastName, email, password} = req.body
        const pass = await bcrypt.hash(password, 10)
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password : pass
        })
        const saveUser = await newUser.save()
        if(saveUser){
            // res.status(201).send(saveUser)
            res.redirect('/users/login')
        }else{
            // throw {
            //     message : "Unable to save"
            // }
            res.render('signup', {title : "Create an account", error : "Unable to save"})
            return;
        }
    }catch(err){
        res.status(404).send(err)
    }
}

export function getLogin(req: Request, res: Response){
    res.render('login', {title : "Login to your account"})
}

export async function signInUser(req: Request, res: any){
    try{
        const user = await Users.findOne({email : req.body.email})
        const validUser = await bcrypt.compare(req.body.password, user.password)
        if(validUser){
            const token = signToken(user._id, user.admin)
            // user.tokens = user.tokens.concat({token})
            // await user.save()
            // res.token = token
            res.cookie("myCookie", token)
            res.status(201).send({msg: "Logged in", token})
            return;
        }
        throw{
            message : "Invalid login details"
        }
    }catch(err){
        console.log("error")
        res.status(404).send(err)
    }
}

export async function logout(req: any, res: Response){
    try{
        res.clearCookie("myCookie")
        res.status(200).send({message: 'logged out'})
    }catch(err){
        res.status(404).send(err)
    }
}