import React from 'react'

const Navbar = () => {
  return (
    <div className="bg-gradient-to-b from-white to-transparent bg-opacity-50 backdrop-blur-xl shadow-md h-12 text-black flex justify-around sticky top-0 w-full z-20">
        <div className='bg-transparent h-[inherit] w-[95%] flex justify-between items-center'>
            <div className="font-extrabold text-xl">
                Camly
            </div>
            <ul className='flex flex-row space-x-5'>
                <li className="font-semibold text-lg hover:text-white hover:bg-[#001219] rounded-full px-2 py-1 transition-colors duration-500 cursor-pointer">Option1</li>
                <li className="font-semibold text-lg hover:text-white hover:bg-[#001219] rounded-full px-2 py-1 transition-colors duration-500 cursor-pointer">Option2</li>
                <li className="font-semibold text-lg hover:text-white hover:bg-[#001219] rounded-full px-2 py-1 transition-colors duration-500 cursor-pointer">Option3</li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar