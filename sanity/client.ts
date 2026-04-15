import {createClient, type QueryParams} from 'next-sanity'

const client = createClient({
    projectId: 'akuo9oaj', // you can find this in sanity.json
    dataset: 'production', // or the name you chose in step 1
    useCdn: true, // `false` if you want to ensure fresh data
    apiVersion: '2025-06-20', // use current date (YYYY-MM-DD) to target the latest API version
    // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
})

export default client;

export const revalidateTime = 60 * 60 * 12 // 12 hours


export async function sanityFetch<const QueryString extends string>(
    {   query,
        params = {},
        useCdn = true,
    }: {
    query: QueryString
    params?: QueryParams
    revalidate?: number | false
    useCdn?: boolean
}) {
    return client
        .withConfig({useCdn: useCdn})
        .fetch(query, params)
}

