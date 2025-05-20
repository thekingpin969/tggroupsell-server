async function getChat(client: any, groupId: number) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            try {
                const chat = await client.invoke({
                    _: 'getChat',
                    chat_id: groupId
                });
                resolve(chat)
            } catch (error) {
                console.log(`Direct chat access failed: ${error.message}`);
                console.log('Trying alternative methods to access the group...');

                if (groupId > 0) {
                    await client.invoke({
                        _: 'getBasicGroup',
                        basic_group_id: groupId
                    })
                    const fullInfo = await client.invoke({
                        _: 'getBasicGroupFullInfo',
                        basic_group_id: groupId
                    });
                    resolve(fullInfo)
                } else {
                    const superGroupId = groupId.toString().startsWith('-100') ?
                        parseInt(groupId.toString().substring(4)) :
                        Math.abs(groupId);
                    await client.invoke({
                        _: 'getSupergroup',
                        supergroup_id: superGroupId
                    });
                    const fullInfo = await client.invoke({
                        _: 'getSupergroupFullInfo',
                        supergroup_id: superGroupId
                    });
                    resolve(fullInfo)
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

export default getChat