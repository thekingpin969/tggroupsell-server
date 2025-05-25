import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import ExtractUserData from '../utils/extractUserData';

const mainBotToken = process.env.BOT_TOKEN as string;

type AuthType = 'user' | 'admin' | 'all';

interface TelegramUserData {
    [key: string]: any;
    auth_date?: number;
}

interface TelegramRequest extends Request {
    tgUserData?: TelegramUserData;
}

function TelegramAuth(type: AuthType = 'user') {
    return (req: any, res: any, next: any) => {
        if (type === 'all') return next();

        const botToken1 = mainBotToken;

        const dataString = req.headers['datastring'] as string | undefined;
        if (!dataString) return res.status(400).send('telegram authentication error');

        const initData = new URLSearchParams(dataString);
        if (typeof (initData as any).sort === 'function') (initData as any).sort();

        const hash = initData.get('hash');
        initData.delete('hash');

        const dataToCheck = [...initData.entries()].map(([key, value]) => `${key}=${value}`).join('\n');
        const secretKey1 = crypto.createHmac('sha256', 'WebAppData').update(botToken1 ?? '').digest();
        const _hash1 = crypto.createHmac('sha256', secretKey1).update(dataToCheck).digest('hex');


        const validUser = hash === _hash1
        if (!validUser) return res.status(400).send('telegram authentication error');

        const userData = ExtractUserData(dataToCheck) as TelegramUserData;
        userData.auth_date = +(new URLSearchParams(dataString).get('auth_date') || 0);
        req.tgUserData = userData;

        next();
    };
}

export default TelegramAuth;