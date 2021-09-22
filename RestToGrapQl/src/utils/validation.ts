import joi from "joi";

export const balanceSchema = joi.object({
  accountNr: joi.string()
    .length(10)
    .regex(/^[0-9]+$/)
    .required(),
  amount: joi.number().required(),
});

export const userSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi
    .string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
    password: joi.string().required(),
    cPassword: joi.ref('password')
})

export const transactionSchema = joi.object({
    from : joi.string()
        .length(10)
        .regex(/^[0-9]+$/)
        .required(),
    to : joi.string()
        .length(10)
        .regex(/^[0-9]+$/)
        .required(),
    amount : joi.number().required(),
    description : joi.string().min(5)
})

// const transactionSchema = new mongoose.Schema({
//     senderAccount : String,
//     receiverAccount : String,
//     amount : Number,
//     description : String,
//     createdAt : {type : Date, default : Date.now()},
// })

// const userSchema = new mongoose.Schema({
//     name : String,
//     email : String,
//     password : String,
//     admin : Boolean,
//   })