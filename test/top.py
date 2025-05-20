import asyncio
import os
from telegram.client import Telegram

# Generate a secure random encryption key
encryption_key = os.urandom(32)  # Generates a 32-byte encryption key

# Path to the TDLib shared library (DLL)
library_path = 'path_to_tdjson.dll'  # Replace with the actual path to tdjson.dll

# Initialize the Telegram client
tg = Telegram(
    api_id= 24177120,
    api_hash='dd7ff063cd5b65b308615b417df66ee5',
    phone='+17013809825',
    database_encryption_key=encryption_key,
    library_path=library_path  # Specify the path to the TDLib shared library
)   

async def main():
    # Start the client
    await tg.login()

    # Replace with your group chat ID
    chat_id = -1002165376692

    # Replace with the user ID of the new owner
    new_owner_user_id = 1534373901

    # Promote the new user to admin
    await tg.call_method('promoteChatMember', {
        'chat_id': chat_id,
        'user_id': new_owner_user_id,
        'can_change_info': True,
        'can_post_messages': True,
        'can_edit_messages': True,
        'can_delete_messages': True,
        'can_invite_users': True,
        'can_restrict_members': True,
        'can_pin_messages': True,
        'can_promote_members': True,
    })

    # Transfer ownership
    await tg.call_method('transferChatOwnership', {
        'chat_id': chat_id,
        'user_id': new_owner_user_id,
        'password': 'YOUR_PASSWORD'  # This is your 2FA password if enabled
    })

    print('Ownership transferred successfully')

    # Stop the client
    await tg.stop()

if __name__ == '__main__':
    asyncio.run(main())