import safeCompare from 'safe-compare'

const ADMIN_PASS = process.env.ADMIN_PASS

async function login(req: any, res: any) {
    try {
        const { password = null } = req.body || {}

        if (!password) return res.status(400).send('password required!')

        const passMatched = safeCompare(password, ADMIN_PASS)
        if (!passMatched) return res.status(404).send('password invalid')

        return res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
}

export default login