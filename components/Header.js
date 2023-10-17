'use client'
import React, { useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataContext } from '@/context/DataContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/shared/firebaseConfig';

export default function Header() {
    const { userData, setUserData, setCount } = useContext(DataContext);
    const path = usePathname();
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            router.push('/login');
        } else {
            getUserInfo();
        }
    }, [router, setCount]);

    if (path === '/login' || path === '/register') {
        return null;
    }

    async function getUserInfo() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const q = query(collection(db, "users"), where("email", "==", user?.email));
            const querySnapShot = await getDocs(q);
            querySnapShot.forEach((doc) => {
                setUserData(doc.data());
                localStorage.setItem("count", doc.data()?.messages);
                setCount(doc.data()?.messages);
            });
        }
    }

    return (
        <div className="container w-full items-center gap-5 p-2 flex flex-row border-b-2 border-white">
            <Link href={'/'} className='text-2xl md:text-3xl font-bold'>N E X T A G R A M</Link>
            <Link href={'/profile'} className='w-fit me-3 ms-auto'><img className='w-12 h-12 rounded-full' src={userData?.profileImg} alt="Profile" /></Link>
        </div>
    );
}
