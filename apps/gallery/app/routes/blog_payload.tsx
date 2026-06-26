import type { Route } from "./+types/blog_payload"


type BlogPostCard = {
  title: string
  href: string
  imageUrl: string
  date: string
  datetime: string
  author: {
    name: string
    imageUrl: string
  }
}


export async function loader({ context }: Route.LoaderArgs) {

  const payload = await fetch(
    "http://localhost:3000/api/artwork"
  )

  if (!payload.ok) {
    throw new Response("Failed to load artwork", { status: payload.status })
  }

  const artworkJson = await payload.json()

  const baseUrl = "http://localhost:3000"

  const posts: BlogPostCard[] = artworkJson.docs.map((artwork: any) => {
    return {
      title: artwork.title,
      href: `${baseUrl}/api/artwork/${artwork.id}`,
      imageUrl: `${baseUrl}${artwork.url}`,
      date: artwork.createdAt ? new Date(artwork.createdAt).toDateString() : "Unknown",
      datetime: artwork.createdAt ?? new Date().toISOString(),
      author:{
        name: artwork.author ?? "Unknown",
        imageUrl:  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      }
    }
  })


  return {
    posts,
    artwork: artworkJson.docs,
    // meta: content.meta,
    // message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  }
}


export default function BlogListRoute({ loaderData }: Route.ComponentProps) {
   return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BlogItems posts={loaderData.posts} />
      <div>
        <pre className="mt-4 rounded bg-gray-100 p-4 text-sm text-gray-800">
            {JSON.stringify(loaderData, null, 2)}
        </pre>
      </div>
    </div>
  )
}



function BlogItems({ posts }: { posts: BlogPostCard[] }) {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
            From the blog
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
            Latest posts from Sonic.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.href}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 dark:bg-gray-800"
            >
              <img alt="" src={post.imageUrl} className="absolute inset-0 -z-10 size-full object-cover" />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40 dark:from-black/80 dark:via-black/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl inset-ring inset-ring-gray-900/10 dark:inset-ring-white/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
                <time dateTime={post.datetime} className="mr-8">
                  {post.date}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg viewBox="0 0 2 2" className="-ml-0.5 size-0.5 flex-none fill-white/50 dark:fill-gray-300/50">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <div className="flex gap-x-2.5">
                    <img
                      alt=""
                      src={post.author.imageUrl}
                      className="size-6 flex-none rounded-full bg-white/10 dark:bg-gray-800/10"
                    />
                    {post.author.name}
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg/6 font-semibold text-white">
                <a href={post.href}>
                  <span className="absolute inset-0" />
                  {post.title}
                </a>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
