'use client'
import React, {FunctionComponent, useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import Overlay from '@/components/Overlay';
import {useDisableScroll} from '@/components/utils/useDisableScroll';
import Link from 'next/link';
import styles from './navigation.module.scss';
import {classNames} from '@/components/utils/classNames';
import {useTranslations} from 'next-intl';
import {useLocale} from '@/components/utils/useLocale';
import Figure from '@/components/Sanity/Figure';
import BlockContent from '@/components/Sanity/BlockContent';
import {LocalizedRichParagraph} from '@/api/sanity.types';
import {logo} from '@/components/Matter/Logo';

interface Props {
    readonly cover?: { asset?: { _ref: string }};
    readonly description?: LocalizedRichParagraph
}


const Navigation: FunctionComponent<Props> = ({cover, description}) => {
    const router = useRouter();
    const locale = useLocale()
    const t = useTranslations('Navigation');

    const [navVisible, setNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always show navigation in top 50px
            if (currentScrollY <= 50) {
                setNavVisible(true);
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down
                setNavVisible(false);
            } else {
                // Scrolling up
                setNavVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        logo();
    }, []);

    return (
        <>
            <nav className={classNames([styles.nav, navVisible ? styles.show : styles.hidden])}>
                <div className={styles.navLeft}>
                    <Link href={"/"} className={classNames([styles.logo])}>
                        {/*<img src={logo.src} className={styles.logoComplex}/>*/}
                        <svg id="Vrstva_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 715.5 126.7">
                            <path
                                d="M193.4,63.3c0,9-2.8,14.5-9.9,21l-36.9,32.5c-7.1,6.4-14.3,9.9-25.1,9.9H0v-25.3h148.8c9.2,0,17-7.4,17-16.6v-8.8H0v-25.3h165.8v-8.8c0-9.2-7.8-16.6-17-16.6H0V0h121.6c10.8,0,18,3.7,25.1,9.9l36.9,32.5c7.1,6.2,9.9,12,9.9,21h0Z"/>
                            <path
                                d="M306.7,59.2h-34.7c-6.1,0-11.1,5-11.1,11.1v34.7h-6.9v-34.7c0-6.1-5-11.1-11.1-11.1h-35v-6.9h35c6.1,0,11.1-5,11.1-11.1V6.2h6.9v35c0,6.1,5,11.1,11.1,11.1h34.7v6.9h0Z"/>
                            <path
                                d="M392,76c-4.6,0-8.3-.5-12.2-1.6l25.1,22.1c3.9,3.4,7.8,4.8,12.9,4.8h96.7v25.3h-68.6c-10.8,0-21.9-3.2-30.2-10.8l-67-62.4v73.2h-27.6V0h27.6v34.1c0,9.2,7.8,16.6,17,16.6h104.6c9.2,0,16.6-7.8,16.6-17V0h27.6v11.1c0,10.8-3.5,17.7-9.9,25.1l-36.4,29.9c-7.6,6.2-14.3,9.9-25.1,9.9h-51.1Z"/>
                            <path
                                d="M593,76c-4.6,0-8.3-.5-12.2-1.6l25.1,22.1c3.9,3.4,7.8,4.8,12.9,4.8h96.7v25.3h-68.6c-10.8,0-21.9-3.2-30.2-10.8l-67-62.4v73.2h-27.6V0h27.6v34.1c0,9.2,7.8,16.6,17,16.6h104.5c9.2,0,16.6-7.8,16.6-17V0h27.6v11.1c0,10.8-3.5,17.7-9.9,25.1l-36.4,29.9c-7.6,6.2-14.3,9.9-25.1,9.9h-51.1Z"/>
                        </svg>
                    </Link>
                    <Link
                        href={"/projects"}
                        className={classNames([styles.link, styles.link1])}
                        prefetch={false}>
                        <p>{t('projects')}</p>
                    </Link>
                    <Link
                        href={"/about"}
                        className={classNames([styles.link, styles.link2])}
                        prefetch={false}
                    >
                        <p>{t('about')}</p>
                    </Link>
                    <Link
                        href={"/contact"}
                        className={classNames([styles.link, styles.link3])}
                        prefetch={false}
                    >
                        <p>{t('contact')}</p>
                    </Link>
                </div>

                <div className={styles.navRight}>
                    <a href={"https://www.instagram.com/3pluskk/"}
                       className={classNames([styles.smallLink, styles.link6])}>
                        <p>IG</p>
                    </a>
                    <a href={"https://www.facebook.com/3pluskk"}
                       className={classNames([styles.smallLink, styles.link7])}>
                        <p>FB</p>
                    </a>
                    <a href={"https://connect.boomevents.org/cs/organizer/d2324245-882a-43e7-8e7d-577816aa2926"}
                       className={classNames([styles.smallLink, styles.tickets, styles.link8])}>
                        <p>{t('tickets')}</p>
                    </a>
                    <Link
                        href={router.asPath}
                        locale={router.locale === "cs" ? "en" : "cs"}
                        className={classNames([styles.smallLink, styles.link9])}
                        prefetch={false}
                    >
                        <p>{router.locale === "cs" ? "En" : "Cz"}</p>
                    </Link>
                </div>
            </nav>

            {cover ?
                <div className={styles.coverContainer}>
                    <div className={styles.cover}>
                        <div id="matter-container" className={styles.matterContainer}></div>

                        <Figure image={cover} fullWidth={true}/>
                    </div>
                    {description &&
                        <div className={styles.description}>
                            <BlockContent blocks={description[locale]}/>
                        </div>
                    }
                </div>
                :
                <div className={styles.spacer}/>
            }
        </>
    );
};

export default Navigation;

