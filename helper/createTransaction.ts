import Database from "../db/mongodb";
const db = new Database();

type status = 'pending' | 'success'
type to = 'balance' | 'pending' | 'locked' | 'total' | 'spending' | 'none'
type type = 'withdraw' | 'groupSellReward' | 'referral' | 'deposit' | 'purchase' | 'refund' | 'adminDeposit'

const ALLOWED_TO_VALUES: to[] = ['balance', 'pending', 'locked', 'total', 'spending', 'none'];

async function createTransactions(userId: number, amount: number, to: to, status: status = 'success', type: type = 'groupSellReward', additionalInfo = {}) {
    // Validate 'to' parameter
    if (!ALLOWED_TO_VALUES.includes(to)) {
        throw new Error(`Invalid 'to' parameter. Must be one of: ${ALLOWED_TO_VALUES.join(', ')}`);
    }

    // Validate 'amount' parameter
    if (typeof amount !== 'number') {
        throw new Error("Invalid 'amount' parameter. Must be a number.");
    }

    try {
        const transactionId = crypto.randomUUID();
        const data = {
            userId,
            transactionId,
            amount,
            to,
            status: status,
            type: type,
            ...additionalInfo,
            createdAt: new Date(),
        };
        await db.addLogs(data, 'transactions');

        if (to != 'none') {
            const updateQuery = { userId };
            const walletField = 'wallet.' + to;
            const pipeline: any = [
                { $match: updateQuery },
                { $set: { [walletField]: { $ifNull: [`$${walletField}`, 0] } } },
                { $set: { [walletField]: { $add: [`$${walletField}`, amount] } } },
                { $merge: { into: 'wallet', whenMatched: 'replace', whenNotMatched: 'insert' } },
            ];

            await db.aggregate(pipeline, 'wallet')
        }

        await db.updateLog({ id: { userId, transactionId }, data: { status: 'success' } }, 'transactions')

        return { success: true, transaction: data }
    } catch (error) {
        throw new Error(`Error creating transaction: ${error.message}`);
    }
}
export default createTransactions;