import {createContext, useContext} from 'react';

export type Locale = 'cs' | 'en';

export const LocaleContext = createContext<Locale>('cs');

export const useLocale = (): Locale => {
    return useContext(LocaleContext);
}
