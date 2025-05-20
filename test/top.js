const { TDL } = require('tdl')
const { SocksProxyAgent } = require('socks-proxy-agent')
const prompt = require('prompt-sync')({ sigint: true })
const path = require('path')
const fs = require('fs')


// Replace with your Telegram API credentials
const API_ID = 24177120
const API_HASH = 'dd7ff063cd5b65b308615b417df66ee5'
const PHONE_NUMBER = '+17013809825'
const NEW_OWNER_USER_ID = 1534373901 // The user ID of the new owner
const GROUP_NAME = 'Freebie tasks chat'


// Create data directories if they don't exist
const tdlibPath = path.resolve(__dirname, 'tdlib')
if (!fs.existsSync(tdlibPath)) {
    fs.mkdirSync(tdlibPath, { recursive: true })
}

// Initialize TDLib
const client = new TDL({
    apiId: API_ID,
    apiHash: API_HASH,
    databaseDirectory: path.resolve(tdlibPath, 'database'),
    filesDirectory: path.resolve(tdlibPath, 'files'),
    tdlibParameters: {
        use_message_database: true,
        use_secret_chats: false,
        system_language_code: 'en',
        application_version: '1.0',
        device_model: 'Desktop',
        system_version: 'Unknown',
        enable_storage_optimizer: true
    }
})

async function transferGroupOwnership() {
    try {
        // Connect to TDLib
        await client.connect()
        console.log('Connected to TDLib')

        // Check authentication state
        const authState = await client.invoke({
            _: 'getAuthorizationState'
        })

        // Handle authentication based on state
        if (authState._ === 'authorizationStateWaitPhoneNumber') {
            console.log('Logging in with phone number...')
            await client.invoke({
                _: 'setAuthenticationPhoneNumber',
                phone_number: PHONE_NUMBER
            })

            const code = prompt('Enter authentication code: ')
            await client.invoke({
                _: 'checkAuthenticationCode',
                code: code
            })
        } else if (authState._ === 'authorizationStateWaitPassword') {
            const password = prompt('Enter your 2FA password: ')
            await client.invoke({
                _: 'checkAuthenticationPassword',
                password: password
            })
        }

        // Ensure we're fully logged in
        const newAuthState = await client.invoke({
            _: 'getAuthorizationState'
        })

        if (newAuthState._ !== 'authorizationStateReady') {
            console.log('Failed to log in:', newAuthState)
            return
        }

        console.log('Successfully logged in')

        // Get all chats
        const chats = await client.invoke({
            _: 'getChats',
            chat_list: { _: 'chatListMain' },
            limit: 100
        })

        let groupId = null

        // Find the group by name
        for (const chatId of chats.chat_ids) {
            const chat = await client.invoke({
                _: 'getChat',
                chat_id: chatId
            })

            if (chat.title === GROUP_NAME) {
                groupId = chatId
                console.log(`Found group: ${GROUP_NAME} with ID: ${groupId}`)
                break
            }
        }

        if (!groupId) {
            console.log(`Group '${GROUP_NAME}' not found in your chats`)
            await client.close()
            return
        }

        // Check if the new owner is a member of the group
        try {
            const memberInfo = await client.invoke({
                _: 'getChatMember',
                chat_id: groupId,
                member_id: { _: 'messageSenderUser', user_id: NEW_OWNER_USER_ID }
            })

            if (memberInfo.status._ === 'chatMemberStatusLeft') {
                console.log(`Error: User ${NEW_OWNER_USER_ID} is not a member of the group!`)
                await client.close()
                return
            }
        } catch (e) {
            console.log(`Error checking member status: ${e.message}`)
            await client.close()
            return
        }

        // Ask for 2FA password if needed for sensitive operations
        const password = prompt('Enter your 2FA password (leave empty if not set): ')

        // Transfer ownership
        const result = await client.invoke({
            _: 'transferChatOwnership',
            chat_id: groupId,
            user_id: NEW_OWNER_USER_ID,
            password: password
        })

        console.log('Ownership transfer result:', result)
        console.log(`Successfully transferred ownership to user ${NEW_OWNER_USER_ID}`)

    } catch (error) {
        console.error('Error:', error)
    } finally {
        // Close the client
        await client.close()
    }
}

// Run the main function
transferGroupOwnership()