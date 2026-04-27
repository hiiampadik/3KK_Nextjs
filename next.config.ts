import type {NextConfig} from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/cs',
                permanent: true,
            },
            {
                source: '/projects/:slug',
                destination: '/cs/projects/:slug',
                permanent: true,
            },
            {
                source: '/projects',
                destination: '/cs/projects',
                permanent: true,
            },
            {
                source: '/about',
                destination: '/cs/about',
                permanent: true,
            },
            {
                source: '/contact',
                destination: '/cs/contact',
                permanent: true,
            },
        ];
    },
    ...(isGithubPages && {
        output: 'export',

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
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
