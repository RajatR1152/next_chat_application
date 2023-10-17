'use client'
import Feed from "@/components/Feed";
import { DataContext } from "@/context/DataContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function page() {

  const router = useRouter();
  const { userData, setUserData, setCount } = useContext(DataContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.push('/login');
    }
  }, [router, setCount]);

  return (
    <div className="container w-full h-full">
      <Feed />
    </div>
  )
}