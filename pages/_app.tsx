import './styles.css'

// This default export is required to support styles.css
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}