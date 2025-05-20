import { setup, TgBot } from "../bot/bot";
import Database from "../db/mongodb";
import getListingPrice from "./getListingPrice";
import getPrice from "./getPrices";
const IMG_BB_API = process.env.IMG_BB_API || 'e3dd05c984483f22556a37375a38fa72'
const db = new Database()

async function saveGroupAdditionalInfo(groupId: number, groupData: any = {}, addonInfo = {}) {
    try {
        const group: any = await TgBot.telegram.getChat(groupId)
        const memberCount = await TgBot.telegram.getChatMembersCount(groupId)

        const title = group.title || ''
        const type = group.username ? 'public' : 'private'
        const link = group.invite_link || ''
        const groupType = group.type || ''
        const username = group.username || null;
        const description = group.description || ''
        const photo = group?.photo?.big_file_id ? await TgBot.telegram.getFileLink(group.photo.big_file_id) || null : null
        const image = photo ? await fetch(photo).then(res => res.arrayBuffer()).then(async buffer => {
            const formData = new FormData();
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            formData.append('image', blob, 'group_photo.jpg');
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_API}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            return data.data.url;
        }) : null;

        const data = {
            ...groupData,
            ...addonInfo,
            title,
            type,
            link,
            groupType,
            username,
            description,
            image,
            memberCount,
            active: true,
            exactPrice: getListingPrice(groupData.created, groupData.messageRequirementSatisfied),
            time: new Date().getTime()
        }
        await db.addLogs(data, 'ready_groups')
        return data
    } catch (error) {
        console.error("Error in saveGroupAdditionalInfo:", error);
    }
}

// saveGroupAdditionalInfo(-1002686814638).then()

export default saveGroupAdditionalInfo;