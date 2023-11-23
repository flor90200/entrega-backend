import {ProductService} from '../repositories/index.js'
import {PORT} from '../index.js'



export const getAllProductsController = async (req, res) => {
    const result = await ProductService.getAllPaginate(req, PORT)
    res.status(result.statusCode).json(result.response)
 }

   export const getProductByIdController = async (req, res) => {
     try {
       const id = req.params.pid;
       const result = await ProductService.getById(id)
   
       if (result === null) {
         return res.status(404).json({ status: 'error', error: 'Not found' })
       }
   
       res.status(200).json({ status: 'success', payload: result })
     } catch (error) {
       res.status(500).json({ status: 'error', error: error.message });
     }
   }

   export const createProductController = async (req, res) => {
     try {
         const product = req.body;
         console.log('Product data received:', product);
 
         const result = await ProductService.create(product);
         console.log('Product created:', result);
 
         const products = await ProductService.getAll();
         console.log('All products:', products);
 
         req.io.emit('updatedProducts', products);
         console.log('req.io:',  req.io.emit);
         res.json({ status: 'success', message: 'Producto creado con éxito' });
     } catch (error) {
         console.error('Error creating product:', error);
         res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
     }
 }

   export const updateProductController = async (req, res) => {
     try {
       const id = req.params.pid;
       const data = req.body;
       const result = await ProductService(id, data);
   
       if (result === null) {
         return  res.status(404).json({ status: 'error', error: 'Not found' })
       }
      const products = await ProductService.getAll()
      req.io.emit('updatedProducts', products)
      res.status(200).json({ status: 'success', payload: result })
     } catch (error) {
       res.status(500).json({ status: 'error', error: error.message });
     }
   }

   export const deleteProductController = async (req, res) => {
     try {
       const id = req.params.pid;
       const result = await ProductService.delete(id);
   
       if (result === null) {
         return res.status(404).json({ status: 'error', error: 'Not found' })
       }
       const products = await ProductService.getAll()
       req.io.emit('updatedProducts', products)
       res.status(200).json({ status: 'success', payload: products })
      
     } catch (error) {
       res.status(500).json({ status: 'error', error: error.message });
     }
   }