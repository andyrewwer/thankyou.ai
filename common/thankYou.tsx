export type ThankYouRow = {
    name: string,
    gift: string,
    comment: string,
    thankYouWritten: boolean
}

export type ThankYouList = {
    shareLink?: string,
    listName: string,
    list: ThankYouRow[]
}
