import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function SinglePageLayout({
  className,
  cardStyle = {},
  showLogo = true,
  backgroundImage,
  titleClassName,
  title,
  children,
  additionalText,
  cardClass,
}) {
  return (
    <div
      style={{
        background:
          backgroundImage ||
          "linear-gradient(110.56deg, rgba(147, 241, 251, 0.2) 12.99%, rgba(80, 131, 254, 0.2) 88.67%)",
        backgroundPosition: "center",
      }}
      className={cn("min-h-screen w-full flex  ", className)}
    >
      <div className="w-full pt-32 py-20 px-3 sm:px-20">
        {showLogo && (
          <div className="relative max-sm:hidden size-28 mx-auto">
            <Link href={"/"}>
              <Image fill className="mx-auto  mb-10" alt="" src={"/logo.png"} />
            </Link>
          </div>
        )}

        <div
          style={cardStyle}
          className={cn(
            `max-w-[500px] ${
              showLogo ? "" : "mt-20"
            }  flex flex-col justify-center items-center  w-full mx-auto bg-white border rounded-xl`,
            cardClass
          )}
        >
          <div
            className={cn(
              "text-3xl  font-fraunces_bold p-5 text-center",
              titleClassName
            )}
          >
            {title || "Welcome Back"}
          </div>
          {children}
        </div>
        <div className="max-w-[743px] mx-auto my-10 text-center">
          {additionalText ||
            "Over 50% of bad credit and self-employed mortgages aren’t available to you directly and only through specialist brokers. We help only work on the tricky stuff."}
        </div>
      </div>
    </div>
  );
}

export default SinglePageLayout;
