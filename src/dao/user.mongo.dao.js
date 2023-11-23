import UserModel from "../models/user.model.js"

export default class UserMongoDAO {
    getAll = async() => await UserModel.find().lean().exec()
    getById = async(id) => await UserModel.findById(id).populate().lean().exec()
    create = async(data) => await UserModel.create(data)
    update = async(id, data) => await UserModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(id) => UserModel.findByIdAndDelete(id)  
    findOne = async (query) => await UserModel.findOne(query)
    
}