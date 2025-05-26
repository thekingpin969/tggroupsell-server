import Database from "../db/mongodb"
import clearOutPayments from "../helper/clearOutPayments"
import getBalance from "../helper/getBalance"
import getReceiverDetails from "../helper/getReceiverDetails"
const db = new Database()

async function checkout(req: any, res: any) {
    try {
        const { invoiceId, receiver } = req.body
        const { id: userId } = req.tgUserData || {} // userId is from trusted source

        if (!invoiceId || !receiver) return res.status(400).send('missing required fields!')

        // Validate invoiceId from req.body
        if (typeof invoiceId !== 'string') { // Assuming invoiceId is a string, adjust if number
            return res.status(400).send('Invalid invoiceId format.');
        }

        // Query is { invoiceId: validatedString, userId: trustedUserId, paid: false }
        // This is safe as keys are hardcoded, paid is hardcoded, userId is trusted,
        // and invoiceId is validated as a primitive string.
        const { data: [invoice] } = await db.getLogs({ invoiceId, userId, paid: false }, 'invoices');
        if (!invoice) return res.status(404).send('invoice not fount')
        const { amount, cartItems = [] } = invoice

        // const receiverDetails = await getReceiverDetails(receiver)
        // if (!receiverDetails) return res.status(404).send('receiver must be a user')

        // const wallet = await getBalance(userId)
        // const { wallet: { spending } } = wallet
        // if (+spending < amount) return res.status(400).send('insufficient balance')

        await db.updateLog({ data: { sold: true, soldAt: new Date().getTime() }, id: { groupId: { $in: cartItems } } }, 'ready_groups')
        await db.updateLog({ data: { paid: true }, id: { invoiceId } }, 'invoices')

        const pipeLine: any = [
            { $match: { groupId: { $in: cartItems } } },
            { $addFields: { transferCompleted: false, receiver, soldAt: new Date().getTime() } },
            { $merge: { into: "saleCompleted", on: "_id", whenMatched: "merge", whenNotMatched: "insert" } }
        ];
        await db.aggregate(pipeLine, 'ready_groups');
        db.aggregate(pipeLine, 'ready_groups')

        await db.clearLogs({ groupId: { $in: cartItems } }, 'carts', true)
        clearOutPayments(cartItems)
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }

}

export default checkout