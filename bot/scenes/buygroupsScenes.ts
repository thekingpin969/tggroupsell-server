import { Context, Scenes } from "telegraf";
const BUY_GROUP_PASS = process.env.BUY_GROUP_PASS || ''
import back from "../commands/back";
import safeCompare from 'safe-compare'

function buygroupsScenes() {
    const stage = new Scenes.BaseScene('buygroups_auth');

    stage.enter(async (ctx) => {
        await ctx.reply('enter the auth password from admin', { reply_markup: { keyboard: [[{ text: 'cancel' }]], resize_keyboard: true, one_time_keyboard: true } });
    });

    stage.on('text', async (ctx: any) => {
        const pass = ctx.message.text.trim() || ''

        const passMatched = safeCompare(pass, BUY_GROUP_PASS)

        if (ctx.text.toLowerCase() === 'cancel') {
            ctx.scene.leave();
            return await back(ctx)
        }
        if (!passMatched) return await ctx.reply('invalid password!')

        await ctx.reply('login success')

        await back(ctx)
        ctx.scene.leave();
        return stage
    })
    return stage
}

export default buygroupsScenes