import express from 'express'
import getGroups from './getGroups';
import cart from './cart';
import purchased from './purchased';
import cors from 'cors'
import balance from './balance';
import getCarts from './getCarts';
import validatePromoCode from './validatePromoCode';
import createPromoCode from './createPromoCode';
import checkout from './checkout';
import invoice from './invoice';
import getReceiverInfo from './getReceiverInfo';
import login from './admin/login';
import getWithdraws from './admin/getWithdraws';

const router = express.Router();
router.use(express.json())
router.use(cors({ origin: '*' }))

// get requests
router.get('/', (req, res) => { res.sendStatus(200) });
router.get('/getGroups', getGroups)
router.get('/purchased', purchased)
router.get('/balance', balance)
router.get('/getCarts', getCarts)
router.get('/getReceiverInfo', getReceiverInfo)
router.get('/getWithdraws', getWithdraws)


// post requests
router.post('/cart', cart)
router.post('/validatePromoCode', validatePromoCode)
router.post('/createPromoCode', createPromoCode)
router.post('/checkout', checkout)
router.post('/invoice', invoice)
router.post('/adminLogin', login)

export default router