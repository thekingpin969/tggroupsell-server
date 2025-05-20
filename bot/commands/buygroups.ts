import { Context } from "telegraf";

async function buygroups(ctx: any) {
    return ctx.scene.enter('buygroups_auth')

}

export default buygroups;