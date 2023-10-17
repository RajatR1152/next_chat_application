'use client'
import { db } from '@/app/shared/firebaseConfig';
import { DataContext } from '@/context/DataContext';
import { collection, count, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

export default function Header() {

    const user = JSON.parse(localStorage.getItem("user"));
    const { userData, setUserData, setCount } = useContext(DataContext);
    const path = usePathname();
    const router = useRouter();

   useEffect(()=>{
    if (!user) {
        router.push('/login');
    }
    else {
        getUserInfo();
    }
   },[count])

    if (path === '/login' || path === '/register') {
        return null;
    }


    async function getUserInfo() {
        const q = query(collection(db, "users"), where("email", "==", user?.email));
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((doc) => {
            setUserData(doc.data())
            localStorage.setItem("count", doc.data()?.messages)
            setCount(doc.data()?.messages);
        });
    }

    return (
        <div className="container w-full items-center gap-5 p-2 flex flex-row border-b-2 border-white">
            <Link href={'/'} className='text-2xl md:text-3xl font-bold'>N E X T A G R A M</Link>
            <Link href={'/profile'} className='w-fit me-3 ms-auto'><img className='w-12 h-12 rounded-full' src={userData?.profileImg} /></Link>
        </div>
    )
}
