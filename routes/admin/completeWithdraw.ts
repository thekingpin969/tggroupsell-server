import Database from "../../db/mongodb"
const db = new Database

async function completeWithdraw(req: any, res: any) {
    try {
        const { id, utr } = req.body || {}
        if (!id || !utr) return res.status(400).send('missing required fields!')
        db.updateLog({ id: { withdrawId: id }, data: { completed: true, utr } }, 'withdraws')
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
}

export default completeWithdraw