import React, {FunctionComponent} from 'react';
import styles from './footer.module.scss'
import {useTranslations} from 'next-intl';
import logo1 from '@/public/logos/kaznice.png'
import logo2 from '@/public/logos/teren_logo_A.svg'
import logo3 from '@/public/logos/andcrblack-7.png'
import logo4 from '@/public/logos/bnd.svg'

import logo5 from '@/public/logos/MKCR.svg'
import logo6 from '@/public/logos/Brno.png'
import logo7 from '@/public/logos/JMK.png'
import logo8 from '@/public/logos/SFK.svg'

const Footer: FunctionComponent = () => {

    const t = useTranslations('Footer');

    return (
        <div className={styles.footerContainer}>
            <div className={styles.leftContainer}>
                    <a href={'https://www.facebook.com/3pluskk'} target={'_blank'}>FB</a>
                    <a href={'https://www.instagram.com/3pluskk/'} target={'_blank'}>IG</a>
                    <a href="mailto:tripluskk@gmail.com">tripluskk@gmail.com</a>
                    <a href="tel:+420777414563">(+420) 777 414 563</a>
            </div>

            <div className={styles.rightContainer}>
                <div>
                    <p className={styles.sectionTitle}>
                        {t('sponsors')}
                    </p>
                    <div className={styles.logos}>
                        <img src={logo5.src}/>
                        <img src={logo7.src}/>
                        <img src={logo6.src}/>
                        <img src={logo8.src}/>
                    </div>
                </div>
                <div>
                    <p className={styles.sectionTitle}>
                        {t('partners')}
                    </p>
                    <div className={styles.logos}>
                        <img src={logo1.src}/>
                        <img src={logo2.src}/>
                        <img src={logo3.src}/>
                        <img src={logo4.src}/>
                    </div>
                </div>
                <p className={styles.sectionTitle}>
                    {t('sponsorsBody')}
                </p>
            </div>
        </div>
    );
};

export default Footer;
