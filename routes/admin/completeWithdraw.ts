import Database from "../../db/mongodb"
const db = new Database

async function completeWithdraw(req: any, res: any) {
    try {
        const { id, utr } = req.body || {}
        if (!id || !utr) return res.status(400).send('missing required fields!')

        // Validate 'id' (used in the query part of updateLog)
        if (typeof id !== 'string') { // Assuming 'id' should be a string. Adjust if it's a number.
            return res.status(400).send('Invalid ID format. ID must be a string.');
        }

        // Validate 'utr' (used in the data part of updateLog)
        if (typeof utr !== 'string') { // Assuming 'utr' should be a string.
            return res.status(400).send('Invalid UTR format. UTR must be a string.');
        }

        // Query id object is { withdrawId: validatedString } which is safe.
        // Data part { completed: true, utr: validatedString } is also safer.
        db.updateLog({ id: { withdrawId: id }, data: { completed: true, utr } }, 'withdraws');
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500)
    }
}

export default completeWithdraw