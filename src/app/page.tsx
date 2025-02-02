import Image from "next/image";

export default function Home() {
  return (
    <div className='w-full'>
      <div className="hero bg-[#d6d4d4] h-screen relative">
        <div className="bg-[#001219]/60 rounded-[12px] moving-div w-[200px] h-[200px]"></div>
        <div className="bg-[#001219]/60 rounded-[12px] moving-div w-[100px] h-[100px]"></div>
        <div className="bg-[#001219]/60 rounded-[12px] moving-div w-[80px] h-[80px]"></div>
        <div className="bg-white bg-opacity-10 backdrop-blur-sm h-screen w-full flex items-center justify-center z-1 top-0 absolute">
          Call anyone
        </div>
      </div>
      <div className="text-white bg-[#f2f2f2] h-screen">
        Heloo 
      </div>
    </div>
  );
}
