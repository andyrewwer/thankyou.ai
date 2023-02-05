import ThankYouTable from "../../components/ThankYouTable";
import {useRouter} from 'next/router'
import {getSavedListFromLocalStorage} from "../../common/SessionService";
import {useEffect, useState} from "react";

//weird name is required, routes all /list, /list/* and /list/*/** here
//see more: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default function ThankYouTableContainer() {
    const router = useRouter()
    const [shareLink, setShareLink] = useState('')

    useEffect(() => {

        let _shareLink = router.query.shareLink || [];
        _shareLink = _shareLink[0];

        if (!!_shareLink) {
            setShareLink(_shareLink)
            return;
        }
        const localStorageLink = getSavedListFromLocalStorage()
        if (!localStorageLink) {
            return
        }
        console.log('navigating')
        router.push(`/lists/${localStorageLink}`).then(() => {});
    }, [router, getSavedListFromLocalStorage])

    return (
        <ThankYouTable shareLink={shareLink}/>
    );
}
