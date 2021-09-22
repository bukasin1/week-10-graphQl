import {Request, Response, NextFunction } from 'express'

interface paginationRequest extends Request {
    user? : {[key : string] : string | boolean | {[key : string] : {[key : string] : string | boolean}}[]}
}

interface paginationResponse extends Response {
    paginatedResult? : {}
}

export function adminPaginate(model: any, checkModel: any) {
    return async (req: paginationRequest, res: paginationResponse, next: NextFunction) => {
        console.log("page")
        try{
            let data
            if(req.user?.admin){
                data = await model.find()
            }else{
                if(req.params.accNum){
                    let check = await checkModel.findOne({accountNr : req.params.accNum})
                    if(check){
                        if(check.userId !== req.user?._id.toString()){
                            throw {
                                message : "account not yours"
                            }
                        }
                    }else{
                        throw {
                            message : "Wrong account number, please check again"
                        }
                    }
                    const transactions = await model.find()
                    data = transactions.filter((tranz:any) => tranz.senderAccount === req.params.accNum || tranz.receiverAccount === req.params.accNum)
                }else{
                    data = await model.find({userId : req.user?._id})
                }
            }
            const page = parseInt(req.query.page as string);
            const limit = parseInt(req.query.limit as string);
            const startIndex = (page - 1) * limit;req.params.accNum
            const endIndex = page * limit;
        
            const result: {[key : string] : {[key: string] : number}} = {};
        
            if (endIndex < data.length) {
                result.next = {
                page: page + 1,
                limit: limit,
                };
            }
            if (startIndex > 0) {
                result.previous = {
                page: page - 1,
                limit: limit,
                };
            }
            // result.data = await model.find().limit(limit).skip(startIndex);
            if(data.length > 0 && startIndex >= data.length){
                throw {
                    message : "Available pages exceeded"
                }
            }
            if(page && limit){
                result.data = data.slice(startIndex, endIndex)
            }else{
                result.data = data
            } 
            res.paginatedResult = result;
            next();
        }catch (e:any) {
            res.status(500).json({ message: e.message });
        }
        // result.results = model.slice(startIndex, endIndex);
    };
  }

  console.log([1].slice(1,2))