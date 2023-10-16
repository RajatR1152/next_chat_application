'use client'
import { DataContext } from '@/context/DataContext';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { use, useContext, useEffect } from 'react'
import { AiFillHeart, AiFillHome, AiFillMessage, AiFillPlusSquare, AiFillSetting, AiOutlineBars, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai'

export default function SideBar() {
    const path = usePathname();
    const { count, setIsLoading } = useContext(DataContext);
    let messageCount;
    const user = JSON.parse(localStorage.getItem("user"));
    const router = useRouter();

    if (!user) {
        router.push('/login');
    }

    if (path === '/login' || path === '/register') {
        return null;
    }


    return (
        <div className="container w-full border-e flex h-full flex-col p-5 gap-8">
            <Link onClick={() => { setIsLoading(true) }} href={'/'} className='flex flex-row gap-4 items-center' ><AiFillHome size={30} /><span className="text-lg font-semibold">home</span></Link>
            <Link onClick={() => { setIsLoading(true) }} href={'/messages'} className='flex flex-row gap-4 items-center' ><AiFillMessage size={30} /><span className="text-lg font-semibold">messages</span>{count > messageCount ? "1" : null}</Link>
            <Link onClick={() => { setIsLoading(true) }} href={'/friends'} className='flex flex-row gap-4 items-center' ><AiOutlineUser size={30} /><span className="text-lg font-semibold">friends</span></Link>
            <Link onClick={() => { setIsLoading(true) }} href={'/requests'} className='flex flex-row gap-4 items-center' ><AiFillHeart size={30} /><span className="text-lg font-semibold">notifications</span></Link>
            <Link onClick={() => { setIsLoading(true) }} href={'/create'} className='flex flex-row gap-4 items-center' ><AiFillPlusSquare size={30} /><span className="text-lg font-semibold">create</span></Link>
            <Link onClick={() => { setIsLoading(true) }} href={'/search'} className='flex flex-row gap-4 items-center' ><AiOutlineSearch size={30} /><span className="text-lg font-semibold">search</span></Link>
            <Link onClick={() => { setIsLoading(true) }} href={'/'} className='flex flex-row gap-4 items-center' ><AiOutlineBars size={30} /><span className="text-lg font-semibold">more</span></Link>
            <Link onClick={() => { setIsLoading(true) }} href={'/edit'} className='flex flex-row gap-4 items-center' ><AiFillSetting size={30} /><span className="text-lg font-semibold">setting</span></Link>
        </div>
    )
}
