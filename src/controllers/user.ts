import { Request, Response } from "express";
import UserService from "../services/user";
import { User as IUser } from "../interface/user";
import AccountService from "../services/account";
import { IAccount } from "../interface/account";
import { CustomRequest } from "../interface/custom-request";
import { hashPin } from "../utils/functions";

function generateRandomAccountNumber(): number {
  return Math.floor(1000000000 + Math.random() * 9000000000); // Generates a 10-digit number
}

export default class UserController {
  static async addUser(req: Request, res: Response): Promise<void> {
    const userData: IUser = req.body;

    try {
      if (userData.pin) {
        const pinAsNumber = Number(userData.pin);
        if (isNaN(pinAsNumber)) {
          res.status(400).json({
            message: "PIN must be a valid number",
          });
        }
        userData.pin = await hashPin(pinAsNumber);
      }

      const user = await UserService.registerUser(userData);
      const accountData: IAccount = {
        userId: user._id as string,
        account_number: generateRandomAccountNumber(),
      };
      await AccountService.createAccount(accountData);
      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (err: any) {
      res.status(500).json({
        message: err.message || "An error occurred while registering the user",
      });
    }
  }

  static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, pin } = req.body;

    try {
      const { token } = await UserService.createToken({ email, pin });

      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message || "Invalid email or PIN",
      });
    }
  }

  static async getUserDetails(req: Request, res: Response): Promise<void> {
    const { userId, panicPin } = req as CustomRequest;
    try {
      const user = await UserService.getUserDetails(userId, panicPin);
      res.status(200).json({
        message: "User details fetched successful",
        user,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  }

  static async setPanicPin(req: Request, res: Response): Promise<void> {
    const { userId } = req as CustomRequest;
    const { panic_pin, percentage } = req.body;
    try {
      const response = await UserService.setPanicPin(
        userId,
        panic_pin,
        percentage
      );
      res.status(200).json({
        message: response.message || "Panic code set successful",
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  }
}
