import { getClient } from "../helper/tgClient"

async function getReceiverInfo(req: any, res: any) {

    try {
        const { username = null } = req.query

        if (!username) return res.status(400).send('username required!')

        const client = getClient()
        const usr: any = await client.getEntity(username)
        if (!usr) return res.sendStatus(404)

        const info = {
            userId: usr.id.valueOf(),
            username,
            firstName: usr?.firstName,
            lastName: usr?.lastName,
        }

        res.status(200).send(info)
    } catch (error) {
        console.log(error)
        res.sendStatus(404)
    }
}

export default getReceiverInfo