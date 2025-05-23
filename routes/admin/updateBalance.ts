import createTransactions from "../../helper/createTransaction"

async function updateBalance(req: any, res: any) {
    try {
        const { amount, userId, type } = req.body || {}
        if (!amount || !userId) return res.status(400).send('missing requires fields')
        await createTransactions(userId, amount, type, 'success', 'adminDeposit')
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
}

export default updateBalance