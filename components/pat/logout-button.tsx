"use client";

import { Button } from "@/components/ui/button";
import { PAT_AUTH_COOKIE } from "@/lib/pat-blog";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    document.cookie = `${PAT_AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
    router.push("/pat");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}