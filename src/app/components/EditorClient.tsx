// src/components/EditorClient.tsx (클라이언트 컴포넌트)
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "./Editor";
import { getAuthUser, User } from "../utils/auth";

export default function EditorClient({ docId }: { docId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getAuthUser().then((u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
    });
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return <Editor docId={docId} />;
}
