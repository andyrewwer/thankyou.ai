export const getSavedNotesFromLocalStorage = () => {
    return localStorage.getItem('thankYouNotes') || ''
}

export const saveNotesToLocalStorage = (shareLink: string) => {
    return localStorage.setItem('thankYouNotes', shareLink);
}

export const removeNotesFromLocalStorage = () => {
    return localStorage.removeItem('thankYouNotes');
}

export const getTutorialPlayed = (): boolean => {
    return !!localStorage.getItem('tutorialPlayed') || false;
}

export const setTutorialPlayed = () => {
    return localStorage.setItem('tutorialPlayed', 'true');
}