import React, {FunctionComponent, useEffect} from "react";
import {AppProps} from 'next/app';
import '../styles/globals.scss';
import {OverlaysProvider} from '@blueprintjs/core';
import Script from 'next/script';
import * as gtag from "../lib/gtag";
import {IntlErrorCode, NextIntlClientProvider} from 'next-intl';

const MyApp: FunctionComponent<AppProps> = ({ Component, router, pageProps }) => {

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url);
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);

    // TODO
    const googleAnalyticsId = 'G-'

    return (
        <>
            <Script
                id="ga"
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />
            <Script strategy="lazyOnload" id="ga2">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                    page_path: window.location.pathname,
                    page_title: window.location.pathname,
                    page_location: window.location.href,
              });
          `}
            </Script>
            <NextIntlClientProvider
                locale={(router.query.locale as string) ?? 'cs'}
                timeZone="Europe/Vienna"
                messages={pageProps.messages}
                onError={(error) => {
                    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
                        console.warn('Missing translation:', error.name);
                    }
                }}
            >
                <OverlaysProvider>
                    <Component key={router.route} {...pageProps} />
                </OverlaysProvider>
            </NextIntlClientProvider>
        </>
        )


};


export default MyApp