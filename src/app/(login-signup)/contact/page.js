import Image from "next/image";

export default function Page() {
    return <div>
        <div className=" h-[500px] relative w-full overflow-hidden z-[-1]" ><Image fill src="/contact.png" className="z-0 w-full h-auto object-cover  " /></div>

        <div className="flex flex-col font-light gap-5 mt-10 text-justify font-rubik text-[20px] w-full max-w-[1000px] mx-auto">
            <p>
                Have questions about our smart home services or need assistance with your existing system? Our team is here to help! Get in touch with us using the contact information below
            </p>
            <p>

                Phone: 0300-5673145


            </p>
            <p>Email: serviceProvider@gmail.com

            </p>
        </div>
    </div>
}