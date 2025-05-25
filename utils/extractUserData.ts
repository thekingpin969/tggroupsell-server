export interface UserData {
    [key: string]: any;
}

export default function extractUserData(data: string): UserData | null {
    const userRegex = /user=({.*})/;
    const match = data.match(userRegex);
    if (match && match[1]) {
        try {
            const userData: UserData = JSON.parse(match[1]);
            return userData;
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
    return null;
}