import styles from "./table.module.css";
import {Field, FieldArray, Form, Formik} from 'formik';
import {ThankYouList, ThankYouRow} from "../util/ListService";
import {useEffect, useState} from "react";
import {useRouter} from 'next/router'
import toast from 'react-hot-toast';

type table = {
    notes: ThankYouRow[]
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
    const [initialValues, setInitialValues] = useState<table>({notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()]});
    const {shareLink} = props;
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
                        setInitialValues({notes: list});
                        // toast.success(`Loaded ${val.listName}`)
                    }).catch(e => {
                        toast.error('Failed to fetch list')
                        console.log('inner error')
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
            listName: 'Christmas 2022', //TODO make dynamic
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
        if (!shareLink) {
            console.log('navigating')
            await router.push(`/lists/${data.shareLink}`);
        }
        toast.success('List Saved')
    }

    return <div className={styles.container}>
        <h3>Event Name</h3>
        <button>Share</button>
        <Formik key="notes" enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={save}>
            {(props) =>
                <Form>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>From</th>
                            <th>Gift</th>
                            <th>Comment</th>
                            <th style={{width: '10px'}}></th>
                        </tr>
                        </thead>
                        <tbody>
                        <FieldArray name="notes"
                                    render={arrayHelpers => {
                                        return (
                                            <>
                                                {props.values.notes.length > 0 && props.values.notes.map((r, index) => (
                                                    <tr key={index}>
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
                                                            <Field type="checkbox"
                                                                   name={`notes.${index}.thankYouWritten`}/>
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
