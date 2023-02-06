import styles from "./table.module.css";
import {Field, FieldArray, useFormikContext} from 'formik';
import {ThankYouRow, ThankYouTable} from "../common/thankYou";
import {useState} from "react";
import Modal from 'react-modal';
import NoteGenerator from "../pages/generate-note";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowDownLong, faArrowUpLong} from '@fortawesome/free-solid-svg-icons'
import toast from "react-hot-toast";

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

export const createEmptyThankYouRow = (): ThankYouRow => {
    return ({
        name: '',
        gift: '',
        comment: '',
        thankYouWritten: false
    });
};

export default function ThankYouTableEl() {
    //For accessibility
    Modal.setAppElement('#__next');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sortAscending, setSortAscending] = useState(true);

    const [modalState, setModalState] = useState({msg: '', index: 0});
    const {values, setValues, setFieldValue} = useFormikContext();


    const generate = (note: ThankYouRow, index) => {
        setModalState({msg: `${note.gift} from ${note.name}`, index: index})
        setModalIsOpen(true);
    }

    const closeModal = (success = false) => {
        if (success) {
            // @ts-ignore
            const notes: ThankYouRow[] = values.notes;
            notes[modalState.index].thankYouWritten = true;
            setFieldValue('notes', notes);
            toast.success("Marked thank-you as sent")
        }
        setModalIsOpen(false);
    }

    const sort = () => {
        const multiplier = sortAscending ? 1 : -1;
        // @ts-ignore
        const temp: ThankYouTable = Object.assign(values);
        temp.notes.sort((a, b) => {
            if (a.thankYouWritten) return 1 * multiplier;
            if (b.thankYouWritten) return -1 * multiplier;
            return 0;
        });
        setValues({...temp})
        setSortAscending(b => !b);
    }

    return <>
        <table className={styles.table}>
            <thead>
            <tr>
                <th>FROM</th>
                <th>GIFT</th>
                <th>COMMENT</th>
                <th style={{textAlign: "center"}} className={styles.lastColumn} onClick={sort}>
                    <div>
                        <span>SENT</span>
                        <img src="/thank-you.png" className={styles.icon} alt={"Thank You!"}/>
                        <FontAwesomeIcon className={sortAscending ? styles.activeIcon : undefined}
                                         icon={faArrowUpLong}/>
                        <FontAwesomeIcon className={!sortAscending ? styles.activeIcon : undefined}
                                         icon={faArrowDownLong}/>
                    </div>
                </th>
            </tr>
            </thead>
            <tbody>
            <FieldArray name="notes"
                        render={arrayHelpers => {
                            return (
                                <>
                                    {/*@ts-ignore*/}
                                    {values.notes.length > 0 && values.notes.map((r, index) => (
                                        <tr key={index}
                                            className={r.thankYouWritten ? styles.completeRow : undefined}>
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
                                                    <button type="button" className={styles.generateBtn}
                                                            onClick={() => generate(r, index)}>
                                                        Generate <img src="/thank-you.png"
                                                                      className={styles.icon}
                                                                      alt={"Thank You!"}/></button>
                                                </div>
                                            </td>
                                        </tr>))}
                                </>
                            )
                        }}/>
            </tbody>
        </table>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <NoteGenerator input={modalState.msg} hideInput={true} onEmailSend={closeModal}/>
        </Modal>
    </>
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
