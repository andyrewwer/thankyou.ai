import Head from "next/head";
import {useState} from "react";
import styles from "./index.module.css";
import EmailVisualiser from "../components/EmailVisualiser";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setResult("");
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
      setResult(result.replaceAll('\n', '\n\n'));
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
      <GoogleOAuthProvider clientId="1087397770403-hbosj4rl65mc0pdq2f585e9r5bp3s47v.apps.googleusercontent.com">
      <Head>
        <title>Thank You.ai</title>
        <link rel="icon" href="/thank-you.png" />
      </Head>

      <Header/>
      <main className={styles.main}>
        <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            theme="filled_blue"
            shape="pill"
        />
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
        {!!result && <EmailVisualiser body={result} prompt={prompt}/>}
      </main>
      <Footer/>
      </GoogleOAuthProvider>
    </div>
  );
}

