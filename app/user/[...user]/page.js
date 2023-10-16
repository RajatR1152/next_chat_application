'use client'
import { db } from '@/app/shared/firebaseConfig';
import Spinner from '@/components/Spinner';
import UserInfo from '@/components/UserInfo';
import UserPosts from '@/components/UserPosts';
import { DataContext } from '@/context/DataContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { BiGlobe } from 'react-icons/bi';

export default function page() {

  const param = useParams();
  const [searchedUserData, setSearchedUserData] = useState([]);
  const [showPosts, setShowPosts] = useState(true);
  const { isLoading, setIsLoading } = useContext(DataContext);


  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    const q = query(collection(db, 'users'), where("user_uuid", "==", param.user[0]));

    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      setSearchedUserData(doc.data());
    })
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
      <UserInfo data={searchedUserData} />
      <div className="container text-center flex flex-row gap-1 w-full">
        <button onClick={() => { setShowPosts(true) }} className={showPosts ? "w-6/12 md:w-5/12 bg-transparent ms-auto p-3 border-0 border-b-4 border-white" : "w-6/12 md:w-5/12 bg-transparent ms-auto p-3 border-0"}>posts</button>
        <button onClick={() => { setShowPosts(false) }} className={!showPosts ? "w-6/12 md:w-5/12 bg-transparent me-auto p-3 border-0 border-b-4 border-white" : "w-6/12 md:w-5/12 bg-transparent ms-auto p-3 border-0"}>reels</button>
      </div>
      <UserPosts id={searchedUserData.user_uuid} />
    </div>
  )
}
