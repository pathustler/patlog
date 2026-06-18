import BlogsTable from "@/components/pat/blogs-table";
import LogoutButton from "@/components/pat/logout-button";
import { listBlogs } from "@/lib/pat-blog";

export default async function PatBlogsPage() {
  const blogs = await listBlogs();

  return (
    <div className="space-y-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog admin</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, and delete blogs.
          </p>
        </div>
        <LogoutButton />
      </div>
      <BlogsTable blogs={blogs} />
    </div>
  );
}