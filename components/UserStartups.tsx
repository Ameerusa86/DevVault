import React from "react";
import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { StartupTypeCard } from "@/interfaces";
import StartupCard from "./StartupCard";

const UserStartups = async ({ id }: { id: string }) => {
  const rawStartups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startups = rawStartups.map((startup: any) => ({
    ...startup,
    _type: "startup",
    _updatedAt: startup._updatedAt ?? new Date().toISOString(),
    _rev: startup._rev ?? "",
  }));

  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup: StartupTypeCard) => (
          <StartupCard key={startup._id} post={startup} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};

export default UserStartups;
