import React, {useMemo, useState} from 'react';
import Layout from '@/components/Layout';
import {GetStaticPropsContext} from 'next';
import {revalidateTime, sanityFetch} from '@/sanity/client';
import Link from 'next/link';
import {Project as ProjectSanity} from '@/api/sanity.types'
import {QUERY_ALL_PROJECTS} from '@/api/queries';
import Figure from '@/components/Sanity/Figure';
import styles from '@/styles/projects.module.scss'
import {useTranslations} from 'next-intl';
import {useLocale} from '@/components/utils/useLocale';
import BlockContent from '@/components/Sanity/BlockContent';
import {classNames} from '@/components/utils/classNames';

export default function Projects({data}: {data: ProjectSanity[]}) {
    const t = useTranslations('Projects');
    const locale = useLocale()
    const [filter, setFilter] = useState<'archived' | 'ongoing' | 'planned'>('ongoing')

    const [archivedProjects, ongoingProjects, plannedProjects] = useMemo(() => {
        const archived: ProjectSanity[] = [];
        const ongoing: ProjectSanity[] = [];
        const planned: ProjectSanity[] = [];

        data.forEach(project => {
            if (project.hideInRepertoire) return;

            if (project.status === 'archived') {
                archived.push(project);
            } else if (project.status === 'ongoing') {
                ongoing.push(project);
            } else if (project.status === 'planned') {
                planned.push(project);
            }
        });

        const sortByPremiereDesc = (a: ProjectSanity, b: ProjectSanity) => new Date(b.premiere).getTime() - new Date(a.premiere).getTime();

        return [
            archived.sort(sortByPremiereDesc),
            ongoing.sort(sortByPremiereDesc),
            planned.sort(sortByPremiereDesc),
        ];
    }, [data]);

    const getProjectsToDisplay = () => {
        switch (filter) {
            case 'archived': return archivedProjects;
            case 'ongoing': return ongoingProjects;
            case 'planned': return plannedProjects;
            default: return [];
        }
    }

    return (
        <Layout title={t('projects')}>
            <div className={styles.projectsContainer}>
                <h1>{t('projects')}</h1>
                <div className={styles.filterContainer}>
                    {archivedProjects.length > 0 && (
                        <button className={filter === 'archived' ? styles.selected : ''} onClick={() => setFilter('archived')}>
                            {t('archived')}{' ['}{archivedProjects.length.toString()}{']'}
                        </button>)}
                    {ongoingProjects.length > 0 && (
                        <button className={filter === 'ongoing' ? styles.selected : ''} onClick={() => setFilter('ongoing')}>
                            {t('ongoing')}{' ['}{ongoingProjects.length.toString()}{']'}
                        </button>)}
                    {plannedProjects.length > 0 && (
                        <button className={filter === 'planned' ? styles.selected : ''} onClick={() => setFilter('planned')}>
                            {t('planned')}{' ['}{plannedProjects.length.toString()}{']'}
                        </button>)}
                </div>
                <ul className={styles.projectsList}>
                    {getProjectsToDisplay().map(project => (
                        <li key={project._id}>
                            <Link href={`/${locale}/projects/${project.slug.current}`} key={project._id}>
                                <div className={classNames([styles.cover, filter === 'archived' && styles.archivedCover])}>
                                    {project.cover &&
                                        <Figure image={project.cover}/>
                                    }
                                </div>
                                <h2>{project.title[locale]}</h2>
                                <BlockContent blocks={project.description[locale]}/>
                            </Link>
                        </li>
                    ))}
                </ul>
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
    const data: ProjectSanity[] = await sanityFetch({query: QUERY_ALL_PROJECTS, useCdn: false});

    return {
        props: {
            data,
            messages: (await import(`../../public/locales/${locale}.json`)).default,
        },
        ...(!process.env.GITHUB_PAGES && {revalidate: revalidateTime}),
    };
}
