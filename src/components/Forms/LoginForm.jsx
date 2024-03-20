"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Formik, Form, ErrorMessage } from "formik";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";
import * as Yup from "yup";
import { RotateCw } from "lucide-react";
import InputField from "../ui/InputField";
import MyButton, { myButtonVariants } from "../ui/MyButton";
import { cn } from "@/lib/utils";
export default function LoginForm() {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [isForgotPasswordClicked, setIsForgotPasswordClicked] = useState(false);

  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = isForgotPasswordClicked
    ? Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
      })
    : Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string().required("Required"),
      });

  return (
    <form className="flex w-full px-5 flex-col gap-4 my-5">
      <InputField label="Email" type="email" placeholder="Email" />
      <InputField label="Password" type="password" placeholder="Password" />
      <Link
        href={"/dashboard"}
        className={cn("w-full max-w-[120px] mx-auto", myButtonVariants())}
      >
        {" "}
        Login
      </Link>
    </form>
  );
}
