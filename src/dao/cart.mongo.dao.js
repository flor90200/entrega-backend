import cartModel from "../models/cart.model.js";

export default class CartMongoDAO {
    getAll = async () => await cartModel.find().lean().exec();
  
    getById = async (id) => await cartModel.findById(id).populate('products.product').lean().exec()
  
    create = async (data) => await cartModel.create(data);
  
    update = async (id, data) => await cartModel.findByIdAndUpdate(id, data, { new: true });
  
    delete = async (id) => await cartModel.findByIdAndDelete(id);
    
    findById = async (id) => await cartModel.findById(id).lean().exec();
  }