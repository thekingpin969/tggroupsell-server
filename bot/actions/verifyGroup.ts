import Database from "../../db/mongodb";
import ValidateGroup from "../../helper/validateGroup";
import getAdmins from "../../helper/getAdmins";
const db = new Database();

async function VerifyGroup(ctx: any) {
    try {
        const groupId = ctx.match[1];
        const userId = ctx.chat.id || ctx.from.id || 0;
        const { data: [group] } = await db.getLogs({ groupId: +groupId }, 'groups')
        if (!group) {
            console.log(`Group not found in the database ${groupId}`);
            return await ctx.reply(`Group not found in the database.`);
        }
        const admins = await getAdmins(ctx, groupId) || [];
        const validatedAdmins = ['tggroupsellbot', group?.AssignedValidator].every(username =>
            admins.some(admin => admin.user?.username === username)
        );

        if (!validatedAdmins) {
            return await ctx.reply(`Please add @tggroupsellbot & @${group?.AssignedValidator} to this group and make admin with these permissions\n  - Add members\n  - Create invite link\n• Change the chat history to visible`);
        }

        const userIsOwner = admins.some(admin => admin.user?.id === userId && admin.status === 'creator');
        if (!userIsOwner) {
            return await ctx.reply(`You are not the creator of this group. Only the creator can sell the group.`);
        }

        const { completed, data, eligible } = await ValidateGroup(group, group.AssignedValidator)

        if (!eligible) {
            return await ctx.replyWithHTML(`❌Verification Failed....\n\nOops, it seems like this group is not met our following requirements:\n <b>✅ The group must have been created before December 31, 2022.</b>\n\nIf your group meets this requirement but verification still fails, it may be due to one of the following reasons:\n\n<b>1. The bot or user has been removed from or demoted within the group.\n2. The group's chat history is not set to Visible.</b>\n\n<i>Double-check the requirements. If it still fails, it could be a Telegram bug — we're fixing it. Thanks for understanding!</i>`);
        } else {
            const validGroupRef = {
                ...group,
                ...data,
                verifiedAt: new Date().getTime(),
                status: 'verified',
                paid: false,
            }

            await db.addLogs(validGroupRef, 'valid_groups')
            const priceMsg = data.messageRequirementSatisfied ? `₹${data.price} + ₹${data.messagePrice}` : `₹${data.price}`
            const creationYear = new Date(data.created * 1000).getFullYear()
            await ctx.deleteMessage(ctx.callbackQuery?.message?.message_id).then().catch()
            return await ctx.reply(`Congratulations 🎉🥳...\n\nYour group has been successfully verified and is now eligible for sale under the following criteria:\n  • Creation Year: ${creationYear}\n  • Message Requirement: ${data.messageRequirementSatisfied ? 'satisfied  ✅' : 'not satisfied ❌'}\n  • Reward: ${priceMsg}\n\nTo claim your reward, please transfer the group ownership to @${group?.AssignedValidator}. Once completed, your reward will be credited to your wallet and made available for withdrawal.\n\nHave more old groups? Feel free to sell them too! Or refer your friends — earn 5% of each of their sales!\nType /refer to get started.`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "completed",
                                callback_data: `release_reward:${groupId}`,
                            },
                        ],
                    ],
                },

            })
        }
    } catch (error) {
        await ctx.reply('An error occurred while validating the group, please try again.');
        throw error

    }
}

export default VerifyGroup;