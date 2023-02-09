import type {NextApiRequest, NextApiResponse} from 'next'
import {FeedbackService} from "./util/FeedbackService";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const record = await FeedbackService.save(req.body);
    res.status(200).json(record);
}