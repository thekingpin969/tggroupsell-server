
function isValidTelegramLink(link: string) {
    const regex = /^https?:\/\/t\.me\/(joinchat\/[a-zA-Z0-9_-]+|\+[a-zA-Z0-9_-]+|[a-zA-Z0-9_]{5,})$/;
    return regex.test(link);
}

export default isValidTelegramLink;