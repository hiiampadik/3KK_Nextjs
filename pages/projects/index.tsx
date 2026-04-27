import {useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';

export default function ProjectsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/cs/projects');
    }, [router]);

    return (
        <Head>
            <meta httpEquiv="refresh" content="0;url=/cs/projects"/>
            <link rel="canonical" href="https://www.tripluskk.com/cs/projects"/>
        </Head>
    );
}

export function getStaticProps() {
    return {props: {}};
}
