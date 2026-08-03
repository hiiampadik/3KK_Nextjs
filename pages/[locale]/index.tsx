import Layout from '@/components/Layout';
import React, {Fragment} from 'react';
import {revalidateTime, sanityFetch} from '@/sanity/client';
import {GetStaticPropsContext} from 'next';
import {QUERY_HOMEPAGE} from '@/api/homepage';
import {Homepage as HomepageType} from '@/api/homepage'
import Link from 'next/link';
import styles from '@/styles/homepage.module.scss'
import localizedDate from '@/components/utils/LocalizeDate';
import {useLocale} from '@/components/utils/useLocale';
import localizedTime from '@/components/utils/LocalizeTime';
import BlockContent from '@/components/Sanity/BlockContent';
import {useTranslations} from 'next-intl';
import ProgramReveal from '@/components/Layout/ProgramReveal';

export default function Home({data}: {data: HomepageType}) {
    const locale = useLocale();
    const t = useTranslations('Homepage');

    const program = data.program?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) ?? [];

    const programByMonth = program.reduce((acc, event) => {
        const month = new Date(event.date).toLocaleString(locale, {year: 'numeric', month: 'long'});
        if (!acc[month]) acc[month] = [];
        acc[month].push(event);
        return acc;
    }, {} as Record<string, typeof program>);

    const coverGallery = program
        .filter(event => event.project.cover)
        .filter((event, index, events) =>
            events.findIndex(e => e.project._id === event.project._id) === index)
        .map(event => ({_key: event.project._id, project: event.project}));

    return (
        <>
            <Layout
                cover={data.cover}
                coverGallery={coverGallery}
                description={data.description}
                seo={data.seo}
            >
                <ProgramReveal className={styles.homepageContainer}>
                    <h1 data-reveal-group data-reveal="text">Program</h1>
                    <div className={styles.programContainer}>
                        <div className={styles.scrollingPart}>
                            {Object.entries(programByMonth).map(([month, events]) => (
                                <Fragment key={month}>
                                    <h2 className={styles.monthHeader} data-reveal-group data-reveal="text">{month}</h2>
                                    <ul>
                                        {events.map(event => (
                                            <li key={event._key} data-reveal-group>
                                                <Link
                                                    href={`/${locale}/projects/${event.project.slug.current}`}
                                                    key={event.project._id}
                                                    className={styles.linkContainer}
                                                >
                                                    <div className={styles.dateContainer}>
                                                        <p className={styles.date} data-reveal="text">{localizedDate(event.date, locale)}</p>
                                                        <p className={styles.time} data-reveal="text">
                                                            {localizedTime(event.date, locale)}
                                                        </p>
                                                        <p className={styles.location} data-reveal="text">
                                                            {event.location}
                                                        </p>
                                                    </div>
                                                    <div className={styles.nameContainer}>
                                                        <h2 data-reveal="text">
                                                            {event.project.title[locale]}
                                                        </h2>
                                                        {event.tag &&
                                                            <div className={styles.revealMask}>
                                                                <div className={styles.tag} data-reveal="box">{event.tag[locale]}</div>
                                                            </div>
                                                        }
                                                        <div className={styles.description} data-reveal="text">
                                                            <BlockContent blocks={event.project.description[locale]} disableLinks/>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div className={styles.externalLinks}>
                                                    {event.facebook &&
                                                        <div className={styles.revealMask}>
                                                            <a href={event.facebook} className={styles.fb} data-reveal="box">Fb</a>
                                                        </div>
                                                    }
                                                    {event.ticket &&
                                                        <div className={styles.revealMask}>
                                                            <a href={event.ticket} className={styles.tickets} data-reveal="box">{t('tickets')}</a>
                                                        </div>
                                                    }
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </ProgramReveal>
            </Layout>
        </>
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
    const data: HomepageType = await sanityFetch({query: QUERY_HOMEPAGE, useCdn: false});

    return {
        props: {
            data,
            locale,
            messages: (await import(`../../public/locales/${locale}.json`)).default,
        },
        ...(!process.env.GITHUB_PAGES && {revalidate: revalidateTime}),
    };
}
