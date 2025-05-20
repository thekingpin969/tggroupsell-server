import { Context } from "telegraf";
import Database from "../../db/mongodb";

const db = new Database()

async function Start(ctx: Context) {
    try {
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
        };

        ctx.reply(`Welcome to @tggroupsellbot! 🎉  
    
    💰 Turn Your Inactive Telegram Groups into Cash! 💰  
    
    We buy Telegram groups that meet these simple criteria:  
    ✅ Created before December 31, 2022
    ✅ No minimum member requirement (even 1 member is fine!)  
    
    Got a dead or inactive group? Sell it now and earn up to ₹285 per group! 🚀  
    
    🔄 No Limits – Sell Unlimited Groups!  
    
    💸 Earn Even More! Refer your friends and get 5% of their earnings for every group they sell!  
    
    🔥 Don't let old groups go to waste – trade them for cash today! Try it out now!`, {
            reply_markup: keyboard,
            parse_mode: "Markdown"
        });

        const userData = {
            userId: ctx.from?.id,
            username: ctx.from?.username,
            name: { firstName: ctx.from?.first_name, lastName: ctx.from?.last_name },
            joinedAt: new Date().getTime(),
            refereedBy: null
        }
        await db.updateLog({ id: { userId: userData.userId }, data: userData }, 'users', true)
    } catch (error) {
        console.log(error)
    }
}

export default Start;