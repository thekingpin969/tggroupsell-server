import { createClient, configure } from 'tdl';
import { getTdjson as TDjson } from 'prebuilt-tdlib';
import prompt from '../helper/prompt';

configure({ tdjson: TDjson() });

const appName = await prompt('name')

const client = createClient({
    apiId: +(await prompt('apiId')),
    apiHash: await prompt('apiHash'),
    databaseDirectory: `sessions/_td_database_${appName}`,
    filesDirectory: `sessions/_td_files_${appName}`
});

await client.login();

console.log(`login completed`)
process.exit(0)