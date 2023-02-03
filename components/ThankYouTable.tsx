import styles from "./table.module.css";
import {Field, FieldArray, Form, Formik} from 'formik';
import {ThankYouList, ThankYouRow} from "../util/ListService";
import {useEffect, useState} from "react";

export const createEmptyThankYouRow = (): ThankYouRow => {
    return ({
        name: '',
        gift: '',
        comment: '',
        thankYouWritten: false
    });
};

export default function ThankYouTable() {
    const [initialValues, setInitialValues] = useState({notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()]});
    const [shareLink, setShareLink] = useState<string>('');

    useEffect(() => {
        //TODO dynamically check the path and "fetch" the new one from DB
        setInitialValues({notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()]})
        // const response = fetch("/api/lists?shareLink=123123-123123-123-12312", {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ input: 'input' }),
        // }).then(res => {
        //     res.json().then(r => console.log('response', r));
        // }).catch(e => console.log('error', e));
    }, [])

    const customOnChange = (arrayHelpers, setFieldValue, event, index) => {
        setFieldValue(event.target.name, event.target.value);

        //If you touch bottom two, add new row
        const notes = arrayHelpers.form.values.notes;
        if (index + 2 >= notes.length) {
            arrayHelpers.push(createEmptyThankYouRow());
            return;
        }

        const thirdFromLastNote = notes[notes.length - 3];
        if (index === notes.length - 3) {
            if (!thirdFromLastNote.gift && event.target.name.slice(-4) === 'name' && event.target.value === '') {
                arrayHelpers.pop();
            }
        } else {
            if (!thirdFromLastNote.name && !thirdFromLastNote.gift) {
                arrayHelpers.pop();
            }
        }
    }

    const save = async (values) => {
        const body: ThankYouList = {
            listName: 'Christmas 2022', //TODO make dynamic
            list: values.notes.slice(0, -2)
        }
        const response = await fetch("/api/lists?shareLink=123123-123123-123-12312", {
            method: !!shareLink ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        const data: ThankYouList = await response.json();
        console.log(data)
        setShareLink(data.shareLink);
    }

    return <div className={styles.container}>
        <h3>Event Name</h3>
        <button>Share</button>
        <Formik key="notes" initialValues={initialValues}
                onSubmit={async _values => {
                    await save(_values);
                    // alert(JSON.stringify(_values))
                }}>
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
                                    render={arrayHelpers => (
                                        <>
                                            {props.values.notes.length > 0 && props.values.notes.map((r, index) => (
                                                <tr key={index}>
                                                    <td style={{textAlign: "center"}}>
                                                        <Field type="text" name={`notes.${index}.name`} placeholder="John Doe"
                                                               onChange={(event) => customOnChange(arrayHelpers, props.setFieldValue, event, index)}/>
                                                    </td>
                                                    <td>
                                                        <Field type="text" name={`notes.${index}.gift`} placeholder="Brief Description of the Gift"/>
                                                    </td>
                                                    <td>
                                                        <Field type="text" name={`notes.${index}.comment`} placeholder="Any comments"/>
                                                    </td>
                                                    <td>
                                                        <Field type="checkbox" name={`notes.${index}.thankYouWritten`}/>
                                                    </td>
                                                </tr>))}
                                        </>
                                    )}/>
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
