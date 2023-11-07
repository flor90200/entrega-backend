import cartModel from "../dao/cart.model.js"
import productModel from "../dao/managers/product.model.js"


export const getProductsFromCart = async (req, res) => {
    try {
      const id = req.params.cid
      const result = await cartModel.findById(id).populate('products.product').lean()
      if (result === null) {
        return {
          statusCode: 404,
          response: { status: 'error', error: 'not found'}
        }
      }
      return {
        statusCode: 200,
        response: { status: 'success', payload: result}
      }
    }  catch (err) {
      return {
        statusCode: 500,
        response: { status: 'error', error: err.message}
      }
    }
  }

  export const createCartContoller = async (req, res) => {
    try {
     const result = await cartModel.create({})
     res.status(201).json({ status: 'success', payload: result})
    } catch(err) {
     res.status(500).json({ status: 'error', error: err.message})
    }
 }

  export const getCartByIdContoller = async (req, res) => {
    const result = await getProductsFromCart(req, res)
    res.status(result.statusCode).json(result.response)
    
 }

  export const createCartProductController = async (req, res, next) => {
    try {
  
      const cid = req.params.cid; 
      const pid = req.params.pid;
   
      const cartToUpdate = await cartModel.findById(cid);
      
      if (cartToUpdate === null) {
        return res.status(404).json({ status: 'error', error: `Cart with id=${cid} not found` });
      }
  
      const productToAdd = await productModel.findById(pid);
      if (productToAdd === null) {
        return res.status(404).json({ status: 'error', error: `Product with id=${pid} not found` });
      }
  
      const productIndex = cartToUpdate.products.findIndex(item => item.product == pid);
      if (productIndex > -1) {
        cartToUpdate.products[productIndex].quantity += 1;
      } else {
        cartToUpdate.products.push({ product: pid, quantity: 1 });
      }
  
      const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' });
      res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message});
    }
  }

  export const deleteCartProductController = async (req, res) => {
    try {
      const cid = req.params.cid
      const pid = req.params.pid
      const carToupdate = await cartModel.findById(cid)
      if (carToupdate === null) {
        return res.status(404).json({ status: 'error', error: `Cart with id=${cid} not found` })
      }
      const productDelete = await productModel.findById(pid)
      if (productDelete === null ) {
        return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found`})
      }
      const productIndex = carToupdate.products.findIndex(item => item.product == pid)
      if (productIndex === -1) {
        return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}`})
      } else {
        carToupdate.products = carToupdate.products.filter(item => item.product.toString() !== pid)
      }
      const result = await cartModel.findByIdAndUpdate(cid, carToupdate, { returnDocument: 'after'})
      res.status(200).json({ status: 'success', payload: result})
    } catch(err) {
      res.status(500).json({ status: 'error', erorr: err.message})
    }
  }

  export const updateProductCartContoller = async (req, res) => {
    try {
      const cid = req.params.cid
      const cartToUpdate = await cartModel.findById(cid)
      if (cartToUpdate === null) {
        return res.status(404).json({status: 'error', error: `Cart with id=${cid} not dound` })
      }
      const products = req.body.products
      if (!products){
      return res.status(400).json({status: 'error', error: 'Filed products is not optional' })
    }
    for (let index = 0; index < products.length; index++) {
     if (!products[index].hasOwnProperty('product') || !products[index].hasOwnProperty('quantity'))
     return res.status(400).json({status: 'error', error: 'Product must have a valid id and a valid quantity' })
   
    if (typeof products[index].quantity !== 'number') {
      return res.status(400).json({status: 'error', error: 'product quantity must be a number' })
    }
    if ( products[index].quantity === 0) {
      return res.status(400).json({status: 'error', error: 'product quantity cannot be 0' })
    }
    const productToAdd = await productModel.findById(products[index].product)
    if (productToAdd === null) {
      return res.status(400).json({status: 'error', error: `Product with id=${products[index].product} doesnot exist. we cannot ` })
    }
  } 
      cartToUpdate.products = products
  const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after'})
  res.status(200).json({ status: 'succes', payload: result})
    } catch(err) {
      res.status(500).json({ status: 'error', error: err.message})
    }
  
  }
  
  export const deleteCartcontroller = async (req, res) => {
    try {
      const cid = req.params.cid
      const cartToUpdate = await cartModel.findById(cid)
      if (cartToUpdate === null) {
        return res.status(400).json({ status: 'error', error: `Cart with id=${cdi} not found`})
      }
      cartToUpdate.products = []
      const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after'})
      res.status(200).json({ status: 'success', payload: result})
    } catch(err) {
      res.status(500).json({ status: 'error', error: err.message})
    }
  }