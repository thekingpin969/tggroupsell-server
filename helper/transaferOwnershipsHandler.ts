import schedule from 'node-schedule';
import { readFileSync } from 'fs'
import transferOwnership from './transferOwnership';

// WHAT We are aiming
// from one session - 4 account transfer per hour with random interval
// per day 24*4 96 transfers from one session
// total 10 sessions
//  96 * 10 = 960 transfers per day


// plan 
// schedule each session for each hour
// loop the sessions
// schedule 4 transfers in current hour for each sessions

function transferOwnershipHandler() {
    schedule.scheduleJob('0 0 * * *', { tz: 'Asia/Kolkata' }, async () => {
        console.log(`started scheduling for ${new Date()}`)
        ScheduleHourly()
    });
}

function ScheduleHourly() {
    const currentTime = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const hours: number[] = [];
    let nextHour: any = new Date();
    nextHour.setMinutes(0, 0, 0);

    if (currentTime.getMinutes() > 0 || currentTime.getSeconds() > 0 || currentTime.getMilliseconds() > 0) {
        nextHour.setHours(currentTime.getHours() + 1);
    } else {
        nextHour.setHours(currentTime.getHours());
    }

    while (nextHour <= endOfDay) {
        hours.push(nextHour.getTime());
        nextHour = new Date(nextHour);
        nextHour.setHours(nextHour.getHours() + 1);
    }

    for (const time of hours) {
        schedule.scheduleJob(new Date(time), () => {
            ScheduleSessions()
        });
        console.log(`Schedule set at: ${new Date(time)}`)
    }
}

function ScheduleSessions() {
    const crntTime = new Date().getTime();
    const nextHourTimeStamp = new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)).getTime();

    const users = JSON.parse(readFileSync('../users.json', { encoding: 'utf8' }) || '[]') || []
    for (const user of users) {
        const perHourTransferLimit = 4
        const Timestamps = Array.from({ length: perHourTransferLimit }, () =>
            Math.floor(crntTime + Math.random() * (nextHourTimeStamp - crntTime))
        );
        for (const time of Timestamps) {
            schedule.scheduleJob(new Date(time), () => {
                transferOwnership(user.username)
            });
        }

    }

}

export { transferOwnershipHandler, ScheduleHourly }