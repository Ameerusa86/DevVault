import { defineQuery } from "next-sanity";

// Fetch all startups, optionally filter by search term
export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current) && 
    ($search == null || title match $search || category match $search || author->name match $search)] 
  | order(_createdAt desc) {
    _id,
    _createdAt,
    _type,
    _updatedAt,
    _rev,
    title,
    slug,
    views,
    description,
    category,
    image,
    author -> {
      _id,
      name,
      image,
      bio
    }
  }`);

// Fetch a specific startup by its ID
export const STARTUP_BY_ID_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, username, image, bio
    }, 
    views,
    description,
    category,
    image,
    pitch,
  }`);

// Fetch views of a specific startup by its ID
export const STARTUP_VIEWS_QUERY = defineQuery(`
    *[_type == "startup" && _id == $id][0]{
        _id, views
    }
`);

// Fetch an author by their GitHub ID
export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

// Fetch an author by their ID
export const AUTHOR_BY_ID_QUERY = defineQuery(`
*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

// Fetch startups by a specific author ID
export const STARTUPS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views,
    description,
    category,
    image,
  }`);

// Fetch a playlist by its slug
export const PLAYLIST_BY_SLUG_QUERY =
  defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    select[]->{
      _id,
      _createdAt,
      title,
      slug,
      author->{
        _id,
        name,
        slug,
        image,
        bio
      },
      views,
      description,
      category,
      image,
      pitch
    }
  }`);
