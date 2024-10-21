import { CustomRequest } from "../interface/custom-request";
import AccountService from "../services/account";
import { Request, response, Response } from "express";

export default class AccountController{
    static async Deposit(req:Request, res:Response): Promise<void> {
        const {userId} = (req as CustomRequest);
        const {amount} =  req.body
        try{
      const response = await AccountService.deposit(userId, amount)
        res.status(200).json({
            response
        })
        }catch(err:any){
             res.status(400).json({
                message: err.message 
              });
        }
    }
}