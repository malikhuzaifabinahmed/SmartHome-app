"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import { RotateCw } from "lucide-react";
import MyButton from "../ui/MyButton";
export default function SignupForm() {
  const [isLoading, setIsloading] = useState(false);
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = (values) => {
    dispatch(registerUser(values));
  };

  return (
    <form className="flex flex-col gap-5 my-10 w-full">
      <div className="mx-auto w-full flex flex-col gap-5 px-5 max-w-sm">
        <div className="grid w-full max-w-md  items-center gap-1.5">
          <InputField
            label="First Name"
            type="first_name"
            id="first_name"
            placeholder="First Name"
            name="first_name"
          />
        </div>
        <div className="grid w-full max-w-md  items-center gap-1.5">
          <InputField
            label="Last Name"
            type="last_name"
            id="last_name"
            placeholder="Last Name"
            name="last_name"
          />
        </div>
        <div className="grid w-full max-w-md  items-center gap-1.5">
          <InputField
            label="Email"
            type="email"
            id="email"
            placeholder="Email"
            name="email"
          />
        </div>
        <div className="grid w-full max-w-md items-center gap-1.5">
          <InputField
            label="Password"
            type="password"
            id="password"
            placeholder="Enter Your Password"
          />
        </div>
        <div className="grid w-full max-w-md items-center gap-1.5">
          <InputField
            label="Confirm Password"
            type="password"
            id="password_confirmation"
            placeholder="Confirm Password"
          />
        </div>

        <MyButton className=" min-[320px]:w-[246px] self-center">
          {isLoading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
          Sign up
        </MyButton>
        <div className="text-xs self-end">
          Already have an account?
          <span>
            <Link href={"/login"}>
              <MyButton variant="link">Login</MyButton>
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
}
