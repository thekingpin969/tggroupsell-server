import fs from "fs";
import { createClient, configure, Client } from 'tdl';
import { getTdjson as TDjson } from 'prebuilt-tdlib';

configure({ tdjson: TDjson() });

const clients: { username: string; client: Client }[] = [];

const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

async function connectTDlibClients() {
    for (const usr of users) {
        const { username, apiId, hash } = usr;
        const client = createClient({
            apiId: apiId,
            apiHash: hash,
            databaseDirectory: `./TDlib/sessions/_td_database_${username}`,
            filesDirectory: `./TDlib/sessions/_td_files_${username}`
        });

        await client.login()
        console.log(`Connection complete for ${username}`);
        clients.push({ username, client });
    }
}

function getClient(username = null): Client {
    if (clients.length === 0) {
        throw new Error("No clients available.");
    }
    const client = username
        ? clients.find(item => item.username == username)?.client || clients[Math.floor(Math.random() * clients.length)].client
        : clients[Math.floor(Math.random() * clients.length)].client;

    return client;
}


export { connectTDlibClients, getClient }