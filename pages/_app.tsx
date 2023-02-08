import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './styles.css'
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Toaster} from 'react-hot-toast';
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {TourProvider} from '@reactour/tour'

//for FontAwesome
config.autoAddCss = false

// This default export is required to support styles.css
export default function MyApp({Component, pageProps}) {

    const steps = [
        {
            selector: '#step-1',
            content: () => (
                <div>
                    <p>Welcome to <b>Thank you Assistant.</b></p>
                    <p>A simple platform to help you manage (& write) your thank you notes!</p>
                </div>)

        },
        {
            selector: '#step-2',
            content: 'Start by adding the gifts you receive here',
        },
        {
            selector: '#step-3',
            content: 'You can mark thank-yous as written/sent!',
        },
        {
            selector: '#step-4',
            content: 'If you are having problems writing thank-yous, click here and we\'ll generate one and help you send it!',
        },
        {
            selector: '#step-5',
            content: 'The list will auto-save every few seconds (and load changes made by others), but you can click here to save the latest progress!',
        },
        {
            selector: '#step-6',
            content: 'If you want, you can share the list with others here! It\'ll create a link you share around!',
        },
        {
            selector: '#step-7',
            content: `When you're ready, create a new list here!`,
        },
        {
            selector: '#step-8',
            content: `If you want to see this again, press here and you can see this again!`,
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