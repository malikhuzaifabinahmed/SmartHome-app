import { errors } from "@/lib/Errors";
import { cn } from "@/lib/utils";

export default function ShowError({ type, children, className }) {
  if (type) {
    return (
      <div className={cn("text-red-500 text-sm", className)}>
        {type && errors[type]}
      </div>
    );
  }
  return (
    <div className={cn("text-red-500 text-sm", className)}>{children}</div>
  );
}
