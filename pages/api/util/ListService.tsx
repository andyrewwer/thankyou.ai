import Database from './Database';
import {v4 as uuidv4} from 'uuid';
import {ThankYouList, ThankYouRecord, ThankYouRequest, ThankYouRow, ThankYouRowDto} from "../../../common/thankYou";
// const EncryptionService = require('./EncryptionService');

const LIST_TABLE_NAME = process.env.LIST_TABLE_NAME;

export const ListService = {
    save: async function (body: ThankYouRequest) {
        const toBeSaved = body.list
            .filter(item => item.action === 'ADD')
            .map((val:ThankYouRow) => ({
            id: val.id,
            name: val.name,
            gift: val.gift,
            comment: val.comment,
            thankYouWritten: val.thankYouWritten
        }))
        const record: ThankYouRecord = {
            id: uuidv4(),
            shareLink: uuidv4(),
            listName: body.listName,
            list: JSON.stringify(toBeSaved)
        }

        await Database.save(LIST_TABLE_NAME, record);
        return record;
    },

    findByShareLink: async function (shareLink: string): Promise<ThankYouList> {
        return (await Database.findByField(LIST_TABLE_NAME, 'shareLink', shareLink))[0]
    },

    update: async function (body: ThankYouRequest) {
        const current = await ListService.findByShareLink(body.shareLink);
        if (!current) {
            return ListService.save(body);
        }
        let list = current.list;
        for (let i = 0; i < body.list.length; i ++) {
            let item: ThankYouRowDto = body.list[i]
            if (item.action === 'ADD') {
                list.push({
                    id: item.id,
                    name: item.name,
                    gift: item.gift,
                    comment: item.comment,
                    thankYouWritten: item.thankYouWritten
                })
                continue;
            }

            if (item.action === 'EDIT') {
                const index = list.findIndex(obj => obj.id === item.id);
                if (index < 0) {
                    list.push({
                        id: item.id,
                        name: item.name,
                        gift: item.gift,
                        comment: item.comment,
                        thankYouWritten: item.thankYouWritten
                    })
                    console.log('adding instead of edit');
                    continue;
                }
                list[index] = {
                    id: item.id,
                    name: item.name,
                    gift: item.gift,
                    comment: item.comment,
                    thankYouWritten: item.thankYouWritten
                }
                continue;
            }

            if (item.action === 'DELETE') {
                const index = list.findIndex(obj => obj.id === item.id);
                if (index < 0 ) {
                    console.log('not found skipping deletion');
                    continue;
                }
                list.splice(index, 1);
                continue;
            }
            throw new Error('unrecognized action')

        }
        console.log('final list', list)
        const record: ThankYouRecord = {
            id: current.id,
            shareLink: current.shareLink,
            listName: body.listName,
            list: JSON.stringify(list)
        }
        await Database.update(LIST_TABLE_NAME, record, current.id)
        return record
    },
};