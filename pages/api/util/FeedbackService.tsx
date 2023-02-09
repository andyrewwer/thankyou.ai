import Database from './Database';
import {v4 as uuidv4} from 'uuid';
// const EncryptionService = require('./EncryptionService');

const FEEDBACK_TABLE_NAME = process.env.FEEDBACK_TABLE_NAME || 'feedback';

type FeedbackRecord = {
    id: string,
    name: string,
    email: string,
    feedback: string
}

export const FeedbackService = {
    save: async function (body) {
        const record: FeedbackRecord = {
            id: uuidv4(),
            name: body.name,
            email: body.email,
            feedback: body.feedback
        }

        await Database.save(FEEDBACK_TABLE_NAME, record);
        return record;
    },
};