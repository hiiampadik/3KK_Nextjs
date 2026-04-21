import React, {FunctionComponent, PropsWithChildren} from 'react';
import Head from "next/head";
import Navigation from './Navigation';
import Footer from '@/components/Layout/Footer';
import styles from './navigation.module.scss'
import {classNames} from '@/components/utils/classNames';
import {useRouter} from 'next/router';
import {useLocale} from '@/components/utils/useLocale';
import {LocalizedRichParagraph, LocalizedString, LocalizedText} from '@/api/sanity.types';
import Loading from '@/components/Layout/Loading';

export const WEBSITE_NAME_CZ = 'Divadlo 3+KK'
export const WEBSITE_NAME_EN = 'Theatre 3+KK'
export const WEBSITE_DESCRIPTION_CZ = "Kritické divadlo do kritické doby."
export const WEBSITE_DESCRIPTION_EN = "Critical theatre for a critical time."
export const WEBSITE_URL = 'https://www.tripluskk.com'

interface LayoutProps {
    readonly seo?: {
        _type: 'seo'
        title: LocalizedString
        paragraph?: LocalizedText
    }
    readonly title?: string
    readonly loading?: boolean;
    readonly cover?: { asset?: { _ref: string }};
    readonly description?: LocalizedRichParagraph
    readonly image?: {
        url: string,
        width: string,
        height: string,
    }
}

const Layout: FunctionComponent<PropsWithChildren<LayoutProps>> = (
    {children,
        title,
        loading = undefined,
        image,
        cover,
        description,
        seo
    }) => {

    const router = useRouter()
    const locale = useLocale()

    const websiteDescription = locale === 'cs' ? WEBSITE_DESCRIPTION_CZ : WEBSITE_DESCRIPTION_EN
    const websiteName = locale === 'cs' ? WEBSITE_NAME_CZ : WEBSITE_NAME_EN
    const pageTitle = title ? title + ` | ${websiteName}` : websiteName

    const seoPageTitle = seo?.title[locale] ?? pageTitle
    const seoPageDescription = seo?.paragraph?.[locale] ?? websiteDescription

    const currentUrl = WEBSITE_URL + router.asPath;

    const jsonLd = {
        '@context': 'https://schema.org',
        "@graph":[
            {
                "@type":"Organization",
                "@id": WEBSITE_URL + "#organization",
                "name":websiteName,
                "url": WEBSITE_URL,
                "sameAs":["https://www.facebook.com/3pluskk","https://www.instagram.com/3pluskk"]
            },
            {
                "@type":"WebSite",
                "@id": WEBSITE_URL + "#website",
                "url":WEBSITE_URL,
                "name":websiteName,
                "publisher":{"@id": WEBSITE_URL + "#organization"},
                'description': websiteDescription
            },
            {
                '@type': 'WebPage',
                "@id": currentUrl + "#website",
                "url": currentUrl,
                'name': seoPageTitle,
                'description': seoPageDescription,
                'inLanguage': locale,
                'primaryImageOfPage': {
                    '@type': 'ImageObject',
                    'url': image?.url ?? `${WEBSITE_URL}/favicon/web-app-manifest-512x512.png`,
                    'width': image?.width ?? '512',
                    'height': image?.height ?? '512'
                }
            }
        ]
    }

    const strippedPath = router.asPath.replace(/^\/(cs|en)/, '') || '/'
    const alternateUrls = {
        cs: '/cs' + strippedPath,
        en: '/en' + strippedPath,
    }


    return (
        <>
            <Head>
                <title>{seoPageTitle}</title>

                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="keywords"
                      content="divadlo, kritické divadlo, 3+kk, theatre 3+kk, site-specific, kultura, Brno, Praha"/>
                <meta name="description" content={seoPageDescription}/>
                <meta name="robots" content="index, follow"/>
                <meta charSet="utf-8"/>
                <meta name="theme-color" content="#000000"/>

                <meta property="og:site_name" content={websiteName}/>
                <meta property="og:locale" content={locale}/>
                <meta property="og:title" content={seoPageTitle}/>
                <meta property="og:description" content={seoPageDescription}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={currentUrl}/>

                <link rel="alternate" href={WEBSITE_URL + alternateUrls.cs} hrefLang="cs"/>
                <link rel="alternate" href={WEBSITE_URL + alternateUrls.en} hrefLang="en"/>
                <link rel="alternate" href={WEBSITE_URL} hrefLang="x-default"/>

                <link rel="canonical" href={currentUrl}/>


                {image ?
                    <>
                        <meta property="og:image" content={image.url}/>
                        <meta property="og:image:type" content="image/jpg"/>
                        <meta property="og:image:width" content={image.width}/>
                        <meta property="og:image:height" content={image.height}/>

                        <meta name="twitter:image" content={image.url}/>
                        <meta name="twitter:image:type" content="image/jpg"/>
                        <meta name="twitter:image:width" content={image.width}/>
                        <meta name="twitter:image:height" content={image.height}/>
                    </>
                    :
                    <>
                        <meta property="og:image" content={WEBSITE_URL + '/favicon/web-app-manifest-512x512.png'}/>
                        <meta property="og:image:type" content="image/png"/>
                        <meta property="og:image:width" content={'512'}/>
                        <meta property="og:image:height" content={'512'}/>

                        <meta name="twitter:image" content={WEBSITE_URL + '/favicon/web-app-manifest-512x512.png'}/>
                        <meta name="twitter:image:type" content="image/png"/>
                        <meta name="twitter:image:width" content={'512'}/>
                        <meta name="twitter:image:height" content={'512'}/>
                    </>

                }

                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content={seoPageTitle}/>
                <meta name="twitter:description" content={seoPageDescription}/>

                <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
                <link rel="manifest" href="/favicon/site.webmanifest"/>

                <meta name="apple-mobile-web-app-title" content={websiteName}/>
            </Head>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />

            <main>
                <Loading/>
                <Navigation cover={cover} description={description}/>
                <div className={classNames([styles.content, loading ? styles.loading : styles.loaded])}>
                    {children}
                </div>
                <Footer/>
            </main>
        </>
    );
};

export default Layout