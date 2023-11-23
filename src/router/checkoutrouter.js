import { Router } from 'express'
import { checkoutGmail, checkoutSms } from '../controllers/checkout.controller.js'

import { generateProduct } from '../utils.js'

const router = Router()



router.post('/checkoutCorreo', checkoutGmail)
router.post('/checkoutSms', checkoutSms)


export default router;