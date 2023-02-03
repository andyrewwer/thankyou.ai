import {useState} from "react";
import styles from "./generate-note.module.css";
import EmailVisualiser from "../../components/EmailVisualiser";
import {useGoogleLogin} from '@react-oauth/google';
import GoogleButton from "../../components/GoogleButton";
import axios from "axios";

export default function NoteGenerator() {
  const [input, setInput] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setResult("");
      const response = await fetch("/api/prompt", {
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

    const login = useGoogleLogin({
      onSuccess: tokenResponse => {
        console.log(tokenResponse);
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`).then(res => {
          console.log('user data', res.data)
        }).catch(e => console.error(e));
      },
      onError: errorResponse => console.error(errorResponse),
      onNonOAuthError: nonOAuthError => console.warn(nonOAuthError)
    });

  return (
      <main className={styles.main}>
        <GoogleButton onClick={login}/>
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
  );
}

