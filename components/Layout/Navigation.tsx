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
import logo from '@/public/logos/3.svg';
import Figure from '@/components/Sanity/Figure';
import BlockContent from '@/components/Sanity/BlockContent';
import {LocalizedRichParagraph} from '@/api/sanity.types';


interface Props {
    readonly cover?: { asset?: { _ref: string }};
    readonly description?: LocalizedRichParagraph
}


const Navigation: FunctionComponent<Props> = ({cover, description}) => {
    const router = useRouter();
    const locale = useLocale()
    const t = useTranslations('Navigation');

    const [showOverlay, setShowOverlay] = useState(false);
    const [navVisible, setNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleRouteChange = () => {
            setShowOverlay(false);
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => router.events.off('routeChangeComplete', handleRouteChange);
    }, [router.events]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
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

    useDisableScroll(showOverlay)

    return (
        <>
            <nav className={classNames([styles.nav, navVisible ? styles.show : styles.hidden])}>
                <div className={styles.navLeft}>
                    <Link href={"/"} className={classNames([styles.logo])}>
                        <img src={logo.src} className={styles.logoComplex}/>
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
                    <Link
                        href={router.asPath}
                        locale={router.locale === "cs" ? "en" : "cs"}
                        className={classNames([styles.smallLink, styles.link4])}
                        prefetch={false}
                    >
                        <p>{router.locale === "cs" ? "En" : "Cz"}</p>
                    </Link>
                    <a href={"https://connect.boomevents.org/cs/organizer/d2324245-882a-43e7-8e7d-577816aa2926"}
                       className={classNames([styles.smallLink, styles.tickets, styles.link5])}>
                        <p>{t('tickets')}</p>
                    </a>
                    <a href={"https://www.instagram.com/3pluskk/"}
                       className={classNames([styles.smallLink, styles.link6])}>
                        <p>IG</p>
                    </a>
                    <a href={"https://www.facebook.com/3pluskk"}
                       className={classNames([styles.smallLink, styles.link7])}>
                        <p>FB</p>
                    </a>
                </div>
            </nav>

            {cover ?
                <div className={styles.coverContainer}>
                    <div className={styles.cover}>
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

            <Overlay handleClose={() => setShowOverlay(false)} isOpen={showOverlay}/>
        </>
    );
};

export default Navigation;

