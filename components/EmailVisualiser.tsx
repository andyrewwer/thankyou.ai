import styles from "./email.module.css";
import {useState} from "react";

export default function EmailVisualiser(props) {
    const [to, setTo] = useState<string>("");
    const [subject, setSubject] = useState<string>("Thank you!");
    const [body, setBody] = useState<string>(props.body);

    const email = () => {
        location.href=`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    return <div className={styles.container}>
        <div className={styles.prompt}><label>Prompt</label> {props.prompt}</div>
        <div className={styles.subject}><label>To</label>
            <input type="text" placeholder="andrew.weeks@me.com"
                   value={to} onChange={(e) => setTo(e.target.value)}/>
        </div>
        <div className={styles.subject}><label>Subject</label>
            <input type="text" placeholder="Thank you!"
                   value={subject} onChange={(e) => setSubject(e.target.value)}/>
        </div>
        <div className={styles.body}>
            <label>Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)}/>
        </div>
        <button className={styles.email} onClick={email}>
            Email
            <img src="/thank-you-white.png" alt={"Thank You!"}/>
        </button>
    </div>
}
