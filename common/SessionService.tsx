export const getSavedListFromLocalStorage = () => {
    return localStorage.getItem('thankYouList') || ''
}

export const saveListToLocalStorage = (shareLink: string) => {
    return localStorage.setItem('thankYouList', shareLink);
}
