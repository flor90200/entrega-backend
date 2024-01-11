import mongoose from "mongoose";

const UserPasswordCollection = "userPasswords"

const userPasswordSchema = new mongoose.Schema({
    email: { type: String, ref: "users" },
    token: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expireAfterSeconds: 3600},
})

mongoose.set("strictQuery", false)
const UserPasswordModel = mongoose.model(UserPasswordCollection, userPasswordSchema)

export default UserPasswordModel