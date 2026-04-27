import {useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';

export default function AboutRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/cs/about');
    }, [router]);

    return (
        <Head>
            <meta httpEquiv="refresh" content="0;url=/cs/about"/>
            <link rel="canonical" href="https://www.tripluskk.com/cs/about"/>
        </Head>
    );
}

export function getStaticProps() {
    return {props: {}};
}
