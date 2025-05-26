import { createClient, configure } from 'tdl';
import { getTdjson as TDjson } from 'prebuilt-tdlib';
import { readFileSync } from 'fs'

configure({ tdjson: TDjson() });

const users = JSON.parse(readFileSync('../users.json', 'utf-8'));

for (const usr of users) {
    console.log(`Connecting to ${usr.username}...`);

    const { username, apiId, hash } = usr;
    console.log(`Username: ${username}, API ID: ${apiId}, Hash: ${hash}`);
    const client = createClient({
        apiId: apiId,
        apiHash: hash,
        databaseDirectory: `sessions/_td_database_${username}`,
        filesDirectory: `sessions/_td_files_${username}`
    });
    await client.login();
    await client.close()
    console.log(`Connection complete for ${username}`);
    console.clear();
}
