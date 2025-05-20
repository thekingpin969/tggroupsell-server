import Database from "../db/mongodb"
import { randomUUID } from 'crypto'
const db = new Database()

async function invoice(req: any, res: any) {
    try {
        const { promoCode: code = null } = req.body
        const { id: userId } = req.tgUserData || {}

        const invoiceId = randomUUID()

        const { data: [promoCode] } = code ? await db.getLogs({ code, $or: [{ userid: userId }, { userid: null }] }, 'promoCodes') : { data: [] }

        const { data: cartItems } = await db.getLogs({ userId }, 'carts')
        if (cartItems.length <= 0) return res.status(400).send('cart is empty')

        const totalPrice = cartItems.reduce((acc: number, item: any) => {
            return acc + item.groupData.exactPrice
        }, 0)
        let totalDiscount: number = 0, discountPrice: number | null = totalPrice

        const price = discountPrice || totalPrice

        if (promoCode) {
            if (promoCode?.type == 'singleItem') {
                const validItems = cartItems.map((item: any) => item.groupData.exactPrice >= promoCode?.amount)
                totalDiscount = validItems.length * promoCode?.amount
                discountPrice = totalPrice - totalDiscount
            } else if (promoCode?.type == 'overall') {
                if (promoCode?.discountType == 'percentage') {
                    totalDiscount = +((totalPrice * promoCode?.amount) / 100).toFixed(0);
                    discountPrice = totalPrice - totalDiscount;
                } else {
                    totalDiscount = promoCode?.amount;
                    discountPrice = totalPrice - totalDiscount;
                }
            }
        }

        const data = {
            invoiceId,
            userId,
            createdAt: new Date().getTime(),
            amount: price,
            paid: false,
            priceDetails: { totalPrice, totalDiscount, discountPrice, toPay: price },
            cartItems: cartItems.map(item => +item.groupData.groupId)
        }

        await db.addLogs(data, 'invoices')
        res.status(200).send({ totalPrice, totalDiscount, discountPrice, invoiceId, cartItems: cartItems.map(item => +item.groupData.groupId) })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}


export default invoice