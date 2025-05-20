import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import bigInt from "big-integer"

const session = new StringSession("1AQAOMTQ5LjE1NC4xNzUuNjABu53eVmuaO8JSe0U1xF/HGxlDVY84mCSEe/LoE6eFsCKEwlyx+aEadKmlj1C29s6Pw4QxXIN05Q4JdwXcVERa/NT5Si2MwYR6rrZE3Rsxj0sJsn7vowdiIeK5Mn2C4QL5cwBfnD+FxW6bxU8DsqX5QOkSAP6FQdUnUysJpk80UIDArCrUOlmgAX9x+EaMkQniadFRpYdKIZnM8OZ4y2erl4BHs9UmTXhYUQ49XTmsMZG3HW9SF6WmmB1gEdH7TQBYfRZ/8G69v3wOOKqHa+85lWPWrDzYy3lhX3GQnv1b/yUI459xISKw+O3snlfe78YDALFKQH8HWLJvo4mt3yveBfI="); // You should put your string session here
const client = new TelegramClient(session, 24177120, "dd7ff063cd5b65b308615b417df66ee5", {});

await client.connect()

// console.log(await client.getMe())
const userEntity = await client.getInputEntity(5072229760);


const result: Api.messages.Chats = await client.invoke(
    new Api.messages.GetChats({
        id: [BigInt("-1002632674809")],
    })
);
console.log(result);

const resultChats = await client.invoke(
    new Api.messages.AddChatUser({
        chatId: BigInt("-1002632674809"), // Ensure this is passed as a string to bigInt
        userId: userEntity, // Convert userId to BigInteger if necessary
        fwdLimit: 43, // Optional, can be set to 0
    })
);

console.log(resultChats);