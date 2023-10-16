'use client'
import { db } from '@/app/shared/firebaseConfig';
import Spinner from '@/components/Spinner';
import { DataContext } from '@/context/DataContext';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { BiPaperPlane } from 'react-icons/bi';

export default function page() {

    const param = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState([]);
    const [recieversData, setRecieversData] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [messagesList, setMessagesList] = useState([]);
    const { count, setCount } = useContext(DataContext);
    const { isLoading, setIsLoading } = useContext(DataContext);


    useEffect(() => {
        getUserInfo();
        getRecieversData();
        getMessages();
    }, [count])

    useEffect(() => {
        getMessages();
    }, [send])



    async function getUserInfo() {
        const q = query(collection(db, "users"), where("email", "==", user?.email));
        const response = await getDocs(q);
        response.forEach((doc) => {
            setUserData(data => [...data, doc.data()]);
        });
        if (userData) {
            setIsLoading(false);
        }
    }

    async function getRecieversData() {
        const q = query(collection(db, "users"), where("user_uuid", "==", param.id[0]));
        const response = await getDocs(q);
        response.forEach((doc) => {
            setRecieversData(data => [...data, doc.data()]);
        })
    }

    async function send() {

        let now = new Date();

        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        hours = (hours < 10 ? "0" : "") + hours;
        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        const messageData = {
            author: userData[0]?.username,
            reciever: recieversData[0]?.username,
            message: messageInput,
            time: hours + ":" + minutes + ":" + seconds
        }

        const { author, reciever, message, time } = messageData;

        const res = await fetch('https://insta-clone-2aa4f-default-rtdb.firebaseio.com/messages.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                author,
                reciever,
                message,
                time,
            })
        });

        setMessageInput('');
        getMessages();
        document.getElementById('chatFeed').scrollTop = document.getElementById('chatFeed').scrollHeight
    }

    async function getMessages() {
        try {
            const response = await fetch('https://insta-clone-2aa4f-default-rtdb.firebaseio.com/messages.json');

            if (response.ok) {
                const jsonData = await response.json();
                const messagesArray = Object.values(jsonData);

                const filteredMessages = messagesArray.filter(m =>
                    (m?.author === userData[0]?.username && m?.reciever === recieversData[0]?.username) ||
                    (m?.author === recieversData[0]?.username && m?.reciever === userData[0]?.username)
                );

                setMessagesList(filteredMessages);
                setCount(count + 1);
                console.log(messagesList);
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    if (isLoading) {
        return (
            <div className="container w-full flex flex-col h-full items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="container w-full h-full">

            <Link href={`/user/${recieversData[0]?.user_uuid}`} className="container items-center w-full p-3 flex flex-row border-b gap-3">
                <img src={recieversData[0]?.profileImg} alt="" className="w-12 h-12 rounded-full" />
                <h2 className="text-xl capitalize font-semibold">{recieversData[0]?.username}</h2>
            </Link>

            <div id='chatFeed' className="container w-full h-[400px] overflow-auto md:h-[550px] px-3 md:p-5">

                {
                    messagesList.length > 0 ?

                        messagesList?.map((m, i) => {
                            return (
                                <div key={i} className={m.author == userData[0]?.username ? 'flex flex-col w-fit float-right clear-both' : 'flex flex-col w-fit float-left clear-both'}>
                                    <div className={m.author == userData[0]?.username ? "container w-fit rounded-lg my-2 p-3 bg-white text-gray-700 text-md font-semibold" : "container w-fit rounded-lg my-2 p-3 bg-blue-300 text-white text-md font-semibold"}>
                                        {m.message}
                                    </div>
                                    <p className="text-xs font-semibold px-4">{m.time}</p>
                                </div>
                            )
                        })
                        :
                        <div className="container h-full w-full flex flex-col items-center justify-center">
                            <h1 className="text-2xl fong-bold">
                                Say hi to {recieversData[0]?.username}
                            </h1>
                        </div>

                }


            </div>

            <div className="container flex md:p-5 px-3 flex-row w-full h-fit">
                <input value={messageInput} onChange={(e) => { setMessageInput(e.target.value) }} placeholder='type fast....' type="text" className="w-10/12 md:w-11/12 p-3 rounded-lg rounded-e-none bg-transparent border border-r-0 focus:outline-none" />
                <button className="p-3 md:w-1/12 w-2/12 border border-l-0 rounded-lg rounded-s-none bg-transparent">{messageInput.length > 0 ? <BiPaperPlane className='cursor-pointer' onClick={() => { send() }} size={30} /> : null}</button>
            </div>

        </div>
    )
}
