import Image from "next/image";

export default function Page() {
    return <div>
        <div className=" h-[500px] relative w-full overflow-hidden z-[-1]" ><Image fill src="/aboutus.png" className="z-0 w-full h-auto object-cover  " /></div>

        <div className="flex flex-col font-light gap-5 mt-10 text-justify font-rubik text-[20px] w-full max-w-[1000px] mx-auto">
            <p>
                Welcome to Smart Home, your trusted partner in smart home solutions. With a passion for innovation and a commitment to excellence, we strive to enhance your lifestyle through cutting-edge technology.
            </p>
            <p>
                At Smart Home, we believe that your home should be a reflection of your unique personality and needs. That's why we offer personalized smart home solutions tailored to fit your lifestyle, making everyday living more convenient, efficient, and secure.

            </p>
            <p>Our team of experts is dedicated to providing top-notch service and support every step of the way. From consultation to installation, we're here to ensure that your smart home experience exceeds your expectations.
            </p>
            <p>Join us on the journey to a smarter future. Contact Smart Home today to learn more about how we can transform your house into the home of tomorrow</p>        </div>
    </div>
}