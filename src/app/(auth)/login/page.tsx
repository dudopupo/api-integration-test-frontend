'use client'
import { useAuthStore } from "@/features/auth/store";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isLogin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLogin) { 
      router.push('/main');
    }
  }, [isLogin, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}

