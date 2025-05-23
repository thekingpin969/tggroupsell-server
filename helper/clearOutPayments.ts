import { randomUUID } from "crypto";
import Database from "../db/mongodb";
import sendPayment from "./sendPayment";

const db = new Database()

async function clearOutPayments(groups: any[]) {
    try {
        const { data: items } = await db.getLogs({ groupId: { $in: groups } }, 'saleCompleted')
        const transactionsIds = items.map((item: any) => item.transactionId)
        const userIds = items.map((item: any) => item.userInfo.userId)

        const { data: transactions } = await db.getLogs({ transactionId: { $in: transactionsIds } }, 'transactions')
        const { data: wallets } = await db.getLogs({ userId: { $in: userIds } }, 'wallet')

        for (const trans of transactions) {
            const { amount, transactionId, userId } = trans
            try {
                const { upiId } = wallets.find(item => item.userId == userId)
                // await sendPayment(amount, upiId)
                const id = randomUUID()
                await db.addLogs({ ...trans, withdrawId: id, upiId, date: new Date().getTime() }, 'withdraws')
            } catch (error) {
                await db.updateLog({ id: { transactionId }, data: { status: 'failed', reason: error.message } }, 'transactions')
            }
        }


    } catch (error) {
        console.log(error)
    }
}


export default clearOutPayments