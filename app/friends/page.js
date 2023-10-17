'use client'
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../shared/firebaseConfig';
import Link from 'next/link';
import { reject } from '../requests/page';
import { DataContext } from '@/context/DataContext';
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/navigation';

export default function page() {

    const [userInfo, setUserInfo] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const { isLoading, setIsLoading } = useContext(DataContext);
    const { userData, setUserData, setCount } = useContext(DataContext);
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            router.push('/login');
        } else {
            getUserInfo(user);
        }
    }, [router, setCount]);

    async function getUserInfo(user) {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const querySnapShot = await getDocs(q);
        let fArray = [];
        querySnapShot?.forEach((doc) => {
            setUserInfo(data => [...data, doc.data()]);
            doc?.data()?.friends?.map((f) => {
                fArray.push(f);
            })
        })

        let unique = [...new Set(fArray)];
        setFriendsList(unique);
    }

    if (isLoading) {
        return (
            <div className="container w-full flex flex-col h-full items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="container w-full h-full overflow-auto">
            {
                friendsList.length > 0 ?
                    friendsList.map((r, i) => {
                        return (
                            <div key={i} className="container w-full flex flex-row border-b">
                                <Link href={`/user/${r.user_uuid}`} className="container items-center p-3 w-full flex flex-row gap-4">
                                    <img src={r.profileImg} alt={r.username} className="w-12 h-12 rounded-full" />
                                    <h2 className="text-lg font-semibold">{r.username}</h2>
                                </Link>
                            </div>
                        )
                    })
                    :
                    <div className="container h-full w-full flex flex-col items-center justify-center">
                        <h1 className="text-2xl fong-bold">
                            Nothing to show
                        </h1>
                    </div>
            }
        </div>
    )
}

