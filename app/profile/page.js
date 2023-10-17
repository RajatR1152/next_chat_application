'use client'
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../shared/firebaseConfig';
import Link from 'next/link';
import { RxDotFilled } from 'react-icons/rx';
import { useRouter } from 'next/navigation';
import { DataContext } from '@/context/DataContext';
import Spinner from '@/components/Spinner';
import UserPosts from '@/components/UserPosts';

export default function page() {

    const [userData, setUserData] = useState([]);
    const [showPosts, setShowPosts] = useState(true);
    const router = useRouter();
    const { isLoading, setIsLoading } = useContext(DataContext);
    const { setCount } = useContext(DataContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            router.push('/login');
        } else {
            getUserInfo(user);
        }
    }, [router, setCount]);

    async function getUserInfo(user) {
        const q = query(collection(db, 'users'), where('email', "==", user?.email));
        const response = await getDocs(q);
        response.forEach(element => {
            setUserData(element.data());
        });
    }

    function logOut() {
        localStorage.removeItem("user");
        router.push('/login');
    }

    if (isLoading) {
        return (
            <div className="container w-full flex flex-col h-full items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="container w-full h-full p-5 ">

            <div className="container border-b border-white w-full py-3 md:p-2">

                <div className="flex items-center flex-row gap-3 md:gap-8">
                    <img src={userData.profileImg} alt="" className="md:w-24 md:h-24 w-12 h-12 rounded-full" />
                    <div className="container w-fit flex flex-col">
                        <h1 className="text-xl md:text-3xl text-left font-bold capitalize">{userData.username}</h1>
                        <p className="md:text-lg text-md text-left font-semibold">{userData.email}</p>
                    </div>
                </div>

                <div className="container md:ms-24 w-full mt-3 md:mt-0 md:w-7/12 md:p-5">
                    <p>
                        {userData.bio}
                    </p>

                    <div className="container w-fit flex flex-row my-5 gap-8">
                        <Link href={'/'} className="text-gray-600 flex items-center font-bold text-md"> <RxDotFilled size={20} />{userData?.friends?.length} followers</Link>
                        <Link href={'/'} className="text-gray-600 flex items-center font-bold text-md"> <RxDotFilled size={20} />{userData.link} </Link>
                    </div>

                    <div className="container w-fit flex flex-row gap-4">
                        <button onClick={() => { logOut() }} className="bg-transparent border border-gray-300 hover:bg-gray-900 hover:text-white-800 rounded-lg font-semibold p-3 w-fit">log out</button>
                        <Link href={`/edit`} className="bg-transparent border border-gray-300 hover:bg-gray-900 hover:text-white-800 rounded-lg font-semibold p-3 w-fit">edit profile</Link>
                    </div>

                </div>

            </div>
            <div className="container text-center flex flex-row gap-1 w-full">
                <button onClick={() => { setShowPosts(true) }} className={showPosts ? "w-6/12 md:w-5/12 bg-transparent ms-auto p-3 border-0 border-b-4 border-white" : "w-6/12 md:w-5/12 bg-transparent ms-auto p-3 border-0"}>posts</button>
                <button onClick={() => { setShowPosts(false) }} className={!showPosts ? "w-6/12 md:w-5/12 bg-transparent me-auto p-3 border-0 border-b-4 border-white" : "w-6/12 md:w-5/12 bg-transparent ms-auto p-3 border-0"}>reels</button>
            </div>
            <UserPosts id={userData.user_uuid} />
        </div>
    )
}
