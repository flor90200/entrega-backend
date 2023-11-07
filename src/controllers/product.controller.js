import productModel from "../dao/managers/product.model.js"
import {PORT} from '../index.js'
export const getProducts = async (req, res) => {
    try {
      const limit = req.query.limit || 10
      const page = req.query.page || 1
      const filterOptions = {}
      if (req.query.stock) filterOptions.stock = req.query.stock
      if (req.query.category) filterOptions.category = req.query.category
      const paginateOptions = { lean: true, limit, page }
      if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 }
      if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 }
      const result = await productModel.paginate(filterOptions, paginateOptions)
      let prevLink
      if (!req.query.page) {
        prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.prevPage}`
      } else {
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
        prevLink =  `http://${req.hostname}:${PORT}${modifiedUrl}`
      }
        let nextLink
        if (!req.query.page) {
          nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextLink}`
        } else {
          const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextLink}`)
          nextLink = `http://${req.hostname}:${PORT}${modifiedUrl}`
        } 
     return{
      statusCode: 200,
      response: {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? prevLink : null,
        nextLink: result.hasNextPage ? nextLink : null
      }
    
     }
    } catch(err) {
      return {
        statusCode: 500,
        response: { starus: 'error', error: err.message}
      }
    }  
    } 
    
   export const getAllProductsController = async (req, res) => {
      try {
        const category = req.query.category ? req.query.category.toLowerCase() : null;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const options = {
          page: page,
          limit: limit,
          sort: { price: req.query.sort === 'desc' ? -1 : 1 }
        };
    
        let filterOptions = {};
    
        if (category) {
          filterOptions = { category: { $regex: new RegExp(category, 'i') } };
        }
    
        const result = await productModel.paginate(filterOptions, options);
    
        const response = {
          status: 'success',
          payload: result.docs,
          totalPages: result.totalPages,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          page: result.page,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: null,
          nextLink: null,
        };
    
        if (result.hasPrevPage) {
          response.prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.prevPage}`;
        }
        if (result.hasNextPage) {
          response.nextLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextPage}`;
        }
    
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
      }
    }

    export const getProductByIdController = async (req, res) => {
      try {
        const id = req.params.pid;
        const product = await productModel.getProductById(id);
    
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
    
        res.status(200).json({ payload: product });
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
      }
    }

    export const createProductController = async (req, res) => {
      try {
        const product = req.body;
        const result = await productModel.addProduct(product);
    
        if (result.statusCode === 201) {
          return res
            .status(result.statusCode)
            .json({ status: "success", payload: result.payload });
        } else {
          return res.status(result.statusCode).json({ error: result.error });
        }
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
      }
    }

    export const updateProductContoller = async (req, res) => {
      try {
        const pid = req.params.pid;
        const updatedFields = req.body;
        const result = await productModel.updateProduct(pid, updatedFields);
    
        if (typeof result === "string") {
          return res.status(404).json({ error: result });
        }
    
        res.status(200).json({ status: "success", payload: result });
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
      }
    }

    export const deleteProductController = async (req, res) => {
      try {
        const id = req.params.pid;
        const result = await productModel.deleteProduct(id);
    
        if (typeof result === "string") {
          return res.status(404).json({ error: result });
        }
    
        res.status(200).json({ status: 'success', payload: result });
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
      }
    }