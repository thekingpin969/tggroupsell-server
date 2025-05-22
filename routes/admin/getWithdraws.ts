import Database from "../../db/mongodb"
const db = new Database()

async function getWithdraws(req: any, res: any) {
    try {
        const now = new Date().getTime()

        const { data: [data] } = await db.getLogs(
            { $and: [{ $or: [{ holdUntil: { $exists: false } }, { holdUntil: { $lte: now } }] }, { $or: [{ completed: { $exists: false } }, { completed: false }] }] }, 'withdraws', { data: 1 }, 1
        )

        if (!data) return res.status(404).send('no pending withdrawals')
        db.updateLog({ data: { holdUntil: now + (1000 * 60 * 1) }, id: { _id: data._id } }, 'withdraws')
        res.status(200).send(data)
    } catch (error) {
        res.sendStatus(5000)
    }
}
export default getWithdraws
