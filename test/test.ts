// import { StringSession } from "telegram/sessions";
// import { TelegramClient } from "telegram";
// import { writeFileSync } from "fs";

// const stringSession = new StringSession('1AQAOMTQ5LjE1NC4xNzUuNjABu53eVmuaO8JSe0U1xF/HGxlDVY84mCSEe/LoE6eFsCKEwlyx+aEadKmlj1C29s6Pw4QxXIN05Q4JdwXcVERa/NT5Si2MwYR6rrZE3Rsxj0sJsn7vowdiIeK5Mn2C4QL5cwBfnD+FxW6bxU8DsqX5QOkSAP6FQdUnUysJpk80UIDArCrUOlmgAX9x+EaMkQniadFRpYdKIZnM8OZ4y2erl4BHs9UmTXhYUQ49XTmsMZG3HW9SF6WmmB1gEdH7TQBYfRZ/8G69v3wOOKqHa+85lWPWrDzYy3lhX3GQnv1b/yUI459xISKw+O3snlfe78YDALFKQH8HWLJvo4mt3yveBfI=');
// const client = new TelegramClient(stringSession, 24177120, "dd7ff063cd5b65b308615b417df66ee5", { connectionRetries: 5 });
// await client.connect();

// const username = '@elanadkaran'
// const usr = await client.getEntity(username)
// const dp = await client.downloadProfilePhoto(usr)
// const photoPath = `./${username}_profile_photo.jpg`;
// dp && writeFileSync(photoPath, dp)

const { createClient, configure } = require('tdl');
const { getTdjson } = require('prebuilt-tdlib')

configure({ tdjson: getTdjson() })

const client = createClient({
    apiId: 24177120,
    apiHash: 'dd7ff063cd5b65b308615b417df66ee5',
    databaseDirectory: `../TDlib/sessions/_td_database_@Soulfo_x`,
    filesDirectory: `../TDlib/sessions/_td_files_@Soulfo_x`
})

await client.login()

const updated_user = await client.invoke({
    _: 'searchPublicChat',
    "username": "@Prime_Nexta"
})

// console.log(updated_user.id, updated_user.title, updated_user.photo.small
console.log(updated_user)

export { }