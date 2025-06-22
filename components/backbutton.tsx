"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/blog");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={buttonVariants({
        variant: "link",
        className: "!mx-0 !px-0 mb-7 !-ml-1",
      })}
    >
      <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
      Back to blog
    </button>
  );
}
