import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './styles.css'
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Toaster} from 'react-hot-toast';
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {TourProvider} from '@reactour/tour'
import {steps} from "../common/steps";

//for FontAwesome
config.autoAddCss = false

// This default export is required to support styles.css
export default function MyApp({Component, pageProps}) {

    return <GoogleOAuthProvider clientId="1087397770403-hbosj4rl65mc0pdq2f585e9r5bp3s47v.apps.googleusercontent.com">
        <TourProvider steps={steps}>
            <Head>
                <title>Thank You.ai</title>
                <link rel="icon" href="/thank-you.png"/>
            </Head>
            <Header/>
            <Component {...pageProps}/>
            <Footer/>
            <Toaster gutter={3} position="top-center" reverseOrder={false}/>
        </TourProvider>
    </GoogleOAuthProvider>
}