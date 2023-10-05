import fs from 'fs';

export class ProductManager {
 #path
    
    constructor(path){
        this.#path = path
        this.#init()
    }

    async #init() {
        if (!fs.existsSync(this.#path)) {
            await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2))
        }
    }

    #generateID(products) {
        return (products.length === 0) ? 1 : products[products.length - 1].id + 1
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category)
            return ' Required fields missing'
        if (!fs.existsSync(this.#path)) return 'no existe'
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        const found = products.find(item => item.code === product.code)
        if (found) return 'ya existe.'
        const productToAdd = { id: this.#generateID(products), status: true, thumbnails: [], ...product }
        products.push(productToAdd)
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))
        return productToAdd
    }

    async getProducts() {
        if (!fs.existsSync(this.#path)) return 'no existe'
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        const products = JSON.parse(data)
        return products
    }

    async getProductById(id) {
        if (!fs.existsSync(this.#path)) return 'no existe'
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let product = products.find(item => item.id === id)
        if (!product) return 'error'
        return product
    }

    async updateProduct(id, updatedProduct) {
        if (!fs.existsSync(this.#path)) return 'no existe'
        let isFound = false
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let newProducts = products.map(item => {
            if (item.id === id) {
                isFound = true
                return {
                    ...item,
                    ...updatedProduct
                }
            } else return item
        })
        if (!isFound) return 'no existe el producto'
        await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))
        return newProducts.find(item => item.id === id)
    }

    async deleteProduct(id) {
        if (!fs.existsSync(this.#path)) return 'no existe'
        let isFound = false
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let products = JSON.parse(data)
        let newProducts = products.filter(item => item.id !== id)
        if (products.length !== newProducts.length) isFound = true
        if (!isFound) return 'no existe el producto'
        await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))
        return newProducts
    }
}

 /*   readProducts = async() => {
         let products =  await fs.readFile(this.path, "utf-8");
        return JSON.parse(products);  
    }
    writeProducts = async(product) => {
        await fs.writeFile(this.path, JSON.stringify(product));
    }
    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id)
    }
   addProducts = async (product) => {
        let productsOld = await this.readProducts();
        product.id = nanoid()
        let productAll = [...productsOld, product];
       await this.writeProducts(productAll);
        return "Producto agregado";
    };
    getProducts = async () => {
        return await this.readProducts();
    };

    getProductsById = async (id) => {
       let productById = await this.exist(id);
      if (!productById) return "Producto no encontrado"
       return productById;
    };


updateProducts = async (id, product) => {
    let productById = await this.exist(id);
    if (!productById) return "Producto no encontrado"
    await this.deleteProducts(id)
    let productOld = await this.readProducts()
    let products = [{...productOld, id : id}, ...productOld]
    await this.writeProducts(products)
    return "Producto actualizado"
}

    deleteProducts = async (id)=>{
        let products = await this.readProducts();
        let existProducts = products.some(prod => prod.id === id);
       if (existProducts) {
        let filterProducts = products.filter(prod => prod.id === id);
        await this.writeProducts(filterProducts)
        return "Producto eliminado"
       } 
       return "el producto no existe"
    }
}


export default ProductManager;

/**  */
