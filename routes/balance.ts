import Database from "../db/mongodb"
const db = new Database()

async function balance(req: any, res: any) {
    try {
        const { id: userId } = req.tgUserData || {}

        let { data: [wallet] } = await db.getLogs({ userId }, 'wallet')
        if (!wallet) {
            wallet = {
                userId,
                wallet: {
                    balance: 0,
                    spending: 0,
                    pending: 0,
                    total: 0,
                    locked: 0
                }
            }
            await db.addLogs(wallet, 'wallet')
        }

        res.status(200).send({ ...wallet.wallet })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export default balance