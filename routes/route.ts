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
import TelegramAuth from '../auth/telegramAuth';
import adminAuth from '../auth/adminAuth';

const router = express.Router();
router.use(express.json())
router.use(cors({ origin: '*' }))


// get requests
router.get('/', (_, res) => { res.sendStatus(200) })
router.get('/balance', TelegramAuth('user'), balance)
router.get('/getCarts', TelegramAuth('user'), getCarts)
router.get('/purchased', TelegramAuth('user'), purchased)
router.get('/getGroups', TelegramAuth('user'), getGroups)
router.get('/admin/getWithdraws', adminAuth, getWithdraws)
router.get('/getReceiverInfo', TelegramAuth('user'), getReceiverInfo)

// post requests
router.post('/adminLogin', login)
router.post('/cart', TelegramAuth('user'), cart)
router.post('/admin/updateBalance', adminAuth, updateBalance)
router.post('/admin/createPromoCode', adminAuth, createPromoCode)
router.post('/admin/removePromoCode', adminAuth, removePromoCode)
router.post('/invoice', TelegramAuth('user'), invoice)
router.post('/checkout', TelegramAuth('user'), checkout)
router.post('/admin/completeWithdraw', adminAuth, completeWithdraw)
router.post('/validatePromoCode', TelegramAuth('user'), validatePromoCode)

export default router