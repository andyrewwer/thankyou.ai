import ThankYouTable from "../../components/ThankYouTable";
import { useRouter } from 'next/router'

//weird name is required, routes all /list, /list/* and /list/*/** here
//see more: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default function ThankYouTableContainer() {
    const router = useRouter()
    let shareLink = router.query.shareLink || [];
    shareLink = shareLink[0];

    return (
        <ThankYouTable shareLink={shareLink}/>
    );
}
