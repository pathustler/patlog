"use client";

import { Button } from "@/components/ui/button";
import { deleteBlog, type PatBlogRow } from "@/lib/pat-blog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BlogsTable({ blogs }: { blogs: PatBlogRow[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(mdName: string) {
    if (!confirm(`Delete ${mdName}?`)) {
      return;
    }

    setDeleting(mdName);
    try {
      await deleteBlog(mdName);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blogs</h1>
          <p className="text-sm text-muted-foreground">
            Manage blog posts stored in Supabase.
          </p>
        </div>
        <Link href="/pat/blogs/new">
          <Button>New blog</Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3">md_name</th>
              <th className="px-4 py-3 w-[220px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.md_name} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{blog.md_name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/pat/blogs/${encodeURIComponent(blog.md_name)}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(blog.md_name)}
                      disabled={deleting === blog.md_name}
                    >
                      {deleting === blog.md_name ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!blogs.length ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={2}>
                  No blogs found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}