import { Router } from 'express'
import { generateProduct } from '../utils.js'

const router = Router()

router.get('/', async(req, res) => {
    const users = []
    for (let index = 0; index < 50; index++) {
        users.push(generateProduct())
    }
    res.send({ status: 'success', payload: users })
})

export default router