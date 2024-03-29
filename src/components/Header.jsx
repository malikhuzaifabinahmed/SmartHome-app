import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { myButtonVariants } from "./ui/MyButton";

export default function Header() {
  return (
    <MaxWidthWrapper
      className={
        "my-5 fixed mx-0 translate-x-[-50%] top-0 left-[50%] w-full px-5"
      }
    >
      <div className=" flex  justify-between py-2 rounded-lg items-center px-10">
        <Link href={"/"}>
          {" "}
          <div className=" flex justify-between bg-primary/10 py-2 rounded-lg items-center px-10">
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
        <Link
          href={"/login"}
          className={cn(
            "bg-secondary/40",
            myButtonVariants({ variant: "ghost" })
          )}
        >
          Login
        </Link>
      </div>
    </MaxWidthWrapper>
  );
}
