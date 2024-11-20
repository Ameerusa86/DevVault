"use server";

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-clinet";
import slugify from "slugify";

export const createPitch = async (form: FormData, pitch: string) => {
  const session = await auth();

  if (!session) {
    throw new Error("Not signed in");
  }

  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const category = form.get("category") as string;
  const imageFile = form.get("image") as File;

  if (!title || !description || !category || !imageFile) {
    throw new Error("Missing required fields");
  }

  const slug = slugify(title, { lower: true, strict: true });

  // Upload the image to your storage (Sanity example below)
  let imageUrl = "";
  try {
    const uploadedImage = await writeClient.assets.upload("image", imageFile);
    imageUrl = uploadedImage.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Image upload failed");
  }

  const startup = {
    _type: "startup",
    title,
    description,
    category,
    image: imageUrl,
    slug: {
      _type: "slug",
      current: slug,
    },
    author: {
      _type: "reference",
      _ref: session?.user?.id,
    },
    pitch,
  };

  try {
    const result = await writeClient.create(startup);
    return { _id: result._id, status: "SUCCESS" };
  } catch (error) {
    console.error("Failed to create pitch:", error);
    throw new Error("Failed to create pitch");
  }
};
