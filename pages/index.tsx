import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {GoogleOAuthProvider} from '@react-oauth/google';
import NoteGenerator from "./NoteGenerator";

export default function Home() {

    return (
        <div>
            <Head>
                <title>Thank You.ai</title>
                <link rel="icon" href="/thank-you.png"/>
            </Head>
            <GoogleOAuthProvider clientId="1087397770403-hbosj4rl65mc0pdq2f585e9r5bp3s47v.apps.googleusercontent.com">
                <Header/>
                <NoteGenerator/>
                <Footer/>
            </GoogleOAuthProvider>
        </div>
    );
}

