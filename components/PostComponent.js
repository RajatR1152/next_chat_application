'use client'
import React, { useContext, useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineComment, AiOutlinePaperClip } from 'react-icons/ai'
import { BsBookmark } from 'react-icons/bs'
import { BiPaperPlane } from 'react-icons/bi'
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/app/shared/firebaseConfig'
import { DataContext } from '@/context/DataContext'
import { useRouter } from 'next/navigation'
import Spinner from './Spinner'


export default function PostComponent({ data }) {

    const [n, setN] = useState(2);
    const [commentInput, setCommentInput] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState([]);
    const { count, setCount } = useContext(DataContext);
    const router = useRouter();

    if (!user) {
        router.push('/login');
    }

    useEffect(() => {
        getUser();
    }, [])

    async function getUser() {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const respose = await getDocs(q);
        respose.forEach((doc) => {
            setUserData(doc.data());
        })
    }

    async function comment(i) {
        try {
            const q = query(collection(db, "posts"), where("post_uid", "==", i));
            const response = await getDocs(q);

            const commentData = {
                author: userData?.username || '',
                comment: commentInput || ''
            };

            response.forEach(async (doc) => {
                const userRef = doc.ref;
                const post = doc.data();
                const updatedComments = [...(post.comments || []), commentData];

                try {
                    await updateDoc(userRef, {
                        comments: updatedComments
                    });
                    setCommentInput("");
                    setCount(count + 1);

                } catch (error) {
                    console.error("Error updating comments:", error);
                }
            });
        } catch (error) {
            console.error("Error getting post data:", error);
        }
    }

    async function like(i) {
        try {
            const q = query(collection(db, "posts"), where("post_uid", "==", i));
            const response = await getDocs(q);

            const likeData = {
                by: userData?.username || '',
            };

            response.forEach(async (doc) => {
                const userRef = doc.ref;
                const post = doc.data();
                const updatedLikes = [...(post.likes || []), likeData];

                try {
                    await updateDoc(userRef, {
                        likes: updatedLikes
                    });
                    setCount(count + 1);

                } catch (error) {
                    console.error("Error updating comments:", error);
                }
            });
        } catch (error) {
            console.error("Error getting post data:", error);
        }
    }

    return (
        <>
            {
                data ? <div className="container md:w-8/12 border-b border-gray-300 mx-auto my-3 h-fit">
                    <div className="container w-full items-center p-2 flex gap-3 flex-row">
                        <img src={data.authorImg} alt="" className="w-10 h-10 rounded-full" />
                        <div className="container w-fit flex flex-col">
                            <h1 className="text-lg font-bold">{data.author}</h1>
                            <h1 className="text-xs">{data.email}</h1>
                        </div>
                        <p className="text-gray-500 ms-auto w-fit font-extrabold">.2d</p>
                    </div>
                    <div className="border border-gray-500 p-1 w-full h-fit">
                        <img src={data.image} alt="" className="w-auto mx-auto h-full" />
                    </div>
                    <div className="container my-2 flex flex-row gap-3 w-full p-2">
                        <div className='text-center'>
                            <AiFillHeart onClick={() => { like(data.post_uid) }} className='cursor-pointer' size={30} />
                            {data.likes.length}
                        </div>
                        <div className='text-center'>
                            <AiOutlineComment className='cursor-pointer' size={30} />
                            {data.comments.length}
                        </div>
                        <AiOutlinePaperClip className='cursor-pointer' size={30} />
                        <div className='ms-auto text-center'>
                            <BsBookmark className='cursor-pointer' size={30} />
                        </div>
                    </div>

                    <div className="container w-full">
                        {
                            data?.comments.map((c, i) => {
                                while (i < n) {
                                    return (
                                        <p key={i} className="text-md"><strong>{c.author} : </strong> {c.comment}</p>
                                    )
                                }
                            })
                        }
                        {
                            data?.comments.length > 3 && n < 3 ? <button onClick={() => { setN(data.comments.length) }} className="my-1 bg-transparent border-0 font-bold">load more...</button>
                                :
                                null
                        }

                        {
                            n > 3 && n == data?.comments.length ? <button onClick={() => { setN(2) }} className="my-1 bg-transparent border-0 font-bold">show less...</button>
                                :
                                null
                        }
                    </div>

                    <div className="container w-full md:my-4 md:p-0 flex flex-row">
                        <input value={commentInput} onChange={(e) => { setCommentInput(e.target.value) }} type="text" placeholder='Add a comment...' className="md:w-11/12 w-10/12 bg-transparent p-2 rounded-lg rounded-e-none border-0 focus:outline-none" />
                        <button onClick={() => { comment(data?.post_uid) }} className="border-0 bg-transparent">{commentInput.length > 0 ? <BiPaperPlane size={25} /> : null}</button>
                    </div>

                </div>
                    :
                    <div className="container items-center justify-center w-full h-full flex flex-col">
                        <Spinner />
                    </div>
            }
        </>
    )
}
