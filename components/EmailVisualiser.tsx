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
        <div className={styles.emailField}><label>To</label>
            <input type="text" placeholder="andrew.weeks@me.com, another-email@gmail.com"
                   value={to} onChange={(e) => setTo(e.target.value)}/>
        </div>
        <div className={styles.emailField}><label>Subject</label>
            <input type="text" placeholder="Thank you!"
                   value={subject} onChange={(e) => setSubject(e.target.value)}/>
        </div>
        <div className={styles.emailField}>
            <label>Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)}/>
        </div>
        <button className={styles.emailBtn} onClick={email}>
            Email
            <img src="/thank-you-white.png" alt={"Thank You!"}/>
        </button>
    </div>
}
