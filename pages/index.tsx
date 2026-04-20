import {useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';

export default function RootRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/cs');
    }, [router]);

    return (
        <Head>
            <meta httpEquiv="refresh" content="0;url=cs"/>
        </Head>
    );
}

export function getStaticProps() {
    return {props: {}};
}
