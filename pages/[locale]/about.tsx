import Layout from '@/components/Layout';
import React from 'react';
import {revalidateTime, sanityFetch} from '@/sanity/client';
import {GetStaticPropsContext} from 'next';
import {QUERY_ABOUT} from '@/api/queries';
import {About as AboutSanity} from '@/api/sanity.types'
import styles from '@/styles/about.module.scss'
import {useTranslations} from 'next-intl';
import BlockContent from '@/components/Sanity/BlockContent';
import {useLocale} from '@/components/utils/useLocale';
import Figure from '@/components/Sanity/Figure';

export default function About({data}: {data: AboutSanity}) {
    const t = useTranslations('About');
    const locale = useLocale()

    return (
        <Layout seo={data.seo} title={t('about')}>
            <div className={styles.aboutContainer}>
                <h1>{t('about')}</h1>
                <div className={styles.aboutParagraph}>
                    <BlockContent blocks={data.text[locale]}/>
                </div>

                <div className={styles.teamContainer}>
                    <h2>{t('team')}</h2>
                    <div className={styles.teamList}>
                        {data.team?.map((member, index) => (
                            <div key={index} className={styles.member}>
                                <div className={styles.cover}>
                                    {member.photo &&
                                        <Figure image={member.photo}/>
                                    }
                                </div>
                                <h3>{member.name}</h3>
                                <p>{member.role[locale]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export function getStaticPaths() {
    return {
        paths: [
            {params: {locale: 'cs'}},
            {params: {locale: 'en'}},
        ],
        fallback: false,
    };
}

export async function getStaticProps(context: GetStaticPropsContext) {
    const locale = context.params!.locale as string;
    const data: AboutSanity = await sanityFetch({query: QUERY_ABOUT, useCdn: false});

    return {
        props: {
            data,
            messages: (await import(`../../public/locales/${locale}.json`)).default,
        },
        ...(!process.env.GITHUB_PAGES && {revalidate: revalidateTime}),
    };
}
