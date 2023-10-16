'use client'
import Feed from "@/components/Feed";
import { useRouter } from "next/navigation";

export default function page() {

  const user = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();

  if (!user) {
    router.push('/login');
  }

  else {
    return (
      <div className="container w-full h-full">
        <Feed />
      </div>
    )
  }
}