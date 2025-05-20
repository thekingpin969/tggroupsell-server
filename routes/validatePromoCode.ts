import Database from "../db/mongodb"

const db = new Database()

async function validatePromoCode(req: any, res: any) {
    try {
        const { id: userId } = req.tgUserData || {}
        const { code } = req.body || {}
        const { data: [promoCode] } = await db.getLogs({ code, $or: [{ userid: userId }, { userid: null }] }, 'promoCodes')
        if (!promoCode) return res.status(404).send('invalid promo code')

        const { data: cartItems } = await db.getLogs({ userId }, 'carts')

        if (cartItems.length <= 0) return res.status(400).send('cart is empty')

        let totalDiscount: number = 0, discountPrice: number = 0

        if (promoCode.type == 'singleItem') {
            const validItems = cartItems.map((item: any) => item.groupData.exactPrice >= promoCode.amount)
            const totalPrice = cartItems.reduce((acc: number, item: any) => {
                return acc + item.groupData.exactPrice
            }, 0)
            totalDiscount = validItems.length * promoCode.amount
            discountPrice = totalPrice - totalDiscount
        } else if (promoCode.type == 'overall') {
            if (promoCode.discountType == 'percentage') {
                const totalPrice = cartItems.reduce((acc: number, item: any) => acc + item.groupData.exactPrice, 0);
                totalDiscount = +((totalPrice * promoCode.amount) / 100).toFixed(0);
                discountPrice = totalPrice - totalDiscount;
            } else {
                const totalPrice = cartItems.reduce((acc: number, item: any) => acc + item.groupData.exactPrice, 0);
                totalDiscount = promoCode.amount;
                discountPrice = totalPrice - totalDiscount;
            }
        }

        // console.log(promoCode, totalDiscount, discountPrice)
        return res.status(200).send({ discount: totalDiscount, discountedPrice: discountPrice })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export default validatePromoCode