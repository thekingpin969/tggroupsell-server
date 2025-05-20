import { StringSession } from "telegram/sessions";
import { getClient } from "./tgClient";
import { TelegramClient } from "telegram";
import getPrice from "./getPrices";

async function ValidateGroup(group: any, validator: string) {
    console.log(validator)
    const client = getClient(validator)

    const messages = await client.getMessages(group.groupId, {
        limit: 500,
        reverse: true,
        offsetId: 0,
    });
    const validMessages = messages.filter(msg => (msg.message || msg.media) && msg.date);

    // const created = validMessages[0]?.date;
    // console.log(created)
    const created = 1577836800
    if (!created || created > 1672511399) return { completed: true, eligible: false, data: { created } };

    const messageCount = validMessages.length;

    const nextMonthFromCreated = new Date((created * 1000) + (1 * 30 * 24 * 60 * 60 * 1000)).getTime() / 1000;
    const createdMonthMessages = validMessages.filter(msg => msg.date < nextMonthFromCreated);
    const createdMonthMessagesCount = createdMonthMessages.length || 0;

    const price = getPrice(created)
    const messagePrice = createdMonthMessagesCount > 5 ? 50 : 0
    const messageRequirementSatisfied = createdMonthMessagesCount > 5 ? true : false

    return { completed: true, eligible: true, data: { created, messageCount, createdMonthMessagesCount, price, messagePrice, messageRequirementSatisfied } };
}

export default ValidateGroup;