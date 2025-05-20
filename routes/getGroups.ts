import Database from "../db/mongodb"
const db = new Database()

async function getGroups(req: any, res: any) {
    try {
        const { id: userId } = req.tgUserData || {}

        const limit = parseInt(req.query.limit) || 50
        const dateLimit = parseInt(req.query.dateLimit) ?? null;

        const page = Math.max(1, parseInt(req.query.page) || 1)
        const skip = (page - 1) * limit

        const date: any = () => {
            const jan2022 = 1640995200;
            const jan2021 = 1609459200;
            const jan2020 = 1577836800;
            const jan2019 = 1546300800;

            const dec2022 = 1672511399;
            const dec2021 = 1640975399;
            const dec2020 = 1609439399;
            const dec2019 = 1577816999;
            switch (dateLimit) {
                case 2022:
                    return { start: jan2022, end: dec2022 };
                case 2021:
                    return { start: jan2021, end: dec2021 };
                case 2020:
                    return { start: jan2020, end: dec2020 };
                case 2019:
                    return { start: jan2019, end: dec2019 };
                case 0:
                    return { start: 0, end: jan2019 };
                default:
                    return { start: 0, end: (new Date().getTime() / 1000) };
            }
        }

        const pipeLine: any = [
            { $match: { active: true, created: { $lte: date().end, $gte: date().start }, sold: { $exists: false } } },
            { $sort: { verifiedAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'carts',
                    let: { groupId: "$groupId" },
                    pipeline: [
                        { $match: { $expr: { $and: [{ $eq: ["$groupId", "$$groupId"] }, { $eq: ["$userId", userId] }] } } }
                    ],
                    as: 'cartInfo'
                }
            },
            {
                $addFields: {
                    inCart: { $gt: [{ $size: "$cartInfo" }, 0] }
                }
            },
            { $project: { cartInfo: 0 } }
        ]
        const groups = await db.aggregate(pipeLine, 'ready_groups')
        const total = await db.countDocuments({ active: true, created: { $lte: date().end, $gte: date().start }, sold: { $exists: false } }, 'ready_groups')
        const totalPages = Math.ceil(total / limit)

        res.status(200).json({ success: true, groups, total, totalPages })
    } catch (error) {
        res.status(500).json({ success: false, message: 'something went wrong' })
    }
}

export default getGroups