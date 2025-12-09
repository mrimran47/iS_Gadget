import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-16 lg:px-12 py-3 
bg-gradient-to-r from-[#0A1625] to-[#0C1A2E] 
text-white 
shadow-[0_2px_20px_rgba(0,0,0,0.4)] 
border-b border-[#1F2A40]
rounded-none
relative z-50'>
      <Image onClick={() => router.push('/')} className='w-32 h-10 relative cursor-pointer' src={assets.logo} alt="" />
     
    </div>
  )
}

export default Navbar