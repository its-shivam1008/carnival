"use client";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);


export default function Home() {
  // const logMaker = () => {}
  //GSAP
  // hero section animation
  useGSAP(() => {
    // let tl = gsap.timeline();
    gsap.to('.moving-div1',{
      // rotate:360,
      x:-50,
      y:250,
      duration:70,
      repeat:-1,
      ease:"power1.out",
      yoyo:true
    })
    gsap.to('.moving-div2',{
      // rotate:360,
      x:-200,
      y:50,
      duration:80,
      repeat:-1,
      ease:"power1.out",
      yoyo:true
    })
    gsap.to('.moving-div3',{
      // rotate:360,
      x:-250,
      y:30,
      duration:60,
      repeat:-1,
      ease:"power1.out",
      yoyo:true
    })
  })
  //features page animation
  useGSAP(() => {
    let tl = gsap.timeline();
    tl.from("#features .featurePage1 div .number",{
      duration:2,
      opacity:0,
      scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top 0%",
        end:"end end",
        scrub:3,
        pin:true
      }
    })
    tl.from("#features .featurePage1 div .textFeature", {
      duration:3,
      scale:0,
      scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top 0%",
        end:"end end",
        scrub:3,
        pin:true
      }
    })
    tl.from("#features .featurePage2 div .number",{
      duration:2,
      opacity:0,
      scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top -100%",
        end:"end end",
        scrub:3,
        pin:true
      }
    })
    tl.from("#features .featurePage2 div .textFeature", {
      duration:3,
      scale:0,
      scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top -100%",
        end:"end end",
        scrub:3,
        pin:true
      }
    })
    tl.from("#features .featurePage3 div .number",{
      duration:2,
      opacity:0,
      scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top -170%",
        end:"end end",
        scrub:3,
        pin:true
      }
    })
    tl.from("#features .featurePage3 div .textFeature", {
      duration:3,
      scale:0,
      scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top -170%",
        end:"end end",
        scrub:3,
        pin:true
      }
    })
  })
  return (
    <div className='w-full'>
      <div className="hero bg-[#d6d4d4] h-screen relative">
        <div className='moving-div1 z-1 top-32 left-60 absolute'>
          <div className='w-fit p-5'>
                <div className="relative w-[235px] h-[235px] opacity-100 bg-[#78ff78] rounded-xl blur-lg">
                <div className="bg-[#001219] absolute rounded-[12px] inset-5 moving-div w-[200px] h-[200px]"></div>
              </div>
          </div>
        </div>
        <div className="moving-div2 bg-[#001219]/60 rounded-[12px] moving-div w-[100px] h-[100px] z-1 top-48 right-1/4 absolute"></div>
        <div className='moving-div3 z-1 bottom-48 left-3/4 absolute'>
          <div className='w-fit p-5'>
                <div className="relative w-[120px] h-[120px] opacity-100 bg-[#78ff78] rounded-xl blur-lg">
                <div className="bg-[#001219] absolute rounded-[12px] inset-5 moving-div w-[80px] h-[80px]"></div>
              </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur-sm h-screen w-full flex items-center justify-center z-10 top-0 absolute">
          <div className='space-y-3 flex flex-col justify-center'>
             <div className="title text-center text-[5rem] tracking-wide font-bold">Camly</div>
             <div className="tagline text-black tracking-[1rem] text-center text-2xl font-light">Speak, your way!</div>
             <div className='relative w-fit p-5 mx-auto group'>
              <div
            className="absolute transitiona-all duration-1000 opacity-10 -inset-px bg-[#78ff78] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-500 animate-tilt">
        </div>
             <button type="button" className='p-2 shadow-xl relative py-2 px-8 bg-black rounded-[8px] text-white font-semibold tracking-wider'>Call a friend</button>
             </div>
          </div>
        </div>
      </div>
      <div id='features' className="features bg-[#f2f2f2]">
        <div className="featurePage1 flex justify-center items-center h-screen">
          <div className=' space-y-10 '>
            <div className='number mx-auto w-fit text-center text-[5rem] py-7 px-16 rounded-full bg-[#78ff78]'>1</div>
            <div className='textFeature text-center text-lg font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem illo dolore voluptates recusandae assumenda minus asperiores amet mollitia nulla ducimus.</div>
          </div>
        </div>
        <div className="featurePage2 flex justify-center items-center h-screen">
          <div className=' space-y-10 '>
              <div className='number mx-auto w-fit text-center text-[5rem] py-7 px-16 rounded-full bg-[#78ff78]'>2</div>
              <div className='textFeature text-center text-lg font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem illo dolore voluptates recusandae assumenda minus asperiores amet mollitia nulla ducimus.</div>
          </div>
          </div>
          <div className="featurePage3 flex justify-center items-center h-screen">
            <div className=' space-y-10 '>
              <div className='number mx-auto w-fit text-center text-[5rem] py-7 px-16 rounded-full bg-[#78ff78]'>3</div>
              <div className='textFeature text-center text-lg font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem illo dolore voluptates recusandae assumenda minus asperiores amet mollitia nulla ducimus.</div>
            </div>
          </div>
      </div>
    </div>
  );
}
