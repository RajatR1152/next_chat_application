'use client'
import React, { useEffect, useState } from 'react'
import { BsCloudUpload } from 'react-icons/bs'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore'
import { app } from '../shared/firebaseConfig';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';


export default function page() {

    const user = JSON.parse(localStorage.getItem('user'));
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getUserInfo();
    }, [])

    const showToast = () => {
        toast.success('post created succesfully');
    };

    async function getUserInfo() {
        const q = query(collection(db, "users"), where("email", "==", user?.email));
        const querySnapShot = await getDocs(q);
        querySnapShot.forEach((doc) => {
            setUserData(doc.data());
        })
    }

    const db = getFirestore(app);
    const postId = Date.now().toString();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        caption: '',
        location: '',
        file: '',
        link: ''
    });

    let n;
    let v;

    function handle(e) {
        n = e.target.name;
        v = e.target.value;
        setFormData({ ...formData, [n]: v });
    }

    function handleFile(e) {
        setFormData({ ...formData, file: e.target.files[0] })
    }

    function OnSave(e) {
        setIsLoading(true);
        e.preventDefault();
        setLoading(true);
        uploadFile();
    }

    function generateUniqueId() {
        const randomNum = Math.floor(Math.random() * 10000);

        const timestamp = new Date().getTime();

        const uniqueId = `${timestamp}${randomNum}`;

        return uniqueId;
    }

    const storage = getStorage(app)

    const uploadFile = () => {
        const storageRef = ref(storage, 'photon/' + formData.file.name);
        uploadBytes(storageRef, formData.file).then((snapshot) => {
        }).then((res) => {
            getDownloadURL(storageRef).then(async (url) => {
                const postData = {
                    post_uid: generateUniqueId(),
                    caption: formData.caption,
                    location: formData.location,
                    link: formData.link,
                    image: url,
                    author: userData?.username,
                    authorImg: userData?.profileImg,
                    email: userData?.email,
                    id: postId,
                    comments: [],
                    likes: [],
                    author_id: userData?.user_uuid,
                }


                await setDoc(doc(db, 'posts', postId), postData).then((res) => {
                    console.log('saved');
                    setLoading(false);
                    setFormData({
                        caption: '',
                        location: '',
                        file: '',
                        link: ''
                    });
                    setIsLoading(false);
                    showToast();
                })

                // ---------------------

                const { caption, location, post_uid, link, image, author, authorImg, email, id, likes, comments, author_id } = postData;
                const res = await fetch('https://insta-clone-2aa4f-default-rtdb.firebaseio.com/posts.json', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        caption,
                        location,
                        post_uid,
                        link,
                        image,
                        author,
                        authorImg,
                        email,
                        id,
                        likes,
                        author_id,
                        comments
                    })
                });

            })
        })
    }

    return (
        <div className="contianer w-full p-2 md:p-8 rounded-lg h-fit md:h-[84%] md:mt-5 flex flex-col mx-auto">
            <div className="container w-full p-5">

                <label htmlFor="postimg">
                    <div className="container h-[80%] md:h-full mx-auto w-full border-4 border-dotted">
                        {
                            formData.file ? (
                                <img src={window.URL.createObjectURL(formData.file)} alt='' className='w-full h-[100%]' />
                            )
                                :
                                (
                                    <BsCloudUpload className='text-gray-500 w-fit mx-auto my-20 md:my-40' size={50} />
                                )
                        }
                    </div>
                </label>

                <input type="file" name="postimg" hidden onChange={handleFile} id="postimg" />

            </div>
            <form className="container mx-auto md:w-7/12 p-5">

                <div className="w-full my-6">
                    <h1 className="text-2xl font-bold text-gray-600">caption</h1>
                    <input type="text" name='caption' value={formData.caption} onChange={handle} placeholder='caption...' className="border border-gray-400 p-3 bg-transparent rounded-md w-full focus:outline-none my-3" />
                </div>

                <div className="w-full my-6">
                    <h1 className="text-2xl font-bold text-gray-600">location</h1>
                    <textarea type="text" name='location' value={formData.location} onChange={handle} placeholder='location...' className="border p-3 bg-transparent rounded-md w-full focus:outline-none my-3" />
                </div>

                <button className="p-3 bg-transparent hover:bg-white hover:text-gray-800 border font-bold text-white text-center w-full text-xl rounded-md" onClick={OnSave}>{isLoading ? <Spinner /> : "create"}</button>

            </form>
        </div>
    )
}

