// app/blog/[topic]/page.tsx
import { notFound } from 'next/navigation';
import {
  Author,
  BlogMdxFrontmatter,
  getAllBlogsFrontmatter,
} from "@/lib/markdown";
import { formatDate2, stringToDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";




export default async function TopicPage({ params }: { params: { topic: string } }) {
  const { topic } = params;
  console.log(topic)

  // Simulate fetching from a DB, CMS, or wherever the hell your content lives
  const blogs = (await getAllBlogsFrontmatter()).sort(
      (a, b) => stringToDate(b.date).getTime() - stringToDate(a.date).getTime()
    );

  type TopicKey = {
  [key: string]: string;
}
 
  const topickey:TopicKey = {
    "Software Development":"software",
    "ML Development":"ml"
  }
  const filtered = blogs.filter(blog => topickey[blog.topic] === topic);

  if (filtered.length === 0) notFound(); // throw 404 if topic is empty
  const grouped = groupByProject(filtered);


  

  return (
     <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
      
      {Object.entries(grouped).map(([projectName, blogs]) => (
        <>
        <h1 className="sm:text-3xl text-2xl font-extrabold">{projectName}</h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 my-5">
        {blogs.map((blog) => (
          <BlogCard {...blog} slug={blog.slug} key={blog.slug} />
        ))}
      </div>
      <br></br>
      <hr></hr>
      <br></br>
      </>
      ))}
    </div> 
  ); 
}

type Blog = {
    date:string,
  title:string,
  description:string,
  topic:string,
  project:string,
  slug:string,
  cover: string,
  authors:Author[],
  };

  function groupByProject(blogs: Blog[]) {
  return blogs.reduce((acc, blog) => {
    if (!acc[blog.project]) acc[blog.project] = [];
    acc[blog.project].push(blog);
    return acc;
  }, {} as Record<string, Blog[]>);
}


function BlogCard({
  date,
  title,
  description,
  slug,
  cover,
  authors,
}: BlogMdxFrontmatter & { slug: string }) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="flex flex-col gap-2 items-start border rounded-md py-5 px-3 min-h-[400px]"
    >
      <h3 className="text-md font-semibold -mt-1 pr-7">{title}</h3>
      <div className="w-full">
        <Image
          src={cover}
          alt={title}
          width={400}
          height={150}
          quality={80}
          className="w-full rounded-md object-cover h-[180px] border"
        />
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center justify-between w-full mt-auto">
        <p className="text-[13px] text-muted-foreground">
          Published on {formatDate2(date)}
        </p>
        <AvatarGroup users={authors} />
      </div>
    </Link>
  );
}

function AvatarGroup({ users, max = 4 }: { users: Author[]; max?: number }) {
  const displayUsers = users.slice(0, max);
  const remainingUsers = Math.max(users.length - max, 0);

  return (
    <div className="flex items-center">
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.username}
          className={`inline-block border-2 w-9 h-9 border-background ${
            index !== 0 ? "-ml-3" : ""
          } `}
        >
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingUsers > 0 && (
        <Avatar className="-ml-3 inline-block border-2 border-background hover:translate-y-1 transition-transform">
          <AvatarFallback>+{remainingUsers}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
