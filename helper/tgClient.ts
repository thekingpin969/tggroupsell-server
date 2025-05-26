import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import fs from "fs";
import readline from "readline-sync";

const clients: { username: string; client: InstanceType<typeof TelegramClient> }[] = [];
const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));

async function ConnectClients() {
    for (const usr of users) {
        const { session, username, apiId, hash } = usr;

        const stringSession = new StringSession(session);
        const client = new TelegramClient(stringSession, apiId, hash, { connectionRetries: 5 });

        console.log(`Connection starts for ${username}`);
        await client.start({
            phoneNumber: async () => readline.question(`Enter your phone number for ${username}: `),
            password: async () => readline.question(`Enter your password for ${username}: `),
            phoneCode: async () => readline.question(`Enter the OTP code sent to your Telegram for ${username}: `),
            onError: (err) => console.log(err),
        });
        console.log(`Connection complete for ${username}`);
        clients.push({ username, client });

    }


    return clients;
}

function getClient(username: string | null = null): InstanceType<typeof TelegramClient> {
    if (clients.length === 0) {
        throw new Error("No clients available.");
    }
    const client = username
        ? clients.find(item => item.username == username)?.client || clients[Math.floor(Math.random() * clients.length)].client
        : clients[Math.floor(Math.random() * clients.length)].client;

    return client;
}

function getAUser() {
    if (users.length === 0) {
        throw new Error("No users available.");
    }
    const user = users[Math.floor(Math.random() * users.length)];
    return user;
}

export { ConnectClients, clients, getClient, getAUser };