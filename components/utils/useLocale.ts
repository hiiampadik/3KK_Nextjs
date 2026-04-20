import {useRouter} from 'next/router';

export const useLocale = (): ('cs' | 'en') => {
    const router = useRouter();
    const locale = router.query.locale;
    if (locale === 'en') return 'en';
    return 'cs';
}
