import { cn } from "@/lib/utils";

export default function MaxWidthWrapper({ className, children }) {
  return (
    <div className={cn("max-w-screen-xl mx-auto", className)}>{children}</div>
  );
}
