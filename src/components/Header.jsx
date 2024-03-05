import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./MaxWidthWrapper";

export default function Header() {
  return (
    <MaxWidthWrapper className={"my-5 px-5"}>
      <div className=" flex justify-between bg-primary/10 py-2 rounded-lg items-center px-10">
        <Image
          height={24}
          width={24}
          sizes="24"
          src={"/logo.png"}
          className="w-auto h-[48px]"
        />
        <Link
          href={"/login"}
          className={cn(
            "bg-secondary/40",
            buttonVariants({ variant: "ghost" })
          )}
        >
          Login
        </Link>
      </div>
    </MaxWidthWrapper>
  );
}
