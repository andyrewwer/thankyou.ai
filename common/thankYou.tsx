export type ThankYouRow = {
    id: string,
    name: string,
    gift: string,
    comment: string,
    thankYouWritten: boolean
}

export type ThankYouRowDto = {
    id?: string,
    name: string,
    gift: string,
    comment: string,
    thankYouWritten: boolean,
    action?: string
}

export type ThankYouRecord = {
    id: string,
    shareLink: string,
    noteName: string,
    notes: string
}

export type ThankYouList = {
    id: string,
    shareLink?: string,
    noteName: string,
    notes: ThankYouRow[]
}

export type ThankYouRequest = {
    shareLink?: string,
    noteName: string,
    notes: ThankYouRowDto[]
}

export type ThankYouTable = {
    notes: ThankYouRow[],
    noteName: string
}