const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const fs = require("fs");
const readline = require("readline-sync");

const apiId = 24177120;
const apiHash = "dd7ff063cd5b65b308615b417df66ee5";

const savedSession = "1AQAOMTQ5LjE1NC4xNzUuNjABu53eVmuaO8JSe0U1xF/HGxlDVY84mCSEe/LoE6eFsCKEwlyx+aEadKmlj1C29s6Pw4QxXIN05Q4JdwXcVERa/NT5Si2MwYR6rrZE3Rsxj0sJsn7vowdiIeK5Mn2C4QL5cwBfnD+FxW6bxU8DsqX5QOkSAP6FQdUnUysJpk80UIDArCrUOlmgAX9x+EaMkQniadFRpYdKIZnM8OZ4y2erl4BHs9UmTXhYUQ49XTmsMZG3HW9SF6WmmB1gEdH7TQBYfRZ/8G69v3wOOKqHa+85lWPWrDzYy3lhX3GQnv1b/yUI459xISKw+O3snlfe78YDALFKQH8HWLJvo4mt3yveBfI=";
const stringSession = new StringSession(savedSession);
console.log(stringSession)

const groupId = -1002183592533;

const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
});

async function getFirstMessage() {
    await client.start({
        phoneNumber: async () => readline.question("Enter your phone number: "),
        password: async () => readline.question("Enter your password: "),
        phoneCode: async () => readline.question("Enter the OTP code sent to your Telegram: "),
        onError: (err) => console.log(err),
    });

    const sessionsTRING = client.session.save()

    var i = 0

    while (true) {
        console.log(`finding message with id`, i)
        const messages = await client.getMessages(groupId, { limit: 1, reverse: true, offsetId: i });
        const message = messages[0].message
        if (message) {
            const { date, message } = messages[0]
            const dateString = new Date(date * 1000)
            console.log(dateString.toISOString(), date, message)
            break
        }
        i++
    }
}

getFirstMessage().catch(console.error)