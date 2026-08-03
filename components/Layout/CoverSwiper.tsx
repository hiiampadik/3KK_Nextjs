'use client'
import React, {FunctionComponent, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, EffectFade} from 'swiper/modules';
import gsap from 'gsap';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Link from 'next/link';
import styles from './navigation.module.scss';
import {classNames} from '@/components/utils/classNames';
import Figure from '@/components/Sanity/Figure';
import {useLocale} from '@/components/utils/useLocale';
import {useTranslations} from 'next-intl';
import {HomepageProject} from '@/api/homepage';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface CoverSlide {
    readonly _key: string
    readonly project: HomepageProject
}

interface Props {
    readonly slides: ReadonlyArray<CoverSlide>
}

const CoverSwiper: FunctionComponent<Props> = ({slides}) => {
    const locale = useLocale();
    const t = useTranslations('Homepage');

    // The images are pinned; the title/link of the *active* slide is rendered in
    // the scrolling layer (over the image) so it rides up with the content.
    const [activeIndex, setActiveIndex] = useState(0);
    const active = slides[activeIndex]?.project;

    const titleRef = useRef<HTMLDivElement>(null);

    // Keep the title hidden on the very first paint so it doesn't flash at its
    // resting position before GSAP tucks it below its mask. Cleared as soon as the
    // reveal is set up (or immediately when motion is reduced).
    const [pending, setPending] = useState(true);

    // The title + detail link rise out of their masks the same way the programme
    // rows do — but this replays on every slide change (a re-split like the
    // programme uses would break as the title text swaps), so the incoming slide's
    // title emerges from the bottom rather than popping in.
    useIsomorphicLayoutEffect(() => {
        const el = titleRef.current;
        if (!el) return;

        const targets = el.querySelectorAll<HTMLElement>('[data-reveal]');
        if (targets.length === 0) {
            setPending(false);
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPending(false);
            return;
        }

        gsap.set(targets, {yPercent: 110});
        setPending(false);
        const tween = gsap.to(targets, {
            yPercent: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: true,
        });

        return () => {
            tween.kill();
        };
    }, [activeIndex]);

    return (
        <>
            <div className={styles.coverFixedSwiper}>
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect={'fade'}
                    fadeEffect={{crossFade: true}}
                    speed={500}
                    autoplay={{delay: 8000, disableOnInteraction: false}}
                    loop={true}
                    slidesPerView={1}
                    allowTouchMove={false}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    className={styles.coverSwiper}
                >
                    {slides.map(slide => (
                        <SwiperSlide key={slide._key} className={styles.coverSlide}>
                            <div className={styles.cover}>
                                {slide.project.cover &&
                                    <Figure
                                        image={slide.project.cover}
                                        fullWidth={true}
                                        alt={slide.project.title[locale]}
                                    />
                                }
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Without JS the reveal never runs, so the pre-hide must not stick. */}
            <noscript>
                <style>{`.${styles.titlePending}{visibility:visible!important}`}</style>
            </noscript>
            <div className={styles.coverScrollSwiper}>
                {active &&
                    <div
                        ref={titleRef}
                        className={classNames([styles.coverSwiperTitle, pending && styles.titlePending])}
                    >
                        <div className={styles.coverTitleMask}>
                            <h2 className={styles.coverTitle} data-reveal>{active.title[locale]}</h2>
                        </div>
                        <div className={styles.coverTitleMask}>
                            <Link
                                href={`/${locale}/projects/${active.slug.current}`}
                                className={styles.coverButton}
                                data-reveal
                            >
                                {t('detail')}
                            </Link>
                        </div>
                    </div>
                }
                <div className={styles.coverSwiperFade}/>
            </div>
        </>
    );
};

export default CoverSwiper;
