import Head from "next/head";
import {useState} from "react";
import styles from "./index.module.css";

interface ThankYouNote {
  data: string;
  __html: string;
}

const emptyNote: ThankYouNote = {
  data: '',
  __html: ''
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ThankYouNote>(emptyNote);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setResult(emptyNote);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult({
        data: data.result,
        __html: data.result.trim().replaceAll('\n', '<br><br>')
      });
      setInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Thank You.ai</title>
        <link rel="icon" href="/thank-you.png" />
      </Head>

      <main className={styles.main}>
        <img src="/thank-you.png" className={styles.icon}/>
        <h3>Thank you note generator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Person, gift, event"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="Generate note" />
        </form>
        {!!loading && <div className={styles.loading}></div>}
        {!!result.__html && <>
          <div className={styles.result} dangerouslySetInnerHTML={result}></div>
          <button onClick={() => {navigator.clipboard.writeText(result.data)}}> Copy to Clipboard </button>
        </>}
      </main>
    </div>
  );
}
// TODO <a href="https://www.flaticon.com/free-icons/thank-you" title="thank you icons">Thank you icons created by Freepik - Flaticon</a>
