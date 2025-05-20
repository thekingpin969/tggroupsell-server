import Database from "../db/mongodb"
const db = new Database()

async function getCarts(req: any, res: any) {
    try {
        const { id: userId } = req.tgUserData || {}
        const { data: carts } = await db.getLogs({ userId }, 'carts')
        res.status(200).send([...carts])
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export default getCarts