import Database from "../../db/mongodb"
const db = new Database()

async function removePromoCode(req: any, res: any) {
    try {
        const { code, userId = null } = req.body || {}
        if (!code) return res.status(400).send('code required')
        await db.clearLogs({ code, userId }, 'promoCodes')
        res.sensStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
}

export default removePromoCode
