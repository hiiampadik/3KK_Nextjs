import Layout from '../components/Layout';
import React from 'react';
import {useRouter} from 'next/router';
import {GetStaticPropsContext} from 'next';
import styles from '../styles/notFound.module.scss'

export default function NotFound() {
    const router = useRouter();

    const title = router.locale === 'cs' ? `Tato stránka neexistuje!` : `Page Not Found!`

    return (
        <Layout title={title}>
            <section className={styles.notFoundContainer}>
                <h1>
                    {title}
                </h1>
            </section>
        </Layout>
    );
}


export async function getStaticProps(context: GetStaticPropsContext) {
    return {
        props: {
            messages: (await import(`../public/locales/${context.locale ?? 'cs'}.json`)).default,
        }};
}
