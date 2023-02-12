import {NoteService} from "./util/NoteService";
import type {NextApiRequest, NextApiResponse} from 'next'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const {query, method} = req
    const shareLink = query.shareLink as string

    let record
    switch (method) {
        case 'GET':
            const note = await NoteService.findByShareLink(shareLink);
            if (!! note) {
                res.status(200).json(note)
            } else {
                res.status(404).end()
            }
            break
        case 'POST':
            record = await NoteService.save(req.body);
            res.status(200).json(record);
            break
        case 'PATCH':
            record = await NoteService.update(req.body);
            res.status(200).json({
                shareLink: record.shareLink,
                noteName: record.noteName,
                notes: JSON.parse(record.notes)
            });
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}