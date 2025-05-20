import { Context, Markup, Scenes } from "telegraf";
import Wallet from "../keyboard/wallet";
import Database from "../../db/mongodb";
const db = new Database()

function AddPaymentMethod() {
    const stage = new Scenes.BaseScene('add_payment_method');

    stage.enter(async (ctx) => {
        await ctx.reply('Please enter a valid upi id for receiving your payment', Markup.keyboard([
            ['cancel']
        ]).resize());
    });

    stage.on('text', async (ctx: any) => {
        const userId = ctx?.chat?.id || ctx?.from?.id;
        const msg = ctx.message.text;

        if (msg.toLowerCase() === 'cancel') {
            await ctx.reply('process cancelled');
            ctx.scene.leave();
            return await Wallet(ctx)
        }

        const upiIdRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+$/;
        if (!upiIdRegex.test(msg)) {
            return await ctx.reply('invalid upi id')
        }

        await db.updateLog({ id: { userId }, data: { upiId: msg } }, 'wallet')
        await ctx.reply(`Your payment method has been updated successfully!`)
        ctx.scene.leave();
        await Wallet(ctx)

    })

    return stage;
}

export default AddPaymentMethod;