import styles from "./header.module.css";
import {useRouter} from 'next/router';
export default function Header() {
    const path = useRouter().asPath;

    return <ul className={styles.container}>
            <li><div className={styles.flex}>
                <img src="/thank-you.png" className={styles.icon} alt={"Thank You!"}/>
                <div className={styles.title}>Thank You Assistant</div>
            </div></li>
            <li className={path === "/lists" ? styles.active : ''}><a href="/lists">Home</a></li>
            <li className={path === "/generate-note" ? styles.active : ''}><a href="/generate-note">Note Generator</a></li>
        </ul>
}
