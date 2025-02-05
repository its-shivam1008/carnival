import Image from "next/image";

export default function Home() {
  return (
    <div className='w-full'>
      <div className="hero bg-[#d6d4d4] h-screen relative">
        <div className="bg-[#001219]/60 rounded-[12px] moving-div w-[200px] h-[200px]"></div>
        <div className="bg-[#001219]/60 rounded-[12px] moving-div w-[100px] h-[100px]"></div>
        <div className="bg-[#001219]/60 rounded-[12px] moving-div w-[80px] h-[80px]"></div>
        <div className="bg-white bg-opacity-10 backdrop-blur-sm h-screen w-full flex items-center justify-center z-1 top-0 absolute">
          <div>
             <div className="title">Camly</div>
             <div className="tagline">Speak, your way!</div>
          </div>
        </div>
      </div>
      <div className="features bg-[#f2f2f2]">
        <div className="feature1 flex justify-center items-center h-screen">
          <div className=' space-y-10 '>
            <div className='mx-auto w-fit text-center text-[6rem] py-8 px-20 rounded-full bg-[#78ff78]'>1</div>
            <div className='text-center text-xl font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem illo dolore voluptates recusandae assumenda minus asperiores amet mollitia nulla ducimus.</div>
          </div>
        </div>
        <div className="feature2 flex justify-center items-center h-screen">
          <div className=' space-y-10 '>
              <div className='mx-auto w-fit text-center text-[6rem] py-8 px-20 rounded-full bg-[#78ff78]'>2</div>
              <div className='text-center text-xl font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem illo dolore voluptates recusandae assumenda minus asperiores amet mollitia nulla ducimus.</div>
          </div>
          </div>
          <div className="feature3 flex justify-center items-center h-screen">
            <div className=' space-y-10 '>
              <div className='mx-auto w-fit text-center text-[6rem] py-8 px-20 rounded-full bg-[#78ff78]'>3</div>
              <div className='text-center text-xl font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem illo dolore voluptates recusandae assumenda minus asperiores amet mollitia nulla ducimus.</div>
            </div>
          </div>
      </div>
    </div>
  );
}
