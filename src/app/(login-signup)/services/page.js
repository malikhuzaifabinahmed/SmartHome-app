import Image from "next/image";

export default function Page() {
    return <div>
        <div className=" h-[500px] relative w-full overflow-hidden z-[-1]" ><Image fill src="/services.png" className="z-0 w-full h-auto object-cover  " /></div>

        <div className="flex flex-col font-light gap-5 mt-10 text-justify font-rubik text-[20px] w-full max-w-[1000px] mx-auto">
            <p>
                Welcome to Smart Home, where we're dedicated to making your home smarter, safer, and more convenient than ever before. Explore our range of services designed to enhance your lifestyle:
            </p>
            <p>
                Home Automation: Control your lights, thermostat, security cameras, and more from the palm of your hand with our intuitive home automation solutions.
                Smart Security: Keep your home secure with cutting-edge smart security systems, including motion sensors, doorbell cameras, and remote monitoring capabilities.
                Energy Management: Optimize energy usage and reduce utility bills with our energy management solutions, including smart thermostats and energy-efficient appliances.
                Voice Control Integration: Experience hands-free convenience with voice control integration, allowing you to command your smart home devices with simple voice commands.
                Custom Solutions: We offer tailored smart home solutions to fit your unique needs and preferences, ensuring that your home automation system works seamlessly for you.
                Transform your house into a smart home today and discover the endless possibilities with Smart Home.
            </p>

        </div>
    </div>
}