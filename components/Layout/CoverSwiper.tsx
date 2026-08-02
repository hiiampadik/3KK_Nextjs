'use client'
import React, {FunctionComponent, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, EffectFade} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import Link from 'next/link';
import styles from './navigation.module.scss';
import Figure from '@/components/Sanity/Figure';
import {useLocale} from '@/components/utils/useLocale';
import {useTranslations} from 'next-intl';
import {HomepageProject} from '@/api/homepage';

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

            <div className={styles.coverScrollSwiper}>
                {active &&
                    <div className={styles.coverSwiperTitle}>
                        <h2 className={styles.coverTitle}>{active.title[locale]}</h2>
                        <Link
                            href={`/${locale}/projects/${active.slug.current}`}
                            className={styles.coverButton}
                        >
                            {t('detail')}
                        </Link>
                    </div>
                }
                <div className={styles.coverSwiperFade}/>
            </div>
        </>
    );
};

export default CoverSwiper;
