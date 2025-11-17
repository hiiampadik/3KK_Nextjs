import Layout from '../components/Layout';
import React from 'react';
import {revalidateTime, sanityFetch} from '@/sanity/client';
import {GetStaticPropsContext} from 'next';
import {Contact as ContactSanity} from '../api/sanity.types'
import {QUERY_CONTACT} from '@/api/queries';
import styles from '@/styles/contact.module.scss';
import BlockContent from '@/components/Sanity/BlockContent';
import {useTranslations} from 'next-intl';
import {useLocale} from '@/components/utils/useLocale';

export default function Contact({data}: {data: ContactSanity}) {
    const t = useTranslations('Contact');
    const locale = useLocale()

    return (
        <Layout seo={data.seo} title={t('contact')}>
            <div className={styles.contactContainer}>
                <h1>{t('contact')}</h1>
                <div className={styles.addressContainer}>
                    <div>
                        <BlockContent blocks={data.contacts[locale]}/>
                    </div>

                    <div>
                        <h2>
                            {t('address')}
                        </h2>
                        <BlockContent blocks={data.address[locale]}/>
                    </div>

                    <div>
                        <h2>
                            {t('billing')}
                        </h2>
                        <p>
                            Divadlo 3+kk z.s.<br/>
                            Nové sady 988/2<br/>
                            602 00 Brno<br/>
                            IČO: 09537279
                        </p>
                    </div>

                    <div className={styles.mapContainer}>
                    <iframe
                        className={styles.map}
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.046176503824!2d16.62000311238681!3d49.19968357650822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4712954b9a9af541%3A0x94f8c2b38d8eaed9!2sDivadlo%203%2Bkk!5e0!3m2!1scs!2scz!4v1763382702267!5m2!1scs!2scz"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps(context: GetStaticPropsContext) {
    const data: ContactSanity = await sanityFetch({query: QUERY_CONTACT, useCdn: false});

    return {
        props: {
            data,
            messages: (await import(`../public/locales/${context.locale}.json`)).default,
        },
        revalidate: revalidateTime, // two days
    };
}
