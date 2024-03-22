"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Formik, Form, ErrorMessage, useFormik } from "formik";
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
  const [isLoading, setIsloading] = useState (false)
    const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema =
   Yup.object({
        email: Yup.string().email("invalidEmail").required("emptyField"),
        password: Yup.string().required("emptyField"),
      });


      const formik = useFormik(
{
  initialValues,
  validationSchema,
onSubmit:(values)=>{
setIsloading(true)
  console.log(values)
} 
}


        );

  return (
    <form action= {formik.handleSubmit}className="flex w-full px-5 flex-col gap-4 my-5">
      <InputField label="Email" type="email" placeholder="Email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name={"email"} error={formik.touched.email && formik.errors.email && formik.errors.email  }/>
      <InputField label="Password" type="password" placeholder="Password" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} name={ "password"} error={formik.touched.password && formik.errors.password && formik.errors.password  }/>
      <MyButton
      type= "submit"
        className={cn("w-full flex gap-5 items-center max-w-[120px] mx-auto", myButtonVariants())}
      >
        {isLoading && <RotateCw className="animate-spin size-4"/>}
      {!isLoading&&  "Login"}
      </MyButton>
    <div className="flex w-full">
      <div className=" w-fit self-center ">or</div>
        <Link href={'/signup'} className ={cn(myButtonVariants({variant : "link" ,className:"slef-end"}),'justify-slef-end')} variant = "link"> Signup here.</Link>
    </div>
    </form>


  );
}
