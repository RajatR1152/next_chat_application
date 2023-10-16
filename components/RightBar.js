'use client'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function RightBar() {
  const path = usePathname();

    if(path === '/login' || path === '/register'){
        return null;
    }
  return (
    <div>RightBar</div>
  )
}
