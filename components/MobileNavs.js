'use client'
import { DataContext } from '@/context/DataContext';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react'
import { AiFillHeart, AiFillHome, AiFillMessage, AiFillPlusSquare, AiFillSetting, AiOutlineBars, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai'

export default function MobileNavs() {

  const { isLoading, setIsLoading } = useContext(DataContext);
  const router = useRouter();
  const path = usePathname();
  
  if (path == '/login' || path == " /register") {
    return null;
  }

  return (
    <div className="container w-full shadow-lg py-3 border-t-2 flex md:hidden h-fit flex-row justify-between">
      <Link onClick={() => { setIsLoading(true) }} href={'/'} className='flex flex-row gap-4 items-center' ><AiFillHome size={29} /></Link>
      <Link onClick={() => { setIsLoading(true) }} href={'/messages'} className='flex flex-row gap-4 items-center' ><AiFillMessage size={29} /></Link>
      <Link onClick={() => { setIsLoading(true) }} href={'/friends'} className='flex flex-row gap-4 items-center' ><AiOutlineUser size={29} /></Link>
      <Link onClick={() => { setIsLoading(true) }} href={'/requests'} className='flex flex-row gap-4 items-center' ><AiFillHeart size={29} /></Link>
      <Link onClick={() => { setIsLoading(true) }} href={'/create'} className='flex flex-row gap-4 items-center' ><AiFillPlusSquare size={29} /></Link>
      <Link onClick={() => { setIsLoading(true) }} href={'/search'} className='flex flex-row gap-4 items-center' ><AiOutlineSearch size={29} /></Link>
    </div>
  )
}
