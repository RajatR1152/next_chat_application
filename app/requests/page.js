'use client'
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../shared/firebaseConfig';
import Link from 'next/link';
import { DataContext } from '@/context/DataContext';
import Spinner from '@/components/Spinner';

export default function page() {

    const [user, setUser] = useState([]);
    const [userData, setUserData] = useState([]);
    const [requests, setRequests] = useState([]);
    const { isLoading, setIsLoading } = useContext(DataContext);

    useEffect(() => {
        let data = localStorage.getItem("user");
        setUser(JSON.parse(data))
    }, [])

    if (!user) {
        router.push('/login');
    }

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("user"));
        setUser(data.providerData[0]);
    }, []);

    useEffect(() => {
        if (user && user.uid) {
            getUserInfo();
        }
    }, [user, accept, reject]);

    async function getUserInfo() {
        const q = query(collection(db, 'users'), where("email", "==", user.uid));
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((element) => {
            setUserData(element.data());
            setRequests(element.data().requests);
            setIsLoading(false);
        });
    }

    async function accept(r) {
        const frData = {
            username: r.username,
            profileImg: r.profileImg,
            email: r.email,
            user_uuid: r.user_uuid
        }

        const q = query(collection(db, 'users'), where("email", "==", user.uid));
        const querySnapShot = await getDocs(q);

        querySnapShot.forEach(async (doc) => {
            const userRef = doc.ref;
            const user = doc.data();
            const updatedReqs = user.requests.filter(d => d.username !== r.username);
            const updatedFriends = [...user?.friends, frData];

            try {
                await updateDoc(userRef, {
                    requests: updatedReqs,
                    friends: updatedFriends
                });
            } catch (error) {
                console.error("Error adding friend: ", error);
            }
        });

        const q2 = query(collection(db, 'users'), where("email", "==", r.email));
        const querySnapShot2 = await getDocs(q2);

        const frData2 = {
            username: userData.username,
            profileImg: userData.profileImg,
            email: userData.email,
            user_uuid: userData.user_uuid
        }

        querySnapShot2.forEach(async (doc) => {
            const userRef = doc.ref;
            const user = doc.data();
            const updatedFriends = [...user.friends, frData2];
            try {
                await updateDoc(userRef, {
                    friends: updatedFriends
                });
            } catch (error) {
                console.error("Error adding friend: ", error);
            }
        });
    }

    async function reject(r) {
        const q = query(collection(db, "users"), where('email', "==", useda.email));
        const response = await getDocs(q);
        response.forEach(async (doc) => {
            const userRef = doc.ref;
            const user = doc.data();
            const updatedReqs = user.requests.filter(d => d.username !== r.username);
            try {
                await updateDoc(userRef, {
                    requests: updatedReqs,
                });
            } catch (error) {
                console.error("Error adding friend: ", error);
            }
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
        <div className="container w-full h-full p-5 overflow-auto">
            {
                requests.length > 0 ?
                    requests.map((r, i) => {
                        return (
                            <div key={i} className="container w-full flex flex-row border-b">
                                <Link href={`/user/${r.user_uuid}`} className="container items-center p-3 w-full flex flex-row gap-4">
                                    <img src={r.profileImg} alt={r.username} className="w-12 h-12 rounded-full" />
                                    <h2 className="text-lg font-semibold">{r.username}</h2>
                                </Link>
                                <div className="container h-fit w-fit ms-auto flex flex-row gap-3">
                                    <button onClick={() => { accept(r) }} className="p-3 hover:bg-white hover:text-black rounded-lg font-semibold border bg-transparent">accept</button>
                                    <button onClick={() => { reject(r) }} className="p-3 hover:bg-white hover:text-black rounded-lg font-semibold border bg-transparent">delete</button>
                                </div>
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
