import Database from "../../db/mongodb";
const db = new Database()

async function createPromoCode(req: any, res: any) {
    try {
        const { code, amount, userId = null, type, discountType }:
            { code: string; amount: number; type: 'overall' | 'singleItem'; userId: number | null; discountType: 'percentage' | 'flat' }
            = req.body

        const { data: [prevCode] } = await db.getLogs({ code, userId }, 'promoCodes')
        if (prevCode) return res.status(400).send('code already exist')

        if (!["singleItem", "overall"].includes(type)) {
            return res.status(400).send('invalid type defined for "type"');
        }
        if (!["flat", "percentage"].includes(discountType)) {
            return res.status(400).send('invalid type defined for "discountType"');
        }

        const data = {
            code,
            amount,
            type,
            discountType,
            userId,
            createdAt: new Date().getTime()
        }
        await db.addLogs(data, 'promoCodes')
        console.log('ok')
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

export default createPromoCode;
