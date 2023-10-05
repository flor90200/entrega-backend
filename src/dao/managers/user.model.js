import mongoose from "mongoose";

const userColection = 'users'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: String
})

mongoose.set('strictQuery', false)
const UserModel = mongoose.model(userColection, userSchema)

export default UserModel