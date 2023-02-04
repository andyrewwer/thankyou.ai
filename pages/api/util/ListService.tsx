import Database from './Database';
import {v4 as uuidv4} from 'uuid';
import {ThankYouList} from "../../../common/thankYou";
// const EncryptionService = require('./EncryptionService');

const LIST_TABLE_NAME = process.env.LIST_TABLE_NAME;

export type ThankYouRecord = {
    id: string,
    shareLink: string,
    listName: string,
    list: string
}

export const ListService = {
    save: async function (body: ThankYouList) {
        const record: ThankYouRecord = {
            id: uuidv4(),
            shareLink: uuidv4(),
            listName: body.listName,
            list: JSON.stringify(body.list)
        }

        await Database.save(LIST_TABLE_NAME, record);
        return record;
    },

    findByShareLink: async function (shareLink: string): Promise<ThankYouRecord> {
        return (await Database.findByField(LIST_TABLE_NAME, 'shareLink', shareLink))[0]
    },

    update: async function (body: ThankYouList) {
        const current = await ListService.findByShareLink(body.shareLink);
        if (!current) {
            return ListService.save(body);
        }
        const record: ThankYouRecord = {
            id: current.id,
            shareLink: current.shareLink,
            listName: body.listName,
            list: JSON.stringify(body.list)
        }
        await Database.update(LIST_TABLE_NAME, record, current.id)
        return record
    },
};