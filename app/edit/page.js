'use client'
import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { app, db } from '../shared/firebaseConfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import { DataContext } from '@/context/DataContext';

export default function Page() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const {count,setCount} = useContext(DataContext);
    const [profileData, setProfileData] = useState({
        username: '',
        profileImg: '',
        email: '',
        gender: '',
        bio: '',
        mobile: '',
        country: '',
        dob: '',
    });
    const storage = getStorage(app);

    useEffect(() => {
        getUserInfo();
    }, [count]);

    async function getUserInfo() {
        try {
            const q = query(collection(db, 'users'), where("email", "==", user?.email));
            const response = await getDocs(q);
            response.forEach((r) => {
                setUserData(r.data());
                setProfileData({
                    username: r.data()?.username || '',
                    profileImg: r.data()?.profileImg || '',
                    email: r.data()?.email || '',
                    gender: r.data()?.gender || '',
                    bio: r.data()?.bio || '',
                    mobile: r.data()?.mobile || '',
                    country: r.data()?.country || '',
                    dob: r.data()?.dob || '',
                });
                setIsLoading(false);
            });
        } catch (error) {
            console.error("Error getting user info:", error);
        }
    }

    function handle(e) {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    }


    async function handleFile(e) {
        const file = e.target.files[0];
        setProfileData(prevData => ({
            ...prevData,
            profileImg: file
        }));
      setCount(count+1);
    }

    const showToast = () => {
        toast.success('data updated succesfully');
    };

    async function submit() {
        try {
            const storageRef = ref(storage, 'profileImgs/' + profileData.profileImg.name);
            await uploadBytes(storageRef, profileData.profileImg);
            const imageUrl = await getDownloadURL(storageRef);

            const q = query(collection(db, "users"), where("email", "==", user.email))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    ...profileData,
                    profileImg: imageUrl,
                    gender: document.getElementById('gender').value
                });
            });

            showToast();
            setCount(count+1);

            console.log("Profile data updated successfully!");
        } catch (error) {
            console.error("Error updating profile data:", error);
        }
    }

    return (
        <>
            {
                isLoading ?
                    <div className="container w-full h-full flex flex-col items-center justify-center" >
                        <Spinner />
                    </div>
                    :
                    <div className="container w-full md:w-8/12 py-10 mx-auto flex gap-4 flex-col h-full overflow-auto">

                        <label htmlFor="imgInput">

                            {
                                profileData?.profileImg ?
                                    <img src={profileData.profileImg} alt="" className="w-48 mx-auto h-48 rounded-full" />
                                    :
                                    <img src={userData.profileImg} alt="" className="w-48 mx-auto h-48 rounded-full" />
                            }

                        </label>

                        <input type="file" onChange={handleFile} name="imgInput" id="imgInput" hidden />

                        <div className="container w-full h-full">

                            <div className="container flex my-4 items-center md:flex-row flex-col w-full">
                                <h1 className="text-2xl font-bold text md:w-4/12">username </h1>
                                <input name='username' value={profileData.username} onChange={handle} placeholder='username...' type="text" className="w-11/12 md:w-7/12 border p-3 bg-transparent rounded-lg focus:outline-none" />
                            </div>

                            <div className="container flex my-4 items-center md:flex-row flex-col w-full">
                                <h1 className="text-2xl font-bold text md:w-4/12">email </h1>
                                <input name="email" value={profileData.email} onChange={handle} placeholder='email...' type="text" className="w-11/12 md:w-7/12 border p-3 bg-transparent rounded-lg focus:outline-none" />
                            </div>

                            <div className="container flex my-4 items-center md:flex-row flex-col w-full">
                                <h1 className="text-2xl font-bold text md:w-4/12">mobile </h1>
                                <input name="mobile" value={profileData.mobile} onChange={handle} placeholder='mobile...' type="text" className="w-11/12 md:w-7/12 border p-3 bg-transparent rounded-lg focus:outline-none" />
                            </div>

                            <div className="container flex my-4 items-center md:flex-row flex-col w-full">
                                <h1 className="text-2xl font-bold text md:w-4/12">country </h1>
                                <input name="country" value={profileData.country} onChange={handle} placeholder='country...' type="text" className="w-11/12 md:w-7/12 border p-3 bg-transparent rounded-lg focus:outline-none" />
                            </div>

                            <div className="container flex my-4 items-center md:flex-row flex-col w-full">
                                <h1 className="text-2xl font-bold text md:w-4/12">bio </h1>
                                <textarea name="bio" placeholder='bio...' value={profileData.bio} onChange={handle} className="w-11/12 md:w-7/12 border p-3 bg-transparent rounded-lg focus:outline-none" id="bio" cols="30" rows="10"></textarea>
                            </div>

                            <div className="container flex my-4 items-center md:flex-row flex-col w-full">
                                <h1 className="text-2xl font-bold text md:w-4/12">date of birth </h1>
                                <input name="dob" value={profileData.dob} onChange={handle} placeholder='username...' type="date" className="w-11/12 md:w-7/12 border p-3 bg-transparent rounded-lg focus:outline-none" />
                            </div>

                            <div className="container flex my-4 items-center md:flex-row flex-col w-full">
                                <h1 className="text-2xl font-bold text md:w-4/12">gender </h1>
                                <select name="gender" id='gender' placeholder='gender...' className="w-11/12 md:w-7/12 border p-3 bg-transparent rounded-lg focus:outline-none" >
                                    <option value="male">male</option>
                                    <option value="female">female</option>
                                </select>
                            </div>

                            <button onClick={() => { submit() }} className="bg-transparent border border-gray-300 hover:bg-gray-900 hover:text-white-800 rounded-lg font-semibold p-3 w-full">submit</button>

                        </div>

                    </div>
            }
        </>
    )
}
