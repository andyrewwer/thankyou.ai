import styles from "./header.module.css";
import {useRouter} from 'next/router';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMessage} from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';
import {useState} from "react";
import Feedback from "./Feedback";

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

export default function Header() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const path = useRouter().asPath;

    return <ul className={styles.container}>
        <li className={styles.noRightBorder}>
            <div className={styles.flex} id="step-1">
                <img src="/thank-you.png" className={styles.icon} alt={"Thank You!"}/>
                <div className={styles.title}>Thank You Assistant</div>
            </div>
        </li>
        <li className={styles.break}/>
        <li className={/\/lists*/.test(path) ? styles.active : ''}><a href="/lists">Home</a></li>
        <li className={path === "/generate-note" ? styles.active : ''}><a href="/generate-note">Note Generator</a></li>
        <li className={styles.feedback}><a onClick={() => setModalIsOpen(true)}><FontAwesomeIcon icon={faMessage}/> Give Feedback </a></li>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={customStyles}
        >
            <Feedback/>
        </Modal>
    </ul>
}
