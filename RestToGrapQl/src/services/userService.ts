import bcrypt from 'bcryptjs'
import { signToken, signToken1, signToken2 } from '../middleware/auth'
const User = require('../model/user')

interface userLogin {
    email: string,
    password: string
}


export async function login(loginData: userLogin){
    try{
        const user = await User.findOne({email : loginData.email})
        const validUser = await bcrypt.compare(loginData.password, user.password)
        if(validUser){
            const token = signToken1(user)
            return token
        }
        throw{
            message : "Invalid login details"
        }
    }catch(err){
        console.log(err)
    }
}