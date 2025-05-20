import { Telegraf, Scenes, session, Context } from 'telegraf';
import start from './commands/start';
import OnChatShared from './actions/onChatShared';
import EarningsBreakdown from './keyboard/EarrningsBreakdown';
import AddGroupScene from './scenes/addGroupScene';
import VerifyGroup from './actions/verifyGroup';
import release_reward from './actions/releaseReward';
import Wallet from './keyboard/wallet';
import AddPaymentMethod from './scenes/addPaymentMethod';
import back from './commands/back';
import refer from './commands/refer';
import buygroups from './commands/buygroups';
import buygroupsScenes from './scenes/buygroupsScenes';
import { config } from 'dotenv'

config({ path: './.env' })
const TOKEN = "7916997430:AAGfPfVYr2XRZ5Ea1WXXU-i4WjRjwEMtlfk";
const TgBot = new Telegraf(TOKEN);

const addGroupScene: any = AddGroupScene()
const addPaymentMethodScene: any = AddPaymentMethod()
const buygroupsScenesScene: any = buygroupsScenes()

const stage: any = new Scenes.Stage([addGroupScene, addPaymentMethodScene, buygroupsScenesScene])

TgBot.use(session());
TgBot.use(stage.middleware())

// Commands
TgBot.start(start);
TgBot.command('refer', refer);
TgBot.command('back', back);
TgBot.command('buygroups', buygroups);
TgBot.command('id', (ctx: any) => ctx.reply(ctx.chat?.id))

// keyboard Actions
TgBot.hears('back', back)
TgBot.hears('Wallet', Wallet)
TgBot.hears('Refer Friends', refer)
TgBot.hears('Earnings Breakdown', EarningsBreakdown)
TgBot.hears('Send a Group', (ctx: any) => ctx.scene.enter('add_group'))
TgBot.hears('Set Payment Method', (ctx: any) => ctx.scene.enter('add_payment_method'))

// Additional Actions
TgBot.on("chat_shared", OnChatShared)
TgBot.action(/^verifyGroup:(.+)$/, VerifyGroup)
TgBot.action(/^release_reward:(.+)$/, release_reward)

const setup = () => {
    TgBot.launch(() => {
        console.log("Bot is running...");
    });
}

export { TgBot, setup }
