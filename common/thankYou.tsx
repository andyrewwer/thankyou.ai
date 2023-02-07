export type ThankYouRow = {
    id: string,
    name: string,
    gift: string,
    comment: string,
    thankYouWritten: boolean
}

export type ThankYouRowDto = {
    id: string,
    name: string,
    gift: string,
    comment: string,
    thankYouWritten: boolean,
    action: string
}

export type ThankYouRecord = {
    id: string,
    shareLink: string,
    listName: string,
    list: string
}

export type ThankYouList = {
    id: string,
    shareLink?: string,
    listName: string,
    list: ThankYouRow[]
}

export type ThankYouRequest = {
    shareLink?: string,
    listName: string,
    list: ThankYouRowDto[]
}

export type ThankYouTable = {
    notes: ThankYouRow[],
    listName: string
}