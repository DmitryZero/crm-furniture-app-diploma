import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com"></link>
                <link href="https://fonts.googleapis.com/css2?family=Delicious+Handrawn&family=Titillium+Web:wght@200&display=swap" rel="stylesheet"></link>
                <link rel="preconnect" href="https://stijndv.com"></link>
                <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css"></link>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}