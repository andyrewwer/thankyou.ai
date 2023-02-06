import {useEffect, useState} from "react";
import styles from "./generate-note.module.css";
import EmailVisualiser from "../../components/EmailVisualiser";
import toast from "react-hot-toast";

export default function NoteGenerator(props) {
  const [input, setInput] = useState<string>(props.input);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    if (props.hideInput) {
      handleSubmit().then().catch();
    }
  }, [props.hideInput])

  async function onSubmit(event) {
    event.preventDefault();
    await handleSubmit();
  }

  const handleSubmit = async () => {
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
        toast.error(`Request failed with status ${response.status}`)
      }

      const result = data.result.trim();
      setResult(result.replaceAll('\n', '\n\n'));
      setResult(result.replaceAll('\n\n\n', '\n'));
      toast.success('Success! See response below')
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      toast.error(`Something went wrong 🙁`)
    } finally {
      setLoading(false);
    }
  }

    // const login = useGoogleLogin({
    //   onSuccess: tokenResponse => {
    //     console.log(tokenResponse);
    //     axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`).then(res => {
    //       console.log('user data', res.data)
    //     }).catch(e => console.error(e));
    //   },
    //   onError: errorResponse => console.error(errorResponse),
    //   onNonOAuthError: nonOAuthError => console.warn(nonOAuthError)
    // });

  return (
      <main className={styles.main}>
        {/*<GoogleButton onClick={login}/>*/}
        <form onSubmit={onSubmit}>
          {!props.hideInput && <>
          <input
            type="text"
            name="animal"
            placeholder="Person, gift, event"
            value={input}
            className={styles.input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" disabled={!input} value="Generate note" />
          </>}
        </form>
        {!!loading && <div className={styles.loading}></div>}
        {!!result && <EmailVisualiser body={result} prompt={input} onEmailSend={props.onEmailSend}/>}
      </main>
  );
}

