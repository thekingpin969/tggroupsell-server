import { ConnectClients, getClient } from "./helper/tgClient"
import { setup } from "./bot/bot"
import Database from "./db/mongodb"
import { config } from "dotenv"
import express from 'express'
import router from "./routes/route"
import { connectTDlibClients, getClient as getTDlibClient } from "./TDlib/connectTDlibClients"
config({ path: "./.env" })

const app = express()
app.use(router)
app.use(express.json())

app.disable('x-powered-by')

await connectTDlibClients()
await ConnectClients()

const db = new Database()
await db.setDB()


app.listen(3000, () => {
    console.log(`Server running at http://localhost:${3000}`);
});
setup()