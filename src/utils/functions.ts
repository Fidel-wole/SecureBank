import bcrypt from "bcryptjs";
import { JWT_ACCESS_SECRET } from "../configs/env";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export function generateVerificationToken(): string {
    return uuidv4();
  }
  
  export async function hashPin(pin: number): Promise<string> {
    const saltRounds = 10; // You can adjust the number of salt rounds
    const hashedPin = await bcrypt.hash(pin.toString(), saltRounds);
    return hashedPin;
  }

  export async function comparePins(
    plainPin: number,
    hashedPin: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPin.toString(), hashedPin);
  }
  
  
  export function jsonwebtoken(userId: string, email: string, panic:boolean): string {
    const secret = JWT_ACCESS_SECRET;
  
    if (!secret) {
      throw new Error("JWT access secret is not defined in the environment.");
    }
  
    return jwt.sign(
      {
        userId: userId,
        email: email,
        panicPin: panic
      },
      secret,
      {
        expiresIn: "7d",
      }
    );
  }