import {useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {sanityFetch} from '@/sanity/client';
import {QUERY_ALL_PROJECTS_SLUGS} from '@/api/queries';

export default function ProjectSlugRedirect() {
    const router = useRouter();
    const {slug} = router.query;

    useEffect(() => {
        if (slug) {
            router.replace(`/cs/projects/${slug}`);
        }
    }, [router, slug]);

    return (
        <Head>
            <meta httpEquiv="refresh" content={`0;url=/cs/projects/${slug ?? ''}`}/>
            <link rel="canonical" href={`https://www.tripluskk.com/cs/projects/${slug ?? ''}`}/>
        </Head>
    );
}

export async function getStaticPaths() {
    const slugs: string[] = await sanityFetch({query: QUERY_ALL_PROJECTS_SLUGS, useCdn: false});
    return {
        paths: slugs.map((slug) => ({params: {slug}})),
        fallback: false,
    };
}

export function getStaticProps() {
    return {props: {}};
}
