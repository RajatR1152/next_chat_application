'use client'
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { db } from '../shared/firebaseConfig';
import { DataContext } from '@/context/DataContext';

export default function page() {

  const [searchInput, setSearchInput] = useState('');
  const [result, setResult] = useState([]);
  const { isLoading, setIsLoading } = useContext(DataContext);


  useEffect(() => {
    setIsLoading(false);
  }, [])

  async function search() {
    try {
      const q = query(collection(db, 'users'), where("username", "==", searchInput));
      const querySnapshot = await getDocs(q);
      const searchData = [];

      querySnapshot.forEach((doc) => {
        searchData.push(doc.data());
      });

      setResult(searchData);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  }


  return (
    <div className="container w-full h-5/6 p-5">

      <div className="container w-full flex flex-row">
        <input placeholder='search....' onChange={(e) => { setSearchInput(e.target.value) }} type="text" className="p-3 focus:outline-none bg-transparent border border-e-0 rounded-xl rounded-e-none border-gray-200 md:w-11/12 w-10/12" />
        <button onClick={search} className="p-3 border border-s-0 bg-transparent rounded-e-xl"> <BiSearch size={30} /> </button>
      </div>

      <div className="container w-full mt-5 h-full overflow-auto">

        {
          result ?
            result.map((d) => {
              return (
                <Link key={d.user_uuid} href={`/user/${d.user_uuid}`} className="container w-full p-3 flex border-b border-gray-300 flex-row gap-4 items-center">
                  <img src={d.profileImg} alt="" className="w-12 h-12 rounded-full" />
                  <h1 className="text-lg font-semibold">{d.username}</h1>
                </Link>
              )
            })
            :
            <div className="container w-full h-full flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold">nothing to show</h1>
            </div>
        }

      </div>

    </div>
  )
}
