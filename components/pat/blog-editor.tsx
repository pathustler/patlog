"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteBlogImage,
  listBlogImages,
  saveBlog,
  type PatBlogImageRow,
  uploadBlogImage,
} from "@/lib/pat-blog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, Trash2 } from "lucide-react";

type BlogEditorProps = {
  mode: "new" | "edit";
  initialMdName: string;
  initialContent: string;
  initialImages: PatBlogImageRow[];
};

export default function BlogEditor({
  mode,
  initialMdName,
  initialContent,
  initialImages,
}: BlogEditorProps) {
  const router = useRouter();
  const [mdName, setMdName] = useState(initialMdName);
  const [content, setContent] = useState(initialContent);
  const [images, setImages] = useState(initialImages);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const preview = useMemo(() => content, [content]);

  useEffect(() => {
    setMdName(initialMdName);
    setContent(initialContent);
    setImages(initialImages);
  }, [initialMdName, initialContent, initialImages]);

  async function loadImages(currentMdName: string) {
    const rows = await listBlogImages(currentMdName);
    setImages(rows);
  }

  async function handleSave() {
    setError("");

    if (!mdName.trim()) {
      setError("md_name is required.");
      return;
    }

    setSaving(true);
    try {
      await saveBlog(mdName.trim(), content);
      if (mode === "new" && mdName.trim() !== initialMdName) {
        router.push(`/pat/blogs/${encodeURIComponent(mdName.trim())}/edit`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    if (!mdName.trim()) {
      setError("Set md_name before uploading images.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        await uploadBlogImage(mdName.trim(), file);
      }
      await loadImages(mdName.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(image: PatBlogImageRow) {
    try {
      await deleteBlogImage(image);
      await loadImages(mdName.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image.");
    }
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === "new" ? "New blog" : "Edit blog"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Edit markdown on the left and preview it on the right.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save blog"}
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {mode === "new" ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium">md_name</label>
          <Input
            value={mdName}
            onChange={(event) => setMdName(event.target.value)}
            placeholder="my-new-post"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm font-medium">md_name</label>
          <Input value={mdName} disabled />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Markdown</label>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[70vh] font-mono text-sm"
              placeholder="Write markdown here..."
            />
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Images</h2>
                <p className="text-sm text-muted-foreground">
                  Upload images and copy their public URL into markdown.
                </p>
              </div>
              <label className={cn("cursor-pointer", uploading && "opacity-60") }>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => handleUpload(event.target.files)}
                  disabled={uploading}
                />
                <span className="rounded-md border px-3 py-2 text-sm font-medium">
                  {uploading ? "Uploading..." : "Upload images"}
                </span>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {images.map((image) => (
                <div key={image.id} className="rounded-md border p-3 space-y-3">
                  <img
                    src={image.image_url}
                    alt={image.image_name}
                    className="h-40 w-full rounded-md object-cover"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium break-all">{image.image_name}</p>
                    <p className="text-xs text-muted-foreground break-all font-mono">
                      {image.image_url}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyLink(image.image_url)}>
                      <Copy className="mr-2 h-3.5 w-3.5" />
                      Copy link
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={image.image_url} target="_blank" rel="noreferrer">
                        <Link2 className="mr-2 h-3.5 w-3.5" />
                        Open
                      </a>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image)}>
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {!images.length ? (
                <p className="text-sm text-muted-foreground">No uploaded images yet.</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-medium">Preview</h2>
          <div className="rounded-lg border bg-background p-4 min-h-[calc(70vh+2rem)] prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{preview}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}