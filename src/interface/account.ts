import {User} from "./user"
export interface IAccount {
    userId: User | string;
    account_number: number;
    account_balance?: number;
    panic_account_balance?: number;
    panicDeductionPercentage?: number;
} 