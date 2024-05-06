import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-fit my-auto mt-[48vh] mb-[48vh] w-fit mx-auto">
      <Image
        height={24}
        width={24}
        sizes="24"
        src={"/logo.png"}
        className=" animate-spin"
      />
    </div>
  );
}
