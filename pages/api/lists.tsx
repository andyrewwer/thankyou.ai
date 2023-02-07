import {ListService} from "./util/ListService";
import type {NextApiRequest, NextApiResponse} from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const {query, method} = req
    const shareLink = query.shareLink as string

    let record
    switch (method) {
        case 'GET':
            const list = await ListService.findByShareLink(shareLink);
            if (!! list) {
                res.status(200).json(list)
            } else {
                res.status(404).end()
            }
            break
        case 'POST':
            record = await ListService.save(req.body);
            res.status(200).json(record);
            break
        case 'PATCH':
            record = await ListService.update(req.body);
            res.status(200).json({
                shareLink: record.shareLink,
                listName: record.listName,
                list: JSON.parse(record.list)
            });
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}