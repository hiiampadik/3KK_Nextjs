import type {NextConfig} from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
    ...(isGithubPages && {
        output: 'export',
        basePath: '/3kk',
        images: {
            unoptimized: true,
        },
    }),
    ...(!isGithubPages && {
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'cdn.sanity.io',
                },
            ],
        },
    }),
    ...(!isGithubPages && {
        i18n: {
            defaultLocale: 'cs',
            locales: ['en', 'cs'],
        },
    }),
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
