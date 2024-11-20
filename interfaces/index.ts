// interfaces/index.ts
import { Slug } from "@/sanity.types";

export interface Author {
  _id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
}

export interface StartupTypeCard {
  _id: string;
  _type: "startup"; // Literal type
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string | null;
  slug: Slug | undefined;
  views: number | null;
  description: string | null;
  category: string | null;
  image: string | null;
  author?: Author | null;
}
