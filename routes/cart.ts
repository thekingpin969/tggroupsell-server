import Database from "../db/mongodb"

const db = new Database()

async function cart(req: any, res: any) {
    try {
        const { groupId, add = true } = req.body || {}
        const { id: userId } = req.tgUserData || {}

        if (add) {

            const { data: [group] } = await db.getLogs({ groupId: +groupId }, 'ready_groups')
            if (!group) return res.sendStatus(404).send({ success: false, message: 'group not found!' })

            const data = { userId, groupId, groupData: group }
            await db.addLogs(data, 'carts')
        } else {
            await db.clearLogs({ groupId, userId }, 'carts', true)
        }

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export default cart