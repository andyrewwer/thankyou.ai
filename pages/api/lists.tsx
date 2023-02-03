import {ListService} from "../../util/ListService";
import type {NextApiRequest, NextApiResponse} from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const {query, method} = req
    const shareLink = query.shareLink as string
    console.log(query, method, shareLink)

    let record
    switch (method) {
        case 'GET':
            const list = await ListService.findByShareLink(shareLink);
            // Get data from your database
            res.status(200).json({list: list})
            break
        case 'POST':
            record = await ListService.save(req.body);
            res.status(200).json(record);
            break
        case 'PATCH':
            console.log(req.body)
            record = await ListService.update(req.body);
            res.status(200).json(record);
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}