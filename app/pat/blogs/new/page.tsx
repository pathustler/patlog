import BlogEditor from "@/components/pat/blog-editor";

export default function NewBlogPage() {
const today = new Date();
const todayFormatted = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
const initialmdContent = `---
title: ""
description: ""
topic: "ML Development/Software Development"
project: ""
date: ${todayFormatted}
authors:
  - avatar: "https://avatars.githubusercontent.com/u/128213324?v=4"
    handle: pathustler
    username: Me
    handleUrl: "https://github.com/pathustler"
    
cover: ""
---
`;
  return (
    <div className="py-8">
      <BlogEditor
        mode="new"
        initialMdName=""
        initialContent={initialmdContent}
        initialImages={[]}
      />
    </div>
  );
}