import React from "react";
import {GetStaticPropsContext} from 'next';
import client, {revalidateTime, sanityFetch} from '@/sanity/client';
import Layout from '@/components/Layout';
import {Project as ProjectSanity} from '@/api/sanity.types'
import {QUERY_ALL_PROJECTS_SLUGS, QUERY_PROJECT_DETAILS} from '@/api/queries';
import localizedDate from '@/components/utils/LocalizeDate';
import localizedTime from '@/components/utils/LocalizeTime';
import styles from '@/styles/project.module.scss'
import {useLocale} from '@/components/utils/useLocale';
import BlockContent from '@/components/Sanity/BlockContent';
import imageUrlBuilder from '@sanity/image-url';
import {getImageDimensions} from '@sanity/asset-utils';
import GallerySwiper from '@/components/Sanity/GallerySwiper';
import {useTranslations} from 'next-intl';
import Figure from '@/components/Sanity/Figure';

type ProgramItem = {
    _key: string
    date: string
    location: string
    ticket?: string
    facebook?: string
    tag?: {cs: string, en: string}
}

export default function Project({project, programItems}: {project: ProjectSanity, programItems?: ProgramItem[]}) {
    const locale = useLocale()
    const builder = imageUrlBuilder(client);
    const coverDimensions = project.cover?.asset && getImageDimensions(project.cover.asset)

    const t = useTranslations('Projects');

    const sortedProgramItems = programItems?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <Layout
            title={project.title[locale]}
            cover={project.cover}
            seo={project.seo}
            image={project.cover && {
                url: builder.image(project.cover).auto("format").width(800).quality(60).url(),
                height: coverDimensions?.height.toString() ?? '',
                width: coverDimensions?.width.toString() ?? '',
            }}
        >
            <div className={styles.projectContainer}>
                <div className={styles.projectHeader}>
                    <h1>{project.title[locale]}</h1>
                </div>
                {sortedProgramItems && (
                    sortedProgramItems.length > 0 ?
                        <div className={styles.programEvents}>
                            {sortedProgramItems.map(item => (
                                <div key={item._key} className={styles.programEvent}>
                                    <div className={styles.eventDate}>
                                        {localizedDate(item.date, locale)}
                                    </div>
                                    {item.tag && <div className={styles.eventTag}>{item.tag[locale]}</div>}
                                    <div className={styles.eventTime}>
                                        {localizedTime(item.date, locale)}
                                    </div>
                                    <div className={styles.eventLocation}>{item.location}</div>
                                    <div className={styles.eventLinks}>
                                        {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                                        {item.ticket && <a href={item.ticket} target="_blank" rel="noopener noreferrer">Tickets</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <div className={styles.noReruns}>
                            {t('noProgram')}
                        </div>
                )}
                <div className={styles.projectDetail}>
                    {project.team && project.team.length > 0 &&
                        <div className={styles.team}>
                            {project.team.map(member => (
                                <div key={member.name} className={styles.member}>
                                    <p className={styles.role}>{member.role[locale]}{':'}</p>
                                    <p className={styles.name}>{member.name}</p>
                                </div>
                            ))}
                        </div>
                    }
                    <div>
                        <div className={styles.abstract}>
                            <BlockContent blocks={project.abstract[locale]}/>
                        </div>
                    </div>
                </div>
            </div>
            {project.gallery &&
                <div className={styles.galleryContainer}>
                    <GallerySwiper gallery={project.gallery}/>
                </div>
            }
        </Layout>
    )
}

export async function getStaticPaths() {
    const slugs = await sanityFetch({query: QUERY_ALL_PROJECTS_SLUGS, useCdn: false});
    const paths = slugs.flatMap((slug: string) =>
        ['cs', 'en'].map((locale) => ({
            params: {locale, slug},
        }))
    );
    return {
        paths,
        fallback: process.env.GITHUB_PAGES ? false : 'blocking',
    };
}

export async function getStaticProps(context: GetStaticPropsContext) {
    const locale = context.params!.locale as string;
    const data: ProjectSanity & {programItems?: ProgramItem[]} = await sanityFetch({
        query: QUERY_PROJECT_DETAILS,
        params: {slug: context.params?.slug},
        useCdn: false,
    });
    return {
        props: {
            project: data,
            programItems: data.programItems || [],
            locale,
            messages: (await import(`../../../public/locales/${locale}.json`)).default,
        },
        ...(!process.env.GITHUB_PAGES && {revalidate: revalidateTime}),
    };
}
