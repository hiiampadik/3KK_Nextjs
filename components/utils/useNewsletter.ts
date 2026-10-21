import {createContext, useContext} from 'react';

// Newsletter URL from the Contact document, fetched in each page's getStaticProps.
export const NewsletterContext = createContext<string | null>(null);

export const useNewsletter = (): string | null => {
    return useContext(NewsletterContext);
}
