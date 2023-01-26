import styles from "./header.module.css";

export default function Header() {
    return <div className={styles.container}>
        <h3 className={styles.title}>Thank you note generator</h3>
        <img src="/thank-you.png" className={styles.icon} alt={"Thank You!"}/>
    </div>
}
