import { Context } from "telegraf";

async function getAdmins(ctx: Context, groupId: number) {
    try {
        const botMember = await ctx.telegram.getChatAdministrators(groupId) || false;
        return botMember;
    } catch (error) {
        return null;
    }
}

export default getAdmins;