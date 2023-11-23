import { Router } from 'express'
import { handlePolicies } from '../middewares/auth.middleware.js'

const router = Router()

router.get('/', handlePolicies(['USER']), (req, res) => {
    res.render('chat', { user: req.session.user.email })
})

export default router