import Image from "next/image"
export default function HomePageWelcome() {
    return <div className="translate-y-[25%] flex flex-col items-center justify-center gap-20 mx-auto ">
        <h1 className=" text-center  animate-fadeIn   w-fit mx-auto  font-fraunces_semibold text-[clamp(24px,5vw,60px)]"> Welcome to SamrtHome Application</h1>
        <div className="relative animate-translateY    mx-auto aspect-video w-[clamp(243px,32vw,600px)] ">
            <Image src={'/images.png'} fill className=" w-auto object-cover  " />
        </div>
    </div>
}