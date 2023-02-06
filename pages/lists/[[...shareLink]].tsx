import ThankYouTableEl, {createEmptyThankYouRow} from "../../components/ThankYouTableEl";
import {useRouter} from 'next/router'
import {
    getSavedListFromLocalStorage,
    removeListFromLocalStorage,
    saveListToLocalStorage
} from "../../common/SessionService";
import {useEffect, useState} from "react";
import {ThankYouList, ThankYouRow, ThankYouTable} from "../../common/thankYou";
import toast from "react-hot-toast";
import styles from "../../components/table.module.css";
import {Field, Form, Formik} from "formik";

//weird name is required, routes all /list, /list/* and /list/*/** here
//see more: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default function ThankYouTableContainer() {
    const router = useRouter()
    const [shareLink, setShareLink] = useState('')
    const [initialValues, setInitialValues] = useState<ThankYouTable>({
        listName: 'Thank You List #001',
        notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()]
    });

    useEffect(() => {

        let _shareLink = router.query.shareLink || [];
        _shareLink = _shareLink[0];

        if (!_shareLink) {
            const localStorageLink = getSavedListFromLocalStorage()
            if (!localStorageLink) {
                return
            }
            router.push(`/lists/${localStorageLink}`).then();
            return
        }

        fetch(`/api/lists?shareLink=${_shareLink}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(async res => {
            switch (res.status) {
                case 200:
                    try {
                        const val: ThankYouList = await res.json()
                        let list = val.list;
                        list.push(createEmptyThankYouRow(), createEmptyThankYouRow())
                        setInitialValues({
                            notes: list,
                            listName: val.listName
                        });
                        setShareLink(val.shareLink)
                        toast.success(`Loaded list '${val.listName}'`)
                    } catch (e) {
                        toast.error('Failed to fetch list')
                        console.log('inner error', e)
                    }
                    break;
                case 404:
                    toast.error('List not found at this URL')
                    break;
                default:
                    toast.error('Something went wrong')
            }
        }).catch(e => {
            console.log('error', e);
            toast.error('Something went wrong 🙁')
        });
    }, [router, getSavedListFromLocalStorage])

    const save = async (_values) => {
        const _list = _values.notes.filter((item: ThankYouRow) => !!item.thankYouWritten || !!item.name || !!item.gift || !!item.comment);
        const body: ThankYouList = {
            shareLink: shareLink,
            listName: _values.listName,
            list: _list
        }
        const response = await fetch("/api/lists", {
            method: !!shareLink ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        const data: ThankYouList = await response.json();
        if (!shareLink || shareLink !== data.shareLink) {
            console.log('navigating')
            saveListToLocalStorage(data.shareLink)
            await router.push(`/lists/${data.shareLink}`);
        }
        toast.success('List Saved')
    }

    const share = async () => {
        if (!shareLink) {
            return toast.error("No saved list");
        }
        await navigator.clipboard.writeText(`${window.location.href}`);
        toast.success("Link copied to your clipboard")
    }

    const createNew = async () => {
        await removeListFromLocalStorage();
        setShareLink('');
        setInitialValues({
            listName: 'New List',
            notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()]
        })
        await router.push("/lists");
        toast.success("Created new List. Make sure to press 'save'.")
    }

    return (
        <div className={styles.container}>
            <Formik key="notes" enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={save}>
                    <Form>
                        <Field name="listName" placeholder="Tracey & Andrew Baby Shower"/>
                        <button type="submit">Save</button>
                        <button type="button" onClick={share}>Share</button>
                        <button type="button" onClick={createNew}>Create new list</button>

                        <ThankYouTableEl/>
                    </Form>
            </Formik>
        </div>

    );
}
