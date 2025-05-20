import readline from "readline-sync";
import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";

const apiId = +readline.question('apiid: ');
const apiHash = readline.question('hash: ');

console.log(apiId, typeof apiId, apiHash)

const stringSession = new StringSession();

const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
});

await client.start({
    phoneNumber: async () => readline.question("Enter your phone number: "),
    password: async () => 'cch9szwd26',
    phoneCode: async () => readline.question("Enter the OTP code sent to your Telegram: "),
    onError: (err) => console.log(err),
});

const sessionsTRING = client.session.save()
console.log(sessionsTRING)