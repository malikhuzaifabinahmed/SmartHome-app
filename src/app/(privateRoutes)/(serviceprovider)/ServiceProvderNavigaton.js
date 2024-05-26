'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ServiceProvderNavigaton() {

    const pathName = usePathname();
    console.log(pathName, pathName.includes('createDevice'));

    return (
        <div className="flex flex-1 flex-col items-center gap-5 justify-center">
            <Link className={'text-white py-2 px-3 text-center hover:bg-accent rounded-md hover:text-accent-foreground' + (pathName.includes('createDevice') ? " bg-white text-black" : "")} href='/serviceProvider/createDevice'>
                New Device
            </Link>
            <Link className={'text-white py-2 px-3 text-center hover:bg-accent rounded-md hover:text-accent-foreground' + (pathName.includes('createHome') ? " bg-white text-black" : "")} href='/serviceProvider/createHome'>
                New Home
            </Link>
            <Link className={'text-white py-2 px-3 text-center hover:bg-accent rounded-md hover:text-accent-foreground' + (pathName.includes('deviceList') ? " bg-white text-black" : "")} href='/serviceProvider/deviceList'>
                Device List
            </Link>
            <Link className={'text-white py-2 px-3 text-center hover:bg-accent rounded-md hover:text-accent-foreground' + (pathName.includes('homeList') ? " bg-white text-black" : "")} href='/serviceProvider/homeList'>
                Home List
            </Link>
        </div>
    );
}
