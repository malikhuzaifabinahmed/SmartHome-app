import { logout } from "@/actions/Authenticate";
import MyButton from "@/components/ui/MyButton";
import Image from "next/image";
import Link from "next/link";
import { ServiceProvderNavigaton } from "./ServiceProvderNavigaton";

export default function Layout({ children }) {

  return <div className="flex h-[100vh]">
    <div className=" flex flex-col  w-[20%] bg-primary p-5 rounded-tr-md rounded-br-md ">
      <div className=" flex justify-center">
        <Link href={"/"}>
          {" "}
          <div className=" flex justify-between bg-accent/10 py-2 rounded-lg items-center px-10">
            {" "}
            <Image
              height={24}
              width={24}
              sizes="24"
              src={"/logo.png"}
              className="w-auto h-[48px]"
            />
          </div>
        </Link>
      </div>

      <ServiceProvderNavigaton />
      <form className='mx-auto  ' action={logout}>
        <MyButton variant='secondary' type="submit" >Logout</MyButton>
      </form>
    </div>
    <div className="   w-[80%]  overflow-y-scroll">{children}</div>
  </div>
}


