'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../shared/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function page() {

    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    const auth = getAuth(app);
    const router = useRouter();

    let n;
    let v;

    function handle(e) {
        n = e.target.name;
        v = e.target.value;
        setUser({ ...user, [n]: v });
    }

    function logIn() {

        signInWithEmailAndPassword(auth, user.email, user.password)
            .then((userCredential) => {
                const user = JSON.stringify(userCredential.user);
                localStorage.setItem("user", user);
                document.getElementById('warning').innerText = ' ';
                router.push('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                document.getElementById('warning').innerText = 'invalid username or password'
            });
    }

    return (
        <div className="container w-full h-screen flex flex-col overflow-hidden justify-center items-center">
            <div className="md:w-4/12 md:border w-full border-gray-400 p-5 h-fit">
                <h1 className="text-3xl text-center font-bold">Log In</h1>

                <div className="container w-full my-4 mt-16">
                    <input name='email' value={user.email} onChange={handle} type="email" placeholder='email...' className="w-full p-4 border focus:outline-none bg-transparent text-white" />
                </div>

                <p id='warning' className="text-md font-semibold text-yellow-400 text-center"></p>

                <div className="container w-full my-3">
                    <input name='password' value={user.password} onChange={handle} type="password" placeholder='password...' className="w-full p-4 border focus:outline-none bg-transparent text-white" />
                </div>

                <button onClick={logIn} className="w-full text-xl p-4 bg-transparent border font-bold text-white hover:border-0 my-5 hover:bg-violet-800">log in</button>

            </div>

            <div className="container w-full md:w-4/12 mt-5 md:border border-gray-400 p-8 h-fit">
                <p className="text-center font-semibold">don't have account ? <Link href={'/register'} className='text-blue-400' >create account</Link></p>
            </div>
        </div>
    )
}
