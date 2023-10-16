'use client'
import { db } from '@/app/shared/firebaseConfig';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { RxDotFilled } from 'react-icons/rx'

export default function UserInfo({ data }) {

    const [userData, setUserData] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    let user = JSON.parse(localStorage.getItem("user"));
    const [isFollowing, setIsFollowing] = useState(false);
    const param = useParams();
    const router = useRouter();

    if (!user) {
        router.push('/login');
    }

    useEffect(() => {
        getUserInfo();
        getSearchedData();
    }, [])


    async function follow() {

        const reqData = {
            username: userData[0].username,
            profileImg: userData[0].profileImg,
            email: userData[0].email,
            user_uuid: userData[0].user_uuid
        }

        const q = query(collection(db, 'users'), where("user_uuid", "==", searchedData[0].user_uuid));
        const querySnapShot = await getDocs(q);

        querySnapShot.forEach(async (doc) => {
            const userRef = doc.ref;
            const user = doc.data();
            const updatedReqs = [...user.requests, reqData];

            try {
                await updateDoc(userRef, {
                    requests: updatedReqs
                });
                setIsFollowing(true);
                getUserInfo();
            } catch (error) {
                console.error("Error adding friend: ", error);
            }
        });
    }

    async function unfollow() {
        unfollowUser(userData[0].username, searchedData[0].username)
        unfollowUser(searchedData[0].username, userData[0].username)
    }

    async function unfollowUser(username, toDelete) {
        const q = query(collection(db, "users"), where("username", "==", username))
        const querySnapShot = await getDocs(q);
        let frs = [];
        let reqs = [];
        querySnapShot.forEach(async (doc) => {
            const docData = doc.data();
            docData.friends.forEach(element => {
                frs.push(element);
            });
            docData.requests.forEach(element => {
                reqs.push(element);
            });

            let updatedFriends = frs.filter(item => item.username !== toDelete);
            let updatedRequests = reqs.filter(item => item.username !== toDelete);

            await updateDoc(doc.ref, {
                requests: updatedRequests,
                friends: updatedFriends,
            });
            setIsFollowing(false);
        })
    }

    async function getUserInfo() {
        setUserData([]);
        const q = query(collection(db, "users"), where("email", "==", user?.email));
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((doc) => {
            setUserData(userData => [...userData, doc.data()])
        });
    }
    async function getSearchedData() {
        const q = query(collection(db, "users"), where("user_uuid", "==", param.user[0]));
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((doc) => {
            setSearchedData(data => [...data, doc.data()]);
        });
    }

    useEffect(() => {
        searchedData?.map((d) => {
            d?.requests?.map((r) => {
                if (r.username == userData[0]?.username) {
                    setIsFollowing(true);
                }
            })

            d?.friends?.map((r) => {
                if (r.username == userData[0]?.username) {
                    setIsFollowing(true);
                }
            })
        })

        userData?.map((d) => {
            d?.requests?.map((r) => {
                if (r.username == userData[0]?.username) {
                    setIsFollowing(true);
                }
            })

            d?.friends?.map((r) => {
                if (r.username == userData[0]?.username) {
                    setIsFollowing(true);
                }
            })
        })
    })

    return (
        <div className="container border-b border-white w-full py-3 md:p-2">

            <div className="flex items-center flex-row gap-3 md:gap-8">
                <img src={data.profileImg} alt="" className="md:w-24 md:h-24 w-12 h-12 rounded-full" />
                <div className="container w-fit flex flex-col">
                    <h1 className="text-xl md:text-3xl text-left font-bold capitalize">{data.username}</h1>
                    <p className="md:text-lg text-md text-left font-semibold">{data.email}</p>
                </div>
            </div>

            <div className="container md:ms-24 w-full mt-3 md:mt-0 md:w-7/12 md:p-5">
                <p>
                    {data.bio}
                </p>

                <div className="container w-fit flex flex-row my-5 gap-8">
                    <Link href={'/'} className="text-gray-600 flex items-center font-bold text-md"> <RxDotFilled size={20} />{data?.friends?.length} followers</Link>
                    <Link href={'/'} className="text-gray-600 flex items-center font-bold text-md"> <RxDotFilled size={20} />{data.link} </Link>
                </div>

                <div className="container w-fit flex flex-row gap-4">
                    {
                        isFollowing ? <button onClick={() => { unfollow() }} className="bg-transparent border border-gray-300 hover:bg-gray-900 hover:text-white-800 rounded-lg font-semibold p-3 w-fit">unfollow</button>
                            :
                            <button onClick={() => { follow() }} className="bg-transparent border border-gray-300 hover:bg-gray-900 hover:text-white-800 rounded-lg font-semibold p-3 w-fit">follow</button>
                    }
                    <Link href={`/chatroom/${data.user_uuid}`} className="bg-transparent border border-gray-300 hover:bg-gray-900 hover:text-white-800 rounded-lg font-semibold p-3 w-fit">message</Link>
                </div>

            </div>

        </div>
    )
}
