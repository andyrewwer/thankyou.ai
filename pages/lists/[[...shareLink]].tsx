import ThankYouTableEl, {createEmptyThankYouRow} from "../../components/ThankYouTableEl";
import {useRouter} from 'next/router'
import {
    getSavedListFromLocalStorage, getTutorialPlayed,
    removeListFromLocalStorage,
    saveListToLocalStorage
} from "../../common/SessionService";
import {useEffect, useRef, useState} from "react";
import {ThankYouList, ThankYouRequest, ThankYouRow, ThankYouRowDto, ThankYouTable} from "../../common/thankYou";
import toast from "react-hot-toast";
import styles from "./lists.module.css";
import {Field, Form, Formik} from "formik";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowsRotate, faCheckCircle, faCirclePlus, faUserPlus, faCircleQuestion} from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import {useTour} from "@reactour/tour";

//weird name is required, routes all /list, /list/* and /list/*/** here
//see more: https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default function ThankYouTableContainer() {
    const router = useRouter();
    const formikRef = useRef(null);
    const [shareLink, setShareLink] = useState('')
    const [saved, setSaved] = useState(true)
    const [initialValues, setInitialValues] = useState<ThankYouTable>({
        listName: 'Thank You List #001',
        notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()]
    });
    const [savedList, setSavedList] = useState<ThankYouRow[]>([]);
    const { setIsOpen, setCurrentStep } = useTour()

    let saveTimeoutInterval;

    useEffect(() => {
        if (!getTutorialPlayed()) {
            setIsOpen(true);
            // setTutorialPlayed(); // button don't show me again
        }
    }, [setIsOpen]);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

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

        axios.get(`/api/lists?shareLink=${_shareLink}`).then(res => {
            if (res.status === 200) {
                try {
                    const val: ThankYouList = res.data;
                    let list = val.list;
                    setSavedList(val.list)
                    setInitialValues({
                        listName: val.listName,
                        notes: [...list, createEmptyThankYouRow(), createEmptyThankYouRow()],
                    });
                    setShareLink(val.shareLink)
                    toast.success(`Loaded list '${val.listName}'`)
                } catch (e) {
                    toast.error('Failed to fetch list')
                    console.log('inner error', e)
                }
            } else if (res.status === 404) {
                toast.error('List not found at this URL');
                removeListFromLocalStorage();
            } else {
                toast.error('Something went wrong')
            }
        }).catch(e => {
            console.log('error', e);
            toast.error('Something went wrong 🙁')
        });
    }, [router, getSavedListFromLocalStorage])

    const save = async (_values) => {
        let inputFiltered = _values.notes
            .filter((item: ThankYouRow) => !!item.thankYouWritten || !!item.name || !!item.gift || !!item.comment);

        const _add: ThankYouRowDto[] = inputFiltered
            .filter((a: ThankYouRow) => {
                return !savedList.some((b: ThankYouRow) => a.id === b.id)})
            .map((item: ThankYouRow): ThankYouRowDto => ({
                id: item.id,
                name: item.name,
                gift: item.gift,
                comment: item.comment,
                thankYouWritten: item.thankYouWritten,
                action: "ADD"
            }));

        const _edit: ThankYouRowDto[] = inputFiltered
            //don't save if it's already saved
            .filter((a: ThankYouRow) =>
                savedList.some((b: ThankYouRow) => a.id === b.id &&
                    (a.name !== b.name || a.gift !== b.gift || a.comment !== b.comment || a.thankYouWritten !== b.thankYouWritten)))
            .map((item: ThankYouRow): ThankYouRowDto => ({
                id: item.id,
                name: item.name,
                gift: item.gift,
                comment: item.comment,
                thankYouWritten: item.thankYouWritten,
                action: "EDIT"
            }));


        const _remove: ThankYouRowDto[] = savedList
            .filter((a: ThankYouRow) => {
                return _values.notes.some((b: ThankYouRow) =>
                    a.id === b.id && !b.thankYouWritten && !b.name && !b.gift && !b.comment)
            })
            .map((item: ThankYouRow): ThankYouRowDto => ({
                id: item.id,
                name: item.name,
                gift: item.gift,
                comment: item.comment,
                thankYouWritten: item.thankYouWritten,
                action: "DELETE"
            }));

        const body: ThankYouRequest = {
            shareLink: shareLink,
            listName: _values.listName,
            list: [..._add, ..._edit, ..._remove]
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
        toast.success('List Saved');
        setSaved(true);
        setSavedList(data.list);
        setInitialValues({
            listName: data.listName,
            notes: [...data.list, createEmptyThankYouRow(), createEmptyThankYouRow()]
        });
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
        setSavedList([])
        setInitialValues({
            listName: 'New List',
            notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()]
        })
        await router.push("/lists");
        toast.success("Created new List. Make sure to press 'save'.")
    }

    const formChanged = () => {
        const formikFiltered = formikRef.current.values.notes.filter(el => !!el.name || !!el.gift || !!el.comment)
        if (formikFiltered.length === 0) {
            return;
        }

        if (JSON.stringify(formikFiltered) === JSON.stringify(savedList)) {
            return;
        }
        setSaved(false);

        if (!!saveTimeoutInterval) {
            clearTimeout(saveTimeoutInterval);
        }
        saveTimeoutInterval = setTimeout(() => {
            setSaved(s => {
                //fancy way to get state inside a setTimeout
                if (!s) {
                    save(formikRef.current.values).then();
                }
                return s;
            })

        }, 3000);
    }

    return (
        <div className={styles.container}>
            <Formik key="notes" enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={save}
                    innerRef={formikRef}>
                <Form>
                    <div className={styles.tableHeader}>
                        <Field name="listName" id="step-6" placeholder="Tracey & Andrew Baby Shower"/>
                        <button type="submit" id="step-5">{!saved ?
                            <><FontAwesomeIcon icon={faArrowsRotate}/> Saving ...</> :
                            <><FontAwesomeIcon icon={faCheckCircle}/> Saved</>}
                        </button>
                        <div className={styles.break}/>
                        <button type="button" id="step-7" onClick={share}>Share <FontAwesomeIcon icon={faUserPlus}/></button>
                        <button type="button" id="step-8" onClick={createNew}>New <FontAwesomeIcon icon={faCirclePlus}/></button>
                        <button type="button" id="step-9" className={styles.lastButton} onClick={() => {
                            setCurrentStep(0);
                            setIsOpen(true);
                        }}><FontAwesomeIcon icon={faCircleQuestion}/></button>
                    </div>
                    <div id="step-2">
                        <ThankYouTableEl formChanged={formChanged}/>
                    </div>
                </Form>
            </Formik>
        </div>

    );
}
