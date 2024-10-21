import Account from "../models/account";

export default class AccountService {
  static async createAccount(data: any) {
    try {
      return await Account.create(data);
    } catch (err: any) {
      throw err;
    }
  }

  static async getUserAccount(userId: string) {
    const account = await Account.findOne({ userId });
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }

  static async deposit(userId: string, amount: number) {
    try {
      
      if (!amount || amount <= 0) {
        throw new Error('Deposit amount must be a positive number');
      }

      // Find the user's account
      const account = await this.getUserAccount(userId);

      // Update the account balance
      account.account_balance! += amount;

      await account.save();

      return { message: 'Deposit successful', newBalance: account.account_balance };
    } catch (err: any) {
      throw new Error(err.message || 'An error occurred while depositing to the account');
    }
  }
}
