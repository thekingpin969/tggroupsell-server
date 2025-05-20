import Database from "../db/mongodb"
import getChat from "./getChat"
import { getClient } from "./tgClient"

const db = new Database()

async function transferOwnership(AssignedValidator: string) {
    try {
        const { data: [group] } = await db.getLogs({ AssignedValidator }, 'saleCompleted', {}, 1)
        if (!group) return console.log(`no groups for this validator: ${AssignedValidator}`)

        const client: any = getClient(group.AssignedValidator)

        await getChat(client, group.groupId)
        const groupId = group.groupId

        const updated_user = await client.invoke({ _: 'searchPublicChat', "username": "@Lone_W_olf" })
        await client.invoke({ _: 'getUser', user_id: updated_user.id })
        await client.invoke({ _: 'addChatMember', chat_id: groupId, user_id: updated_user.id })
        await client.invoke({
            _: "setChatMemberStatus", chat_id: groupId, member_id: { _: "messageSenderUser", "user_id": updated_user.id },
            status: {
                _: "chatMemberStatusAdministrator",
                // custom_title: "",
                can_be_edited: false,
                rights: { can_manage_chat: true, can_change_info: true, can_post_messages: true, can_edit_messages: true, can_delete_messages: true, can_invite_users: true, can_restrict_members: true, can_pin_messages: true, can_promote_members: true, can_manage_video_chats: true, can_post_stories: true, can_edit_stories: true, can_delete_stories: true, is_anonymous: false }
            }
        });
        await client.invoke({ _: "transferChatOwnership", chat_id: groupId, user_id: updated_user.id, password: process.env.TELEGRAM_2FA_PASS })

    } catch (error) {
        console.log(error)
    }
}

export default transferOwnership
