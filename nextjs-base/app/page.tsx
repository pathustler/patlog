import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import { MoveUpRightIcon, TerminalSquareIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex sm:min-h-[87.5vh] min-h-[82vh] flex-col sm:items-center justify-center text-center sm:py-8 py-14">
      <Link
        href="https://github.com/pathustler"
        target="_blank"
        className="mb-5 sm:text-lg flex items-center gap-2 underline underline-offset-4 sm:-mt-12"
      >
        Pathustler GitHub{" "}
        <MoveUpRightIcon className="w-4 h-4 font-extrabold" />
      </Link>
      <h1 className="text-[1.80rem] leading-8 sm:px-8 md:leading-[4.5rem] font-bold mb-4 sm:text-6xl text-left sm:text-center">
       Welcome to Patlog where I document my journey building AI and Applications
      </h1>
      <p className="mb-8 md:text-lg text-base  max-w-[1200px] text-muted-foreground text-left sm:text-center">
        A blog site that contains articles, documentation, and projects
        showcasing my work and interests in the AI and Application development industry. It serves as a platform to share my
        knowledge, insights, and experiences with the world. 
      </p>
      <div className="sm:flex sm:flex-row grid grid-cols-2 items-center sm;gap-5 gap-3 mb-8">
       
        <Link
          href="/blog"
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Read Blog
        </Link>
      </div>
      
    </div>
  );
}
