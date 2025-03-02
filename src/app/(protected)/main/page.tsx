'use client'
import { useAuthStore } from "@/features/auth/store";

export default function Main() {
    const { logout } = useAuthStore()
    return (
      <div>
        <h1 className="text-2xl font-bold">Main Page</h1>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }