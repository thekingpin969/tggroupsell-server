import { Context } from "telegraf";

async function back(ctx: Context) {
    const keyboard = {
        keyboard: [
            [{
                text: "Select a Group",
                request_chat: {
                    request_id: 1,
                    chat_is_channel: false,
                    chat_is_created: true
                }
            }],
            // [{ text: "Send a Group", }],
            [{ text: "Earnings Breakdown", }, { text: "Refer Friends", }],
            [{ text: 'Wallet' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }

    return await ctx.reply('home', { reply_markup: keyboard })
}

export default back