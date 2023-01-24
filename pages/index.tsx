import Head from "next/head";
import {useState} from "react";
import styles from "./index.module.css";
import EmailVisualiser from "../components/EmailVisualiser";

export interface ThankYouNote {
  data: string;
  __html: string;
}

const emptyNote: ThankYouNote = {
  data: '',
  __html: ''
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
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

      const result = data.result.trim();

      setResult({
        data: result.replaceAll('\n', '\n\n'),
        __html: result.replaceAll('\n', '<br><br>')
      });
      setPrompt(input);
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
        <img src="/thank-you.png" className={styles.icon} alt={"Thank You!"}/>
        <h3>Thank you note generator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Person, gift, event"
            value={input}
            className={styles.input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" disabled={!input} value="Generate note" />
        </form>
        {!!loading && <div className={styles.loading}></div>}
        {!!result.__html && <EmailVisualiser result={result} prompt={prompt}/>}
      </main>
    </div>
  );
}
// TODO <a href="https://www.flaticon.com/free-icons/thank-you" title="thank you icons">Thank you icons created by Freepik - Flaticon</a>
