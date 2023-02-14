import styles from "./table.module.css";
import buttons from '../common/buttons.module.css';
import {Field, FieldArray, useFormikContext} from 'formik';
import {ThankYouRequest, ThankYouRow, ThankYouRowDto, ThankYouTable} from "../common/thankYou";
import {useEffect, useState} from "react";
import Modal from 'react-modal';
import NoteGenerator from "../pages/generate-note";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowDownLong, faArrowUpLong} from '@fortawesome/free-solid-svg-icons'
import toast from "react-hot-toast";
import {v4 as uuidv4} from 'uuid';

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
const REMOVE_ROWS_FROM_BOTTOM = process.env.NEXT_PUBLIC_REMOVE_ROWS_FROM_BOTTOM === 'true'

export const createEmptyThankYouRow = (): ThankYouRow => {
    return ({
        id: uuidv4(),
        name: '',
        gift: '',
        comment: '',
        thankYouWritten: false
    });
};

export default function ThankYouTableEl(props) {
    const {formChanged, handleBlur} = props;

    //For accessibility
    Modal.setAppElement('#__next');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sortAscending, setSortAscending] = useState(null);

    const [modalState, setModalState] = useState({msg: '', index: 0});
    // @ts-ignore
    const {values, setValues, setFieldValue}: {values: ThankYouRequest, setValues: (values: ThankYouRequest) => void, setFieldValue: (field: string, value: any) => void} = useFormikContext();

    useEffect(() => {
        formChanged();
    }, [values]);

    const generate = (note: ThankYouRowDto, index) => {
        setModalState({msg: `${note.gift} from ${note.name}`, index: index})
        setModalIsOpen(true);
    }

    const closeModal = (success = false) => {
        if (success) {
            const notes: ThankYouRowDto[] = values.notes;
            notes[modalState.index].thankYouWritten = true;
            setFieldValue('notes', notes);
            toast.success("Marked thank-you as sent")
        }
        setModalIsOpen(false);
    }

    const sort = () => {
        const multiplier = sortAscending ? 1 : -1;
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
                        <FontAwesomeIcon className={sortAscending === false ? styles.activeIcon : undefined}
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
                                    {values.notes.length > 0 && values.notes.map((r, index) => (
                                        <tr key={index}
                                            className={r.thankYouWritten ? styles.completeRow : undefined}>
                                            <td style={{textAlign: "center"}}>
                                                <Field type="hidden" name={`notes.${index}.id`}/>
                                                <Field type="text" name={`notes.${index}.name`}
                                                       placeholder="John Doe"
                                                       onBlur={() => {
                                                           handleBlur();
                                                           addOrRemoveRowsOnBlur(arrayHelpers, index)
                                                       }}/>
                                            </td>
                                            <td>
                                                <Field type="text" name={`notes.${index}.gift`}
                                                       placeholder="Brief Description of the Gift"
                                                       onBlur={() => {
                                                           handleBlur();
                                                           addOrRemoveRowsOnBlur(arrayHelpers, index)
                                                       }}/>
                                            </td>
                                            <td>
                                                <Field type="text" name={`notes.${index}.comment`}
                                                       onBlur={() => handleBlur()}
                                                       placeholder="Any comments"/>
                                            </td>
                                            <td>
                                                <div style={{display: "flex", gap: "0.5rem"}}>
                                                    <Field type="checkbox"
                                                           name={`notes.${index}.thankYouWritten`}
                                                           id={index === 0 ? "step-3" : `written${index}`}/>
                                                    <button type="button" className={`${buttons.basicButton} ${buttons.flexButton}`}
                                                            onClick={() => generate(r, index)}
                                                            id={index === 0 ? "step-4" : `written${index}`}>
                                                        Generate <img src="/thank-you.png"
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
    if (!REMOVE_ROWS_FROM_BOTTOM) {
        return;
    }
    const thirdFromLastNote = notes[notes.length - 3];

    if (index === notes.length - 3) {
        if (!thirdFromLastNote.gift && !thirdFromLastNote.name && !thirdFromLastNote.comment) {
            arrayHelpers.pop();
        }
    }
}
