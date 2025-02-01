import React from 'react'

const Navbar = () => {
  return (
    <div className="bg-gradient-to-b from-white via-white to-transparent bg-opacity-50 backdrop-blur-xl shadow-md h-16 text-black flex justify-around sticky top-0">
        <div className='bg-transparent h-[inherit] w-[95%] flex justify-between items-center'>
            <div className="font-extrabold text-xl">
                Name
            </div>
            <ul className='flex flex-row space-x-5'>
                <li className="font-semibold text-lg">Option1</li>
                <li className="font-semibold text-lg">Option2</li>
                <li className="font-semibold text-lg">Option3</li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar