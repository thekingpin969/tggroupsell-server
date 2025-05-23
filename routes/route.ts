import express from 'express'
import getGroups from './getGroups';
import cart from './cart';
import purchased from './purchased';
import cors from 'cors'
import balance from './balance';
import getCarts from './getCarts';
import validatePromoCode from './validatePromoCode';
import checkout from './checkout';
import invoice from './invoice';
import getReceiverInfo from './getReceiverInfo';
import login from './admin/login';
import getWithdraws from './admin/getWithdraws';
import completeWithdraw from './admin/completeWithdraw';
import updateBalance from './admin/updateBalance';
import createPromoCode from './admin/createPromoCode';
import removePromoCode from './admin/removePromoCode';

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
router.get('/admin/getWithdraws', getWithdraws)


// post requests
router.post('/cart', cart)
router.post('/validatePromoCode', validatePromoCode)
router.post('/admin/createPromoCode', createPromoCode)
router.post('/admin/removePromoCode', removePromoCode)
router.post('/checkout', checkout)
router.post('/invoice', invoice)
router.post('/adminLogin', login)
router.post('/admin/completeWithdraw', completeWithdraw)
router.post('/admin/updateBalance', updateBalance)

export default router