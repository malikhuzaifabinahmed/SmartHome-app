import React from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./button";
const MyButton = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Button
        className={cn(
          myButtonVariants({ className, variant, size }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
MyButton.displayName = "MyButton";
export const myButtonVariants = (props) =>
  cn(buttonVariants({ ...props }), "active:scale-95 transition-[1.5s]");
export default MyButton;
