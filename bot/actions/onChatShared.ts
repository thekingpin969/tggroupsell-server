import Database from "../../db/mongodb";
import { getAUser } from "../../helper/tgClient";
const db = new Database()

async function OnChatShared(ctx: any) {
    try {
        const msg = ctx.message
        const groupId = msg.chat_shared.chat_id;
        ctx.reply(`plz wait validating group`);

        const { data: [group] } = await db.getLogs({ groupId: +groupId }, 'valid_groups')

        if (group) {
            ctx.reply(`This group has already been sold...`);
            return
        }

        const { username } = getAUser()
        console.log(username)
        const groupData = {
            groupId,
            AssignedValidator: username,
            userInfo: {
                userId: ctx.from.id,
                username: ctx.from.username,
                firstName: ctx.from.first_name,
                lastName: ctx.from.last_name,
            },
            verified: false,
            status: 'pending',
            addedAt: new Date().getTime(),
        }
        await db.clearLogs({ groupId: +groupId }, 'groups')
        await db.addLogs(groupData, 'groups')

        ctx.reply(
            `Hey, we've received your request, now we need to verify the group\n\nBefore initiating the verification, we need you to perform some actions\n\n • Add @tggroupsellbot & @${groupData.AssignedValidator} to this group and make admin with these permissions\n  - Add members\n  - Create invite link\n• Change the chat history to visible\n\n<i>Please click the verify button below. A temporary user will be added to the group — kindly do not remove the user or the bot until the sale is finalized.</i>`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Verify",
                                callback_data: `verifyGroup:${groupId}`,
                            },
                        ],
                    ],
                },
                parse_mode: "HTML",
            }
        );

    } catch (error) {
        console.log(error)
        ctx.reply(`could't handle this group plz provide the group invite link`);
    }

}

export default OnChatShared;