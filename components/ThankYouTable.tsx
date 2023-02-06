import styles from "./table.module.css";
import {Field, FieldArray, Form, Formik} from 'formik';
import {ThankYouList, ThankYouRow} from "../common/thankYou";
import {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import toast from 'react-hot-toast';
import {removeListFromLocalStorage, saveListToLocalStorage} from "../common/SessionService";
import Modal from 'react-modal';
import NoteGenerator from "../pages/generate-note";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

type table = {
    notes: ThankYouRow[],
    listName: string

}

export const createEmptyThankYouRow = (): ThankYouRow => {
    return ({
        name: '',
        gift: '',
        comment: '',
        thankYouWritten: false
    });
};

export default function ThankYouTable(props) {
    //For accessibility
    Modal.setAppElement('#__next');

    const [initialValues, setInitialValues] = useState<table>({
        listName: 'Thank You List #001',
        notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()]
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [input, setInput] = useState({msg: '', index: 0});
    const [shareLink, setShareLink] = useState(props.shareLink);
    const router = useRouter();

    useEffect(() => {
        if (!shareLink) {
            return
        }
        fetch(`/api/lists?shareLink=${shareLink}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            switch (res.status) {
                case 200:
                    res.json().then((val: ThankYouList) => {
                        let list = val.list;
                        list.push(createEmptyThankYouRow(), createEmptyThankYouRow())
                        setInitialValues({
                            notes: list,
                            listName: val.listName
                        });
                        toast.success(`Loaded list '${val.listName}'`)
                    }).catch(e => {
                        toast.error('Failed to fetch list')
                        console.log('inner error', e)
                    });
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
    }, [shareLink, setInitialValues])

    const save = async (values) => {
        const body: ThankYouList = {
            shareLink: shareLink,
            listName: values.listName,
            list: values.notes.slice(0, -2)
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
        await router.push("/lists");
        toast.success("Created new List. Make sure to press 'save'.")
    }

    const generate = (note: ThankYouRow, index) => {
        setInput({msg: `${note.gift} from ${note.name}`, index: index})
        setModalIsOpen(true);
    }

    const closeModal = (success = false) => {
        setModalIsOpen(false);
        //todo manually set `thankYou` to true here
        console.log('close Modal', success)
    }

    return <div className={styles.container}>
        <Formik key="notes" enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={save}>
            {(props) =>
                <Form>
                <Field name="listName" placeholder="Tracey & Andrew Baby Shower" />
                <button type="button" onClick={share}>Share</button>
                <button type="button" onClick={createNew}>Create new list</button>

                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>From</th>
                            <th>Gift</th>
                            <th>Comment</th>
                            <th style={{textAlign: "center"}} className={styles.lessPadding}>
                                <img src="/thank-you.png" className={styles.icon} alt={"Thank You!"}/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <FieldArray name="notes"
                                    render={arrayHelpers => {
                                        return (
                                            <>
                                                {props.values.notes.length > 0 && props.values.notes.map((r, index) => (
                                                    <tr key={index} className={r.thankYouWritten ? styles.completeRow : undefined}>
                                                        <td style={{textAlign: "center"}}>
                                                            <Field type="text" name={`notes.${index}.name`}
                                                                   placeholder="John Doe"
                                                                   onBlur={() => addOrRemoveRowsOnBlur(arrayHelpers, index)}/>
                                                        </td>
                                                        <td>
                                                            <Field type="text" name={`notes.${index}.gift`}
                                                                   placeholder="Brief Description of the Gift"/>
                                                        </td>
                                                        <td>
                                                            <Field type="text" name={`notes.${index}.comment`}
                                                                   placeholder="Any comments"/>
                                                        </td>
                                                        <td>
                                                            <div style={{display: "flex", gap: "0.5rem"}}>
                                                                <Field type="checkbox"
                                                                       name={`notes.${index}.thankYouWritten`}/>
                                                                <button type="button" className={styles.generateBtn} onClick={() => generate(r, index)}>
                                                                    Generate <img src="/thank-you.png" className={styles.icon} alt={"Thank You!"}/></button>
                                                            </div>
                                                        </td>
                                                    </tr>))}
                                            </>
                                        )
                                    }}/>
                        </tbody>
                    </table>
                    <div className="center">
                        <button type="submit"
                                style={{marginTop: "10px", justifySelf: "center"}}>Save
                        </button>
                    </div>
                </Form>}
        </Formik>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <NoteGenerator input={input.msg} hideInput={true} onEmailSend={closeModal}/>
        </Modal>

    </div>
}

const addOrRemoveRowsOnBlur = (arrayHelpers, index) => {
    //If you touch bottom two, add new row
    const notes = arrayHelpers.form.values.notes;

    //only remove rows if you didn't add a row
    addRowsToBottom(arrayHelpers, notes, index) || removeRowsFromBottom(arrayHelpers, notes, index);
}

const addRowsToBottom = (arrayHelpers, notes, index) => {
    if (index + 2 >= notes.length) {
        arrayHelpers.push(createEmptyThankYouRow());
        return true
    }
    return false
}

const removeRowsFromBottom = (arrayHelpers, notes, index) => {
    const thirdFromLastNote = notes[notes.length - 3];

    if (index === notes.length - 3) {
        if (!thirdFromLastNote.gift && !thirdFromLastNote.name) {
            arrayHelpers.pop();
        }
    }
}
