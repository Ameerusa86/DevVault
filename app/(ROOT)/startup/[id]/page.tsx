import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";

export const experimental_ppr = true;
const md = markdownit();

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  console.log(id);

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) {
    notFound();
    return;
  }

  const parsedContent = md.render(post.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_contaioner">
        <Image
          src={post.image || "/default-image.jpg"}
          alt={post.title || "Default Title"}
          width={600}
          height={400}
          className="max-w-2xl h-auto rounded-xl mx-auto mt-5"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            {post.author && (
              <Link
                href={`/user/${post.author._id}`}
                className="flex gap-2 items-center mb3"
              >
                <Image
                  src={post.author.image || "/default-author-image.jpg"}
                  alt={post.author.name || "Default Author Name"}
                  width={40}
                  height={40}
                  className="rounded-full w-16 h-16 object-cover shadow-lg"
                />
                <div>
                  <p className="text-20">{post.author.name}</p>
                  <p className="text-20">@{post.author.username}</p>
                </div>
              </Link>
            )}
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
          <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id={id} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default page;
