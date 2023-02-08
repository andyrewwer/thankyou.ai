import styles from "./header.module.css";
import {useRouter} from 'next/router';
export default function Header() {
    const path = useRouter().asPath;

    return <ul className={styles.container}>
            <li className={styles.noRightBorder}><div className={styles.flex} id="step-1">
                <img src="/thank-you.png" className={styles.icon} alt={"Thank You!"}/>
                <div className={styles.title}>Thank You Assistant</div>
            </div></li>
            <li className={styles.break}/>
            <li className={/\/lists*/.test(path) ? styles.active : ''}><a href="/lists">Home</a></li>
            <li className={path === "/generate-note" ? styles.active : ''}><a href="/generate-note">Note Generator</a></li>
        </ul>
}
