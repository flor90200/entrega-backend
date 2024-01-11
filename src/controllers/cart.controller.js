
import ticketModel from '../models/ticket.model.js'
import {ProductService} from '../repositories/index.js'
import shortid from 'shortid'
import {CartService} from '../repositories/index.js'

export const getProductsFromCart = async (req, res) => {
    try {
      const id = req.params.cid
      const result = await CartService.getById(id)

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
     const result = await CartService.create({})
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
      const loggedInUserEmail = req.session.user.email;
      const product = await ProductService.getById(pid);
      
      if (req.session.user.role === 'premium' && product.owner === loggedInUserEmail) {
      
        return res.status(403).json({ status: 'error', error: 'Cannot add your own product to the cart' });
      }
        const cartToUpdate = await CartService.findById(cid);
        
        if (cartToUpdate === null) {
          return res.status(404).json({ status: 'error', error: `Cart with id=${cid} not found` });
        }
    
        const productToAdd = await ProductService.getById(pid);
        if (productToAdd === null) {
          return res.status(404).json({ status: 'error', error: `Product with id=${pid} not found` });
        }
    
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid);
        if (productIndex > -1) {
          cartToUpdate.products[productIndex].quantity += 1;
        } else {
          cartToUpdate.products.push({ product: pid, quantity: 1 });
        }
    
        const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after' });
        res.status(201).json({ status: 'success', payload: result });
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message});
      }
    }
  

  export const deleteCartProductController = async (req, res) => {
    try {
      const cid = req.params.cid
      const pid = req.params.pid
      const carToupdate = await CartService.findById(cid)
      if (carToupdate === null) {
        return res.status(404).json({ status: 'error', error: `Cart with id=${cid} not found` })
      }
      
      const productDelete = await ProductService.getById(pid)
      console.log( productDelete, pid );
      if (productDelete === null ) {
        return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found`})
      }
      
      const productIndex = carToupdate.products.findIndex(item => item.product == pid)
      if (productIndex === -1) {
        return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}`})
      } else {
        carToupdate.products = carToupdate.products.filter(item => item.product.toString() !== pid)
      }
      const result = await CartService.update(cid, carToupdate, { returnDocument: 'after'})
      res.status(200).json({ status: 'success', payload: result})
    } catch(err) {
      res.status(500).json({ status: 'error', erorr: err.message})
    }
  }

  export const updateProductCartContoller = async (req, res) => {
    try {
      const cid = req.params.cid
      const cartToUpdate = await CartService.findById(cid)
     
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
    const productToAdd = await ProductService.findById(products[index].product)
    if (productToAdd === null) {
      return res.status(400).json({status: 'error', error: `Product with id=${products[index].product} doesnot exist. we cannot ` })
    }
  } 
      cartToUpdate.products = products
  const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after'})
  res.status(200).json({ status: 'succes', payload: result})
    } catch(err) {
      res.status(500).json({ status: 'error', error: err.message})
    }
  
  }
  
  
  export const updateProductQtyFromCartController = async (req, res) =>{
    try{
      const cid = req.params.cid
      const pid = req.params.pid
      const cartToUpdate = await CartService.findById(cid)
      if (cartToUpdate === null) {
        return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
      }
      const productToUpdate = await ProductService.findById(pid)
      if (productToUpdate === null) {
        return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
      }
      const quantity = req.body.quantity
      if (!quantity) {
        return res.status(400).json({ status: 'error', error: 'Field "quantity" is not optional' })
      }
      if (quantity === 0) {
        return res.status(400).json({ status: 'error', error: 'product\'s quantity cannot be 0' })
      }
      const productIdex = cartToUpdate.products.findIndex(item => item.product == pid)
      if (productIdex === -1) {
        return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}` })
      } else {
        cartToUpdate.products[productIdex].quantity = quantity
      }
      const result = await CartService.update(cid, cartToUpdate, {returnDocument: 'after'})
      res.status(200).json({ status: 'success', payload: result })
    }catch(err) {
      res.status(500).json({ status: 'error', error: err.message })
  }
}

  export const deleteCartcontroller = async (req, res) => {
    try {
      const cid = req.params.cid
      const cartToUpdate = await CartService.findById(cid)
      if (cartToUpdate === null) {
        return res.status(400).json({ status: 'error', error: `Cart with id=${cdi} not found`})
      }
      cartToUpdate.products = []
      const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after'})
      res.status(200).json({ status: 'success', payload: result})
    } catch(err) {
      res.status(500).json({ status: 'error', error: err.message})
    }
  }

export const purchaseController = async(req, res) => {
  try {
    const cid = req.params.cid
    const cartToPurchase = await CartService.findById(cid)

    if (cartToPurchase === null) {
      return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
    }

    let productsToTicket = []
    let productsAfterPurchse = cartToPurchase.products
    let amount = 0

    for (let index = 0; index < cartToPurchase.products.length; index++) {
      const productToPurchase = await ProductService.getById(cartToPurchase.products[index].product)

      if (productToPurchase === null) {
        return res.status(400).json({ status: 'error', error: `Product with id=${cartToPurchase.products[index].product} does not exist. We cannot purchase this product` })
      }
      
      if (cartToPurchase.products[index].quantity <= productToPurchase.stock) {
        
         //actualizamos el stock del producto que se está comprando
         productToPurchase.stock -= cartToPurchase.products[index].quantity
        await ProductService.update(productToPurchase._id, { stock: productToPurchase.stock })

        //eliminamos del carrito los productos que se compraron
        productsAfterPurchse = productsAfterPurchse.filter(item => item.product.toString() !== cartToPurchase.products[index].product.toString())

        // total del ticket
        amount += (productToPurchase.price * cartToPurchase.products[index].quantity)

        //colocamos el producto en el Ticket 
        productsToTicket.push({ product: productToPurchase._id, price: productToPurchase.price, quantity: cartToPurchase.products[index].quantity})
      }
      
    }
     //eliminamos del carrito los productos que se compraron
     await CartService.update(cid, {
      products: productsAfterPurchse}, {
        returnDocument: 'after' })

        //creamos el Ticket
        const result = await ticketModel.create({
          code: shortid.generate(),
          products: productsToTicket,
          amount,
          purchaser: req.session.user.email
        })
        
        return res.status(201).json({ status: 'success', payload: result })
  } catch(err) {
    return res.status(500).json({ status: 'error', error: err.message })
}
}