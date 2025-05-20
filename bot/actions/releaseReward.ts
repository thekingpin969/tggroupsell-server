import { Context } from "telegraf";
import Database from "../../db/mongodb";
import createTransactions from "../../helper/createTransaction";
import getAdmins from "../../helper/getAdmins";
import saveGroupAdditionalInfo from "../../helper/saveGroupAdditionalInfo";
const db = new Database();

async function release_reward(ctx: any) {
    try {
        const groupId = ctx?.match[1];
        const userId = ctx?.chat?.id || ctx?.from?.id || 0;

        const { data: [group] } = await db.getLogs({ groupId: +groupId }, 'valid_groups');

        if (!group) return await ctx.reply("Group not found on our database.");

        const { AssignedValidator, price, paid, status, messagePrice, verified } = group;

        if (paid || status == 'completed') {
            return await ctx.reply("Reward already released.");
        }

        const totalPrice = +price + +messagePrice;
        const admins = await getAdmins(ctx, groupId) || [];

        const ownershipTransferred = admins.some(admin => admin.user?.username === AssignedValidator && admin.status === 'creator');

        if (!ownershipTransferred) {
            return await ctx.reply("Ownership not transferred to the validator. Please transfer ownership to @" + AssignedValidator + " and then click on the complete button again.");
        }

        const fillerMsg = await ctx.reply("Please wait, processing your request...");

        const { transaction } = await createTransactions(userId, totalPrice, 'pending');

        await db.updateLog({ id: { groupId: +groupId }, data: { paid: true, status: 'completed', transactionId: transaction.transactionId } }, 'valid_groups');

        await saveGroupAdditionalInfo(groupId, group, { paid: true, status: 'completed', transactionId: transaction.transactionId })

        await ctx.deleteMessages([ctx.callbackQuery?.message?.message_id || 0, fillerMsg.message_id]).then().catch();
        return await ctx.reply("Congratulations! 🎉 Your reward has been successfully released to your wallet.\n\nIf you have additional inactive groups, feel free to sell them here and earn rewards. You can also refer your friends to sell their inactive groups and earn a 5% commission on each successful sale.\n\nType /refer to get started.\n\nThank you for using our platform.");
    } catch (error) {
        console.error("Error in release_reward:", error);
        return await ctx.reply("An error occurred while processing your request. Please try again later.");
    }
}

export default release_reward;