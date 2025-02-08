"use client";
import React from 'react'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="bg-gradient-to-b from-white to-transparent bg-opacity-50 backdrop-blur-xl shadow-md h-12 text-black flex justify-around sticky top-0 w-full z-20">
        <div className='bg-transparent h-[inherit] w-[95%] flex justify-between items-center'>
            <Link href="/" className="font-extrabold text-xl">
                Camly
            </Link>
            <div className='flex flex-row space-x-5'>
            {/* <UserButton/> */}
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
                <Link href='/users' className="font-semibold text-lg hover:text-white hover:bg-[#001219] rounded-full px-2 py-1 transition-colors duration-500 cursor-pointer">Users</Link>
                <div className="font-semibold text-lg hover:text-white hover:bg-[#001219] rounded-full px-2 py-1 transition-colors duration-500 cursor-pointer">Option2</div>
                <div className="font-semibold text-lg hover:text-white hover:bg-[#001219] rounded-full px-2 py-1 transition-colors duration-500 cursor-pointer">Option3</div>
            </div>
        </div>
    </div>
  )
}

export default Navbar