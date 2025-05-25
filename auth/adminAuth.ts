import safeCompare from 'safe-compare'

const ADMIN_PASS = process.env.ADMIN_PASS

function adminAuth(req: any, res: any, next: any) {
    try {
        const password = req.headers['adminPass'] as string | undefined;
        if (!password) return res.status(400).send('access denied!');

        const passMatched = safeCompare(password, ADMIN_PASS)
        if (!passMatched) return res.status(401).send('access denied!')

        next()
    } catch (error) {
        res.sendStatus(500)
    }

}

export default adminAuth