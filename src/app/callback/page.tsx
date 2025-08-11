"use client";

import { useEffect, useState } from "react";
import { getAuthUser, User } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const u = await getAuthUser();
      setUser(u);

      if (u?.email) {
        localStorage.setItem("userEmail", u.email);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/");
  };

  if (!user) return <p>로그인 정보를 불러오는 중...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>로그인 성공!</h1>
      <p>UID: {user.uid}</p>
      <p>Email: {user.email}</p>
      {user.name && <p>Name: {user.name}</p>}
      {user.picture && <img src={user.picture} alt="profile" width={100} />}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "1rem",
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
