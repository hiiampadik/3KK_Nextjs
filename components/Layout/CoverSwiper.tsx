'use client'
import React, {FunctionComponent} from 'react';
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

    return (
        <Swiper
            modules={[Autoplay, EffectFade]}
            effect={'fade'}
            fadeEffect={{crossFade: true}}
            speed={500}
            autoplay={{delay: 8000, disableOnInteraction: false}}
            loop={true}
            slidesPerView={1}
            allowTouchMove={false}
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
                    <div className={styles.description}>
                        <h2 className={styles.coverTitle}>{slide.project.title[locale]}</h2>
                        <Link
                            href={`/${locale}/projects/${slide.project.slug.current}`}
                            className={styles.coverButton}
                        >
                            {t('detail')}
                        </Link>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CoverSwiper;
