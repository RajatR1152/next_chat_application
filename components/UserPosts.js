'use client'
import { db } from '@/app/shared/firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import PostComponent from './PostComponent';
import { DataContext } from '@/context/DataContext';

export default function UserPosts({ id }) {

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {count,setCount} = useContext(DataContext);

    useEffect(() => {
        getPosts(id)
    }, [id,count]);


    async function getPosts(id) {

        const q = query(collection(db, "posts"));
        const response = await getDocs(q);
        const postList = [];
        response.forEach((doc) => {
            if (doc.data().author_id == id) {
                postList.push(doc.data());
            }
        });
        setPosts(postList);
    }

    return (
        <div className="container w-full h-fit">
            {
                posts?.map((p, i) => {
                    return <PostComponent data={p} key={i} />
                })
            }
        </div>
    )
}
