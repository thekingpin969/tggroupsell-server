import path from "path";

const { createClient, configure } = require('tdl');
const { getTdjson } = require('prebuilt-tdlib')

configure({ tdjson: getTdjson() })

const client = createClient({
    apiId: 24177120,
    apiHash: 'dd7ff063cd5b65b308615b417df66ee5',
})

await client.login()

// const res = await client.invoke({ _: 'canTransferOwnership' })
// console.log(res)

// process.exit(0)

// const chat = await client.invoke({
//     _: 'getSupergroup',
//     supergroup_id: 2515562948
// });

// const chat = await client.invoke({
//     _: 'getChats',
//     limit: 1000
// });
// console.log(chat);

// const fullInfo = await client.invoke({
//     _: 'getSupergroupFullInfo',
//     supergroup_id: 2515562948
// });

// console.log(fullInfo)

// const admins = await client.invoke({
//     _: 'getChatAdministrators',
//     chat_id: -1002632674809
// });

// console.log(admins)


// const updated_user = await cli`ent.invoke({
//     _: 'searchPublicChat',
//     "username": "@Lone_W_olf"
// })

// console.log(updated_user.id)

// const user = await client.invoke({
//     _: 'getUser',
//     user_id: updated_user.id
// })

// console.log(user)

// const addMember = await client.invoke({
//     _: 'addChatMember',
//     chat_id: -1002632674809,
//     user_id: updated_user.id
// })

// console.log(addMember)

// const admin = await client.invoke({
//     _: "setChatMemberStatus",
//     "chat_id": -1002632674809,
//     member_id: {
//         _: "messageSenderUser",
//         "user_id": updated_user.id
//     },
//     status: {
//         _: "chatMemberStatusAdministrator",
//         custom_title: "watch me",
//         can_be_edited: false,
//         rights: {
//             can_manage_chat: true,
//             can_change_info: true,
//             can_post_messages: true,
//             can_edit_messages: true,
//             can_delete_messages: true,
//             can_invite_users: true,
//             can_restrict_members: true,
//             can_pin_messages: true,
//             can_promote_members: true,
//             can_manage_video_chats: true,
//             can_post_stories: true,
//             can_edit_stories: true,
//             can_delete_stories: true,
//             is_anonymous: false,
//         }
//     }

// });
// console.log(admin)

// const transferOwnerShip = await client.invoke({
//     _: "transferChatOwnership",
//     chat_id: -1002632674809,
//     user_id: updated_user.id,
//     password: 'cch9szwd26'
// })

// console.log(transferOwnerShip)`

const messages = await client.invoke({
    _: "getChatHistory",
    "chat_id": -1001378334291,     // Replace with your group ID
    "from_message_id": 0,          // Start from the oldest possible message
    "offset": 0,
    "limit": 5,
    "only_local": false
})
console.log(messages)