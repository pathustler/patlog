import BlogEditor from "@/components/pat/blog-editor";
import { getBlog, listBlogImages } from "@/lib/pat-blog";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ md_name: string }>;
};

export default async function EditBlogPage(props: PageProps) {
  const params = await props.params;
  const blog = await getBlog(params.md_name);

  if (!blog) {
    notFound();
  }

  const images = await listBlogImages(params.md_name);

  return (
    <div className="py-8">
      <BlogEditor
        mode="edit"
        initialMdName={blog.md_name}
        initialContent={blog.md_content}
        initialImages={images}
      />
    </div>
  );
}