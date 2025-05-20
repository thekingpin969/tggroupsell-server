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


// post requests
router.post('/cart', cart)
router.post('/validatePromoCode', validatePromoCode)
router.post('/createPromoCode', createPromoCode)
router.post('/checkout', checkout)
router.post('/invoice', invoice)

export default router