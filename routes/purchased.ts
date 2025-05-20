import Database from "../db/mongodb"

const db = new Database()

async function purchased(req: any, res: any) {
    try {
        const { id: userId } = req.tgUserData || {}
        let { completed = 'true', pending = 'true' } = req.query || {}
        completed = completed === 'true' || completed === true;
        pending = pending === 'true' || pending === true;

        let logs
        if (completed && pending) {
            logs = await db.getLogs({ userId }, 'saleCompleted', { soldAt: -1 })
        } else if (pending) {
            logs = await db.getLogs({ userId, transferCompleted: false }, 'saleCompleted', { soldAt: -1 })
        } else {
            logs = await db.getLogs({ userId, transferCompleted: true }, 'saleCompleted', { soldAt: -1 })
        }

        const groups = logs?.data || []
        res.status(200).send({ data: groups })
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

export default purchased