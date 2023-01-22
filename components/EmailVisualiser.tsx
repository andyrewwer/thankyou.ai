import styles from "./email.module.css";
import {useState} from "react";
import {ThankYouNote} from "../pages";

export default function EmailVisualiser(props) {
    const body = {
        __html: `<label>Body</label> ${props.result.__html}`
    }
    const [to, setTo] = useState<string>("ajw@enfuse.io");
    const [subject, setSubject] = useState<string>("Thank you!");


    const email = (result: ThankYouNote) => {
        location.href=`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(props.result.data)}`
    }

    return <div className={styles.container}>
        <div className={styles.prompt}><label>Prompt</label> {props.prompt}</div>
        <div className={styles.subject}><label>To</label> {to}</div>
        <div className={styles.subject}><label>Subject</label> {subject}</div>
        <div className={styles.body} dangerouslySetInnerHTML={body}></div>
        <button className={styles.email} onClick={() => email(props.result)}>
            Email
            <img src="/thank-you-white.png" alt={"Thank You!"}/>
        </button>
    </div>
}
