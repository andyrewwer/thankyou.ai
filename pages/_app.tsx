import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './styles.css'
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Toaster} from 'react-hot-toast';
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {TourProvider} from '@reactour/tour'
import {setTutorialPlayed} from "../common/SessionService";

//for FontAwesome
config.autoAddCss = false

// This default export is required to support styles.css
export default function MyApp({Component, pageProps}) {

    const steps = [
        {
            selector: '#step-1',
            content: ({setIsOpen}) => (
                <div>
                    <p>Welcome to <b>Thank you Assistant.</b></p>
                    <p>A simple platform to help you manage (& write) your thank you notes!</p>
                    <DismissButton setIsOpen={setIsOpen}/>
                </div>)

        },
        {
            selector: '#step-2',
            content: ({setIsOpen}) => (
                <div>
                    <p>Start by adding the gifts you receive here</p>
                    <DismissButton setIsOpen={setIsOpen}/>
                </div>)
        },
        {
            selector: '#step-3',
            content: ({setIsOpen}) => (
                <div>
                    <p>You can mark thank-yous as written/sent!</p>
                    <DismissButton setIsOpen={setIsOpen}/>
                </div>)
        },
        {
            selector: '#step-4',
            content: ({setIsOpen}) => (
                <div>
                    <p>If you are having problems writing thank-yous, click here and we\'ll generate one and help you
                        send it!</p>
                    <DismissButton setIsOpen={setIsOpen}/>
                </div>)
        },
        {
            selector: '#step-5',
            content: ({setIsOpen}) => (
                <div>
                    <p>The list will auto-save every few seconds (and load changes made by others), but you can click
                        here to save the latest progress!</p>
                    <DismissButton setIsOpen={setIsOpen}/>
                </div>)
        },
        {
            selector: '#step-6',
            content: ({setIsOpen}) => (
                <div>
                    <p>If you want, you can share the list with others here! It\'ll create a link you share around!</p>
                    <DismissButton setIsOpen={setIsOpen}/>
                </div>)
        },
        {
            selector: '#step-7',
            content: ({setIsOpen}) => (
                <div>
                    <p>When you're ready, create a new list here!</p>
                    <DismissButton setIsOpen={setIsOpen}/>
                </div>)
        },
        {
            selector: '#step-8',
            content: ({setIsOpen}) => (
                <div>
                    <p>If you want to see this again, press here and you can see this again!</p>
                    <DismissButton setIsOpen={setIsOpen}/>
                </div>)
        },
        // ...
    ]

    return <GoogleOAuthProvider clientId="1087397770403-hbosj4rl65mc0pdq2f585e9r5bp3s47v.apps.googleusercontent.com">
        <TourProvider steps={steps}>
            <Head>
                <title>Thank You.ai</title>
                <link rel="icon" href="/thank-you.png"/>
            </Head>
            <Header/>
            <Component {...pageProps} />
            <Footer/>
            <Toaster gutter={3} position="top-center" reverseOrder={false}/>
        </TourProvider>
    </GoogleOAuthProvider>
}

const DismissButton = (props) => (<button
    style={{
        padding: "0.4rem 0.6rem",
        backgroundColor: "transparent",
        border: "1px solid var(--stone-4)",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "150",
        color: "var(--stone-8)",
        display: "block",
        margin: "1em auto"
    }}
    onClick={() => {
        setTutorialPlayed();
        props.setIsOpen(false);
    }}
>Don't show this again
</button>)