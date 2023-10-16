'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app, db } from '../shared/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function page() {

    const auth = getAuth(app);

    const [user, setUser] = useState({
        user_uuid: '',
        username: "",
        email: '',
        password: '',
        cnfPassword: '',
        profileImg: 'https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg',
        friends: [],
        posts: [],
        requests: [],
        messages: [],
        bio: ''
    });

    function generateUniqueId() {
        const randomNum = Math.floor(Math.random() * 10000);

        const timestamp = new Date().getTime();

        const uniqueId = `${timestamp}${randomNum}`;

        return uniqueId;
    }

    let n;
    let v;

    function handle(e) {
        n = e.target.name;
        v = e.target.value;
        setUser({ ...user, [n]: v });
    }

    async function submit() {

        user.user_uuid = generateUniqueId();
        if (user.password === user.cnfPassword) {
            document.getElementById('warning').innerText = ' '
            createUserWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });

            const { user_uuid, username, email, profileImg, requests, password, friends, posts, messages, bio } = user;

            const res = await fetch('https://insta-clone-2aa4f-default-rtdb.firebaseio.com/users.json', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_uuid,
                    profileImg,
                    posts,
                    friends,
                    messages,
                    username,
                    email,
                    password,
                    requests,
                    bio,
                })
            });


            await setDoc(doc(db, 'users', generateUniqueId()), user).then((res) => {
                setUser({
                    user_uuid: '',
                    username: "",
                    email: '',
                    password: '',
                    cnfPassword: '',
                    friends: [],
                    posts: [],
                    requests: [],
                    messages: [],
                    bio: '',
                    profileImg: 'https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg'
                });
            })
        }
        else {
            document.getElementById('warning').innerText = 'password and confirm password does not match.'
        }
    }


    return (
        <div className="container w-full h-screen flex flex-col overflow-hidden justify-center items-center">
            <form method='post' className="md:w-4/12 md:border w-full overflow-auto border-gray-400 h-fit p-5">
                <h1 className="text-3xl text-center font-bold">Sign Up</h1>

                <div className="container w-full my-4 mt-16">
                    <input name='username' value={user.username} onChange={handle} required type="text" placeholder='username...' className="w-full p-4 border bg-transparent focus:outline-none text-white" />
                </div>
                <div className="container w-full my-3">
                    <input name='email' value={user.email} onChange={handle} required type="email" placeholder='email...' className="w-full p-4 border bg-transparent focus:outline-none text-white" />
                </div>
                <div className="container w-full my-3">
                    <input name='password' value={user.password} onChange={handle} required type="password" placeholder='password...' className="w-full p-4 border bg-transparent focus:outline-none text-white" />
                </div>

                <p id='warning' className="text-md font-semibold text-yellow-400 text-center"></p>

                <div className="container w-full my-3">
                    <input name='cnfPassword' value={user.cnfPassword} onChange={handle} required type="text" placeholder='confirm password...' className="w-full p-4 border bg-transparent focus:outline-none text-white" />
                </div>

                <button onClick={() => { submit() }} className="w-full text-xl p-4 bg-transparent border font-bold text-white hover:border-0 my-5 hover:bg-violet-800">Sign Up</button>

            </form>

            <div className="container w-full md:w-4/12 mt-5 md:border border-gray-400 p-8 h-fit">
                <p className="text-center font-semibold">already have account ? <Link href={'/login'} className='text-blue-400' >log in</Link></p>
            </div>
        </div>
    )
}
