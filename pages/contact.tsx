import {useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';

export default function ContactRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/cs/contact');
    }, [router]);

    return (
        <Head>
            <meta httpEquiv="refresh" content="0;url=/cs/contact"/>
            <link rel="canonical" href="https://www.tripluskk.com/cs/contact"/>
        </Head>
    );
}

export function getStaticProps() {
    return {props: {}};
}
