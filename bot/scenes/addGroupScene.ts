import { Markup, Scenes } from "telegraf";
import Sleep from "../../utils/sleep";
import Database from "../../db/mongodb";
import isValidTelegramLink from "../../utils/isValidTelegramLink";
const db = new Database()

function AddGroupScene() {
    const stage = new Scenes.BaseScene('add_group');

    stage.enter(async (ctx) => {
        await ctx.reply('Please send me the group link', Markup.keyboard([
            ['cancel']
        ]).resize());
    });

    stage.on('text', async (ctx: any) => {
        try {
            const msg = ctx.message.text;

            if (msg.toLowerCase() === 'cancel') {
                await ctx.reply('process cancelled', Markup.keyboard([
                    [{ text: "Send a Group" }],
                    [{ text: "Earnings Breakdown" }, { text: "Refer Friends" }]
                ]).resize());
                return ctx.scene.leave();
            }

            const validLink = isValidTelegramLink(msg)
            if (!validLink) return await ctx.reply('invalid group link')

            const filler = await ctx.reply('plz wait, verifying group');

            const data = {
                group_link: msg,
                user_id: ctx.from.id,
                date: Date.now(),
                status: 'pending'

            }
            await db.addLogs(data, 'groups')
            await ctx.deleteMessage(filler.message_id)

            await ctx.reply(`We've received your group details....\n\nOur team is currently reviewing it, and once the verification is complete, we'll contact you right here. After that, you’ll be able to sell your group instantly and receive your payment.\n\n⚡ Verifications usually take less than an hour.\n\nIn the meantime, refer your friends to sell their ghost groups and earn 5% of their profits every time they make a sale!
     \nUse /refer to get started.`, Markup.keyboard([
                [{ text: "Send a Group" }],
                [{ text: "Earnings Breakdown" }, { text: "Refer Friends" }]
            ]).resize());
            return ctx.scene.leave();
        } catch (error) {
            console.log(error)
        }
    });

    return stage;
}

export default AddGroupScene;
