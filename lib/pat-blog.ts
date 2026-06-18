import { getSupabaseClient } from "./supabase";

export const PAT_AUTH_COOKIE = "pat_auth";
export const BLOG_IMAGES_BUCKET = "blog-images";

export type PatBlogRow = {
  md_name: string;
  md_content: string;
};

export type PatBlogImageRow = {
  id: string;
  md_name: string;
  image_name: string;
  image_url: string;
  created_at: string;
};

export async function listBlogs() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("md_name, md_content")
    .order("md_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as PatBlogRow[];
}

export async function getBlog(mdName: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("md_name, md_content")
    .eq("md_name", mdName)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as PatBlogRow | null;
}

export async function saveBlog(mdName: string, mdContent: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("blogs").upsert(
    {
      md_name: mdName,
      md_content: mdContent,
    },
    { onConflict: "md_name" }
  );

  if (error) {
    throw error;
  }
}

export async function deleteBlog(mdName: string) {
  const supabase = getSupabaseClient();

  const relatedImages = await listBlogImages(mdName);
  if (relatedImages.length) {
    const storagePaths = relatedImages
      .map((image) => image.image_url.split(`/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/`)[1])
      .filter((path): path is string => Boolean(path));

    if (storagePaths.length) {
      const { error: storageError } = await supabase.storage
        .from(BLOG_IMAGES_BUCKET)
        .remove(storagePaths);

      if (storageError) {
        throw storageError;
      }
    }

    const { error: imageDeleteError } = await supabase
      .from("blog_images")
      .delete()
      .eq("md_name", mdName);

    if (imageDeleteError) {
      throw imageDeleteError;
    }
  }

  const { error } = await supabase.from("blogs").delete().eq("md_name", mdName);

  if (error) {
    throw error;
  }
}

export async function listBlogImages(mdName: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("blog_images")
    .select("id, md_name, image_name, image_url, created_at")
    .eq("md_name", mdName)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as PatBlogImageRow[];
}

export async function uploadBlogImage(mdName: string, file: File) {
  const supabase = getSupabaseClient();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `${mdName}/${crypto.randomUUID()}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicData } = supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .getPublicUrl(storagePath);

  const imageUrl = publicData.publicUrl;

  const { data: row, error: insertError } = await supabase
    .from("blog_images")
    .insert({
      md_name: mdName,
      image_name: file.name,
      image_url: imageUrl,
    })
    .select("id, md_name, image_name, image_url, created_at")
    .single();

  if (insertError) {
    throw insertError;
  }

  return row as PatBlogImageRow;
}

export async function deleteBlogImage(image: PatBlogImageRow) {
  const supabase = getSupabaseClient();
  const storagePath = image.image_url.split(`/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/`)[1];

  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from(BLOG_IMAGES_BUCKET)
      .remove([storagePath]);

    if (storageError) {
      throw storageError;
    }
  }

  const { error } = await supabase.from("blog_images").delete().eq("id", image.id);

  if (error) {
    throw error;
  }
}