import styles from "./table.module.css";
import {Field, FieldArray, Form, Formik} from 'formik';

export type ThankYouRow = {
    name: string,
    gift: string,
    comment: string,
    thankYouWritten: boolean
}

export const createEmptyThankYouRow = (): ThankYouRow => {
    return ({
        name: '',
        gift: '',
        comment: '',
        thankYouWritten: false
    });
};

const initialValues = {
    notes: [createEmptyThankYouRow(), createEmptyThankYouRow(), createEmptyThankYouRow()],
};

export default function ThankYouTable(props) {

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

    return <div className={styles.container}>
        <h3>Event Name</h3>
        <button>Share</button>
        <Formik key="notes" initialValues={initialValues}
                onSubmit={async _values => {
                    alert(JSON.stringify(_values))
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
                                            {props.values.notes.length > 0 && (
                                                props.values.notes.map((r, index) => (
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
                                                    </tr>)))}
                                        </>
                                    )}/>
                        </tbody>
                    </table>
                    <div className="center">
                        <button type="submit"
                                style={{marginTop: "10px", justifySelf: "center"}}>Submit
                        </button>
                    </div>
                </Form>}
        </Formik>
    </div>
}
