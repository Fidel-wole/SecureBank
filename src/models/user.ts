import mongoose, { Schema, Document } from "mongoose";
import { User as UserInterface } from "../interface/user";

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    pin: {type: String, required:true},
    panicPin: {type: String}
  },
  {
    timestamps: true,
  }
);



interface UserBase extends Omit<UserInterface, "_id"> {}

interface UserDocument extends UserBase, Document {}

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
