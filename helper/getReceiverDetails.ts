import Database from "../db/mongodb"

const db = new Database

async function getReceiverDetails(username: string) {
    try {
        username = username.replace('@', '')
        const { data: [user] } = await db.getLogs({ username }, 'users')
        return user
    } catch (error) {
        throw error
    }
}

export default getReceiverDetails