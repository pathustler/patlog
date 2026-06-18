"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAT_AUTH_COOKIE } from "@/lib/pat-blog";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const loginUser = process.env.NEXT_PUBLIC_USERNAME;
const loginPassword = process.env.NEXT_PUBLIC_PASSWORD;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const nextPath = searchParams.get("next") ?? "/pat/blogs";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (username === loginUser && password === loginPassword) {
      document.cookie = `${PAT_AUTH_COOKIE}=1; path=/; max-age=604800; samesite=lax`;
      router.push(nextPath);
      router.refresh();
      return;
    }

    setError("Invalid username or password.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Username</label>
        <Input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          placeholder="Username"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Password"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="w-full">Enter editor</Button>
    </form>
  );
}