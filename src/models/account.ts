import { IAccount } from "../interface/account";
import mongoose, { Schema, Document } from "mongoose";

// Extend the Document interface with IAccount
interface AccountDocument extends IAccount, Document {}

// Define the account schema
const accountSchema = new Schema<AccountDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    account_number: { type: Number, unique: true, required: true },
    account_balance: { type: Number, default: 0.00 },
    panicDeductionPercentage: { type: Number, default: 0 }, 
    panic_account_balance: { type: Number, default: 0.00 }
  },
  {
    timestamps: true, 
  }
);

// Pre-save hook to update the panic_account_balance based on the account_balance and panicDeductionPercentage
accountSchema.pre("save", function (next) {
  const account = this;

  if (account.panicDeductionPercentage! > 0) {
    const deduction = (account.panicDeductionPercentage! / 100) * account.account_balance!;
    account.panic_account_balance = deduction;
  } else {
    account.panic_account_balance = 0; 
  }

  next(); 
});


const Account = mongoose.model<AccountDocument>("Account", accountSchema);


export default Account;
