'use client'
import React, { useContext, useEffect, useState } from 'react'
import PostComponent from './PostComponent'
import { DataContext } from '@/context/DataContext';
import Spinner from './Spinner';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/app/shared/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function Feed() {

    const { isLoading, setIsLoading, count } = useContext(DataContext);
    const [posts, setPosts] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const router = useRouter();

    if (!user) {
        router.push('/login');
    }

    useEffect(() => {
        getPosts();
    }, [count])

    async function getPosts() {
        const q = query(collection(db, "posts"));
        const response = await getDocs(q);
        const postList = [];
        response.forEach((doc) => {
            postList.push(doc.data());
            setIsLoading(false);
        });
        setPosts(postList);
    }


    if (isLoading) {
        return (
            <div className="container w-full flex flex-col h-full items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="containe flex flex-col overflow-auto h-[720px] p-5 w-full">
            {
                posts?.map((d, i) => {
                    return <PostComponent key={i} data={d} />
                })
            }
        </div>
    )
}
