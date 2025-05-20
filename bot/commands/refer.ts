import { Context } from "telegraf";

async function refer(ctx: Context) {
    const userId = ctx?.from?.id;
    const referLink = `https://t.me/${ctx.botInfo.username}?start=${userId}`;
    await ctx.replyWithHTML(`Refer your friends to sell their dead old groups here and earn flat 5% commission on each sale.\n${referLink}\n\ntotal friends referred: 0\ntotal earnings: ₹0\n\n<i>Share this link with your friends and earn commission on each sale they make. You can also share this link in groups or channels to reach a wider audience.</i>`);
}

export default refer;