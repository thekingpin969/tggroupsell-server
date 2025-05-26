import createTransactions from "../../helper/createTransaction"

async function updateBalance(req: any, res: any) {
    try {
        const { amount, userId, type } = req.body || {};

        // Validate userId
        if (userId === undefined || userId === null) {
            return res.status(400).send('userId is required.');
        }
        if (typeof userId !== 'number') {
            return res.status(400).send('userId must be a number.');
        }

        // Validate amount
        if (amount === undefined || amount === null) {
            return res.status(400).send('amount is required.');
        }
        if (typeof amount !== 'number') {
            return res.status(400).send('amount must be a number.');
        }
        if (amount === 0) {
            return res.status(400).send('amount cannot be zero.');
        }

        // Assuming 'type' is also critical and has its validation elsewhere or has a safe default
        // For this task, 'type' is passed to createTransactions as is.
        // The createTransactions function already validates 'type' (implicitly via its 'to' parameter which is derived from 'type' or directly passed)
        
        await createTransactions(userId, amount, type, 'success', 'adminDeposit');
        res.sendStatus(200);
    } catch (error) {
        // Log the error for server-side inspection if necessary
        console.error("Error in updateBalance:", error);
        // If the error is from createTransactions (e.g., invalid 'to' type), it might throw.
        // Send a generic 500 error, or more specific if error handling is refined.
        res.status(500).send("An internal server error occurred.");
    }
}

export default updateBalance;