import config from '../config/config.js'

export let Product
export let Cart
export let User
const initializeDAO = async () => {
switch (config.persistence) {
    case 'MONGO':
        const { default: ProductMongoDAO } = await import('./product.mongo.dao.js',)
        Product = ProductMongoDAO
       const { default: CartMongoDAO } = await import('./cart.mongo.dao.js')
        Cart = CartMongoDAO
        const { default: UserMongoDAO } = await import('./user.mongo.dao.js')
        User = UserMongoDAO 
        break;
   
        default:
        break;
}
};