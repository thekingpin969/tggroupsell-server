import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import readline from "readline-sync";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Instructions for setting up environment variables:
// In your .env file or environment, define credentials for each user:
// TELEGRAM_USER_0_USERNAME=user1_username
// TELEGRAM_USER_0_API_ID=12345
// TELEGRAM_USER_0_API_HASH=abcdef123456
// TELEGRAM_USER_0_SESSION=your_session_string_for_user0
//
// TELEGRAM_USER_1_USERNAME=user2_username
// TELEGRAM_USER_1_API_ID=67890
// TELEGRAM_USER_1_API_HASH=fedcba654321
// TELEGRAM_USER_1_SESSION=your_session_string_for_user1
// ... and so on for additional users.

const clients: { username: string; client: InstanceType<typeof TelegramClient> }[] = [];
const configuredUsernames: string[] = [];

async function ConnectClients() {
    let i = 0;
    while (true) {
        const apiIdStr = process.env[`TELEGRAM_USER_${i}_API_ID`];
        const hash = process.env[`TELEGRAM_USER_${i}_API_HASH`];
        const session = process.env[`TELEGRAM_USER_${i}_SESSION`];
        const username = process.env[`TELEGRAM_USER_${i}_USERNAME`];

        if (!apiIdStr || !hash || !session || !username) {
            // Stop if any essential variable is missing for the current index
            if (i === 0 && (!apiIdStr || !hash || !session || !username)) {
                console.warn("No Telegram user credentials found in environment variables. Please set TELEGRAM_USER_0_API_ID, TELEGRAM_USER_0_API_HASH, TELEGRAM_USER_0_SESSION, and TELEGRAM_USER_0_USERNAME.");
            } else if (i > 0 && (!apiIdStr || !hash || !session || !username)) {
                console.log(`Found credentials for ${i} user(s). No more users found or incomplete configuration for user index ${i}.`);
            }
            break;
        }

        const apiId = parseInt(apiIdStr, 10);
        if (isNaN(apiId)) {
            console.error(`Invalid API_ID for user index ${i}. Please ensure it's a number.`);
            i++;
            continue; // Skip this user and try the next
        }

        const stringSession = new StringSession(session);
        const client = new TelegramClient(stringSession, apiId, hash, { connectionRetries: 5 });

        console.log(`Connection starts for ${username}`);
        try {
            await client.start({
                phoneNumber: async () => readline.question(`Enter your phone number for ${username} (or press Enter if session is valid): `),
                password: async () => readline.question(`Enter your password for ${username}: `),
                phoneCode: async () => readline.question(`Enter the OTP code sent to your Telegram for ${username}: `),
                onError: (err) => console.error(`Error connecting ${username}:`, err),
            });
            console.log(`Connection complete for ${username}`);
            clients.push({ username, client });
            if (!configuredUsernames.includes(username)) {
                configuredUsernames.push(username);
            }
        } catch (error) {
            console.error(`Failed to connect for ${username}:`, error);
            // Optionally, decide if you want to stop all connections or just skip this one.
            // For now, we'll skip and try the next.
        }
        i++;
    }
    return clients;
}

function getClient(username: string | null = null): InstanceType<typeof TelegramClient> {
    if (clients.length === 0) {
        throw new Error("No clients available. Ensure ConnectClients() has been called and succeeded.");
    }
    if (username) {
        const clientInstance = clients.find(item => item.username === username)?.client;
        if (clientInstance) {
            return clientInstance;
        }
        console.warn(`Client for username "${username}" not found. Returning a random client.`);
    }
    // Return a random client if no username is provided or if the specified username is not found
    return clients[Math.floor(Math.random() * clients.length)].client;
}

function getAUser() {
    if (configuredUsernames.length === 0) {
        // Attempt to populate configuredUsernames if it's empty and clients have not been connected yet
        // This logic assumes usernames are primarily sourced from environment variables during ConnectClients
        // If ConnectClients hasn't run, this will try to load them.
        let i = 0;
        while(true) {
            const username = process.env[`TELEGRAM_USER_${i}_USERNAME`];
            if (username) {
                if (!configuredUsernames.includes(username)) {
                   configuredUsernames.push(username);
                }
                i++;
            } else {
                break; // No more usernames found
            }
        }
        if (configuredUsernames.length === 0) {
            throw new Error("No users available. Ensure environment variables for users are set and ConnectClients has run.");
        }
    }
    const randomUsername = configuredUsernames[Math.floor(Math.random() * configuredUsernames.length)];
    // The original getAUser returned the whole user object.
    // Now, we only have usernames directly available here.
    // If other user-specific non-sensitive data is needed, it would have to be managed differently.
    // For now, returning the username, as the primary identifier.
    return { username: randomUsername };
}

export { ConnectClients, clients, getClient, getAUser, configuredUsernames };