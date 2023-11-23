import fs from 'fs';


class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.#inicio();
  }

  async #inicio() {
    if (!fs.existsSync(this.path)) {
      await fs.promises.writeFile(this.path, JSON.stringify([], null, 2));
    }
  }

  #generateID(products) {
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  }

  async addProduct(product) {
    if (!product.title || !product.description || !product.price  || !product.code || !product.stock) {
      return { statusCode: 400, error: "Error: faltan campos obligatorios" };
    }

    let data = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(data);

    const found = products.find(item => item.code === product.code);
    if (found) {
      return { statusCode: 409, error: "Error: el código ya existe" };
    }

    const productToAdd = { id: this.#generateID(products), ...product };
    products.push(productToAdd);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return { statusCode: 201, payload: productToAdd };
}


  getProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProducts() {
    const products = this.getProductsFromFile();
    return products;
  }

  async getProductById(productId) {
    const products = this.getProductsFromFile();
    const product = products.find(item => item.id === productId);
    return product || null;
  }

  async updateProduct(id, updatedFields) {
    const products = this.getProductsFromFile();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedFields };
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[productIndex];
    }
    return "Error: producto no encontrado";
  }
  
  async deleteProduct(id) {
    const products = this.getProductsFromFile();
    const newProducts = products.filter(product => product.id !== id);
    if (products.length !== newProducts.length) {
      await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
      return newProducts;
    }
    return this.getProducts(); 
}

}

export default ProductManager;