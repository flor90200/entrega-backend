import bcrypt from 'bcrypt'
import {fakerES as faker} from '@faker-js/faker'
export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}


export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)



export const generateProduct = () => {
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        stock: faker.number.octal({ min: 0, max: 15 }),
        price: faker.commerce.price()
    }
}
export const generateRandomString = (num) => {
    return [...Array(num)].map(() => {
        const randomNum = ~~(Math.random() * 36);
        return randomNum.toString(36);
    })
    .join('')
    .toUpperCase();
}