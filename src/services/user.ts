import User from "../models/user";
import { comparePins, hashPin, jsonwebtoken } from "../utils/functions";
import AccountService from "./account";
import Account from "../models/account";
export default class UserService {
  static async registerUser(user: any) {
    try {
     const existingUser = await User.findOne({ email: user.email });
     if (existingUser) {
       throw new Error("User with this email already exists");
     }
      const newUser = new User(user);
      await newUser.save();
      return newUser;
    } catch (error:any) {
      throw error;    }
  }

  static async createToken(data: { email: string; pin?: number }) {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      throw new Error('User not found');
    }
  
    let panic = false;
  
    if (data.pin !== undefined) {
      // Check if the provided pin matches the stored pin
      const isPinMatch = await comparePins(data.pin, user.pin);
      // Check if the provided pin matches the panic pin
      const isPanicPinMatch = user.panicPin ? await comparePins(data.pin, user.panicPin) : false;
  
      // If neither pin matches, throw an error
      if (!isPinMatch && !isPanicPinMatch) {
        throw new Error('Invalid PIN');
      }
  
      // If the provided pin matches the panic pin, set panic to true
      panic = isPanicPinMatch;
    }
  
    // Create the token payload
    const payload = {
      userId: user._id,
      email: user.email,
      panic,
    };
    const token = jsonwebtoken(user._id as string, user.email as string, panic);

    return { token };
  }

  static async getUserDetails(userId: string, panicSet: boolean) {

    const user = await User.findById(userId).select("name email");
    if (!user) {
        throw new Error('User not found');
    }
    
    let balance;

    const account = await AccountService.getUserAccount(userId);
    
    // Determine balance based on panic mode
    if (panicSet) {
        balance = account.panic_account_balance;
    } else {
        balance = account.account_balance; 
    }

    const getUserAccount = {
        account_number: account.account_number,
        account_balance: balance
    };

    // Return user and account details
    return { user, getUserAccount };
}


  static async setPanicPin(userId: string, panicPin: number, panicDeductionPercentage: number) {
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!panicPin || panicPin.toString().length < 4) {
        throw new Error('Panic PIN must be at least 4 digits long');
      }


      const hashedPanicPin = await hashPin(panicPin); 

      user.panicPin = hashedPanicPin;
      await user.save();

      // Find the user's account
      const account = await Account.findOne({ userId: user._id });
      if (!account) {
        throw new Error('Account not found');
      }

      // Update the panic deduction percentage in the account
      account.panicDeductionPercentage = panicDeductionPercentage;
      await account.save();

      return { message: 'Panic PIN and deduction percentage set successfully' };
    } catch (err: any) {
      throw new Error(err.message || 'An error occurred while setting the panic PIN and deduction percentage');
    }
  }
}

