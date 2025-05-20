import Database from "../db/mongodb";

const db = new Database()

async function getBalance(userId: number) {
    try {
        const { data: [wallet] } = await db.getLogs({ userId }, 'wallet')
        return wallet
    } catch (error) {
        throw error
    }
}

export default getBalance;