import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const session = await auth();
  console.log(session);

  const { data: rawPosts } = await sanityFetch({
    query: STARTUPS_QUERY,
    params,
  });

  // Transform raw data to match the StartupTypeCard type
  const posts: StartupTypeCard[] = rawPosts.map((post) => ({
    _id: post._id,
    _type: "startup", // Explicitly set _type to "startup"
    _createdAt: post._createdAt,
    _updatedAt: post._updatedAt,
    _rev: post._rev,
    title: post.title ?? "Untitled Startup",
    slug: post.slug,
    views: post.views ?? 0,
    description: post.description ?? "No description provided",
    category: post.category ?? "Uncategorized",
    image: post.image ?? "/path/to/default/image.jpg",
    author: post.author
      ? {
          _id: post.author._id,
          name: post.author.name ?? "Unknown Author",
          image: post.author.image ?? "/path/to/default/author.jpg",
          bio: post.author.bio ?? "",
        }
      : undefined,
  }));

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Your Startup Hub
          <br /> Connect, Collaborate, Succeed
        </h1>
        <p className="sub-heading !max-w-3xl">
          Turn Ideas into Action: Compete and Get Discovered
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts.length > 0 ? (
            posts.map((post) => <StartupCard key={post._id} post={post} />)
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
