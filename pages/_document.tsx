import { Html, Head, Main, NextScript } from 'next/document'
import React from 'react';

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="preload" href="https://use.typekit.net/twn6jxn.css"/>
                <link rel="stylesheet" href="https://use.typekit.net/twn6jxn.css"/>

                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap"
                    rel="stylesheet"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}