import Database from "../db/mongodb"

const db = new Database

async function getReceiverDetails(username: string) {
    try {
        if (typeof username !== 'string') {
            // This check is more for robustness if the function is called from non-TS Javascript
            // or if the string type is bypassed with `any`.
            throw new Error('Username must be a string.');
        }
        const sanitizedUsername = username.replace('@', '');
        // Ensure query uses the sanitized primitive string directly.
        // The key 'username' is hardcoded, which is good.
        // The value sanitizedUsername is now validated as a string.
        const { data: [user] } = await db.getLogs({ username: sanitizedUsername }, 'users');
        return user;
    } catch (error) {
        throw error;
    }
}

export default getReceiverDetails;