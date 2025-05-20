import { Context } from "telegraf";
import Database from "../../db/mongodb";
const db = new Database()

async function Wallet(ctx: any) {
    const userId = ctx.chat?.id || ctx.from?.id
    const { data: [wallet] } = await db.getLogs({ userId }, 'wallet')

    if (!wallet) {
        await ctx.reply('please wait, creating your wallet...')
        const data = {
            userId,
            wallet: {
                balance: 0,
                spending: 0,
                pending: 0,
                total: 0,
                locked: 0
            }
        }
        await db.addLogs(data, 'wallet')
        return ctx.scene.enter('add_payment_method')
    }

    const { wallet: { balance, pending, locked }, upiId } = wallet
    return await ctx.replyWithHTML(`Here is your wallet details:\n\n💰 Balance: <b>${balance || 0}</b>\n\n⏳ Pending: <b>${pending || 0}</b>\n\n🔒 Locked: <b>${locked || 0}</b>\n\n🪙 UPI ID: <b>${upiId || 'Not set'}</b>\n\n<i>the pending balance will be transferred to main balance after manual verification</i>`, {
        reply_markup: {
            keyboard: [
                [{ text: "Withdraw" }, { text: "Set Payment Method" }],
                [{ text: 'back' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
}

export default Wallet   