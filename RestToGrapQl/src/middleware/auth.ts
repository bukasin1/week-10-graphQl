import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction } from 'express'
// import { NextFunction } from 'express-serve-static-core'

interface authRequest extends Request {
    user? : {[key : string] : string | boolean | {[key : string] : {[key : string] : string | boolean}}[]},
    token? : string
}


const Users = require('../model/user')
const secret: string = process.env.JWT_SECRET as string;
// const secret: string = "gshyhbdn@Jgwvdi_ohhbkjw";
const days: string =process.env.JWT_EXPIRES_IN as string;
// const days: string ="90d";

export function signToken1(user: any){
    return jwt.sign({...user}, secret, {
        expiresIn: days,
    });
}

export function signToken2(id: string){
    return jwt.sign({ id }, secret, {
        expiresIn: days,
    });
}

export function signToken(id: string, admin: boolean){
    return jwt.sign({ id, admin }, secret, {
        expiresIn: days,
    });
}

export async function auth (req: authRequest, res: Response, next: NextFunction){
    try{
        const token = req.cookies.myCookie
        const decoded: any = jwt.verify(token, secret)
            const user = await Users.findOne({_id : decoded.id})
            if (!user) {
                throw {
                    message : "Not authenticated"
                }
            }
            req.user = user 
        next()
    }catch(err:any){
        console.log(err)
        res.status(301).send({message: `${err.message}`})
        // res.redirect('/')
    }
}

export async function checkAuth(token: string){
    // try{
        if(token){
            const user: any = jwt.verify(token, secret) 
            console.log(user, "auth") 
            return user._doc   
        }
        throw {
            error: "Not authenticated"
        }
    // }catch(err){
    //     console.log(err)
    // }
}