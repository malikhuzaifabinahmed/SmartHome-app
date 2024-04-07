"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import { RotateCw } from "lucide-react";
import MyButton from "../ui/MyButton";
import { Formik, useFormik } from "formik";
import { toast } from "sonner";
import { register } from "@/actions/Authenticate";
import { setCookies } from "@/actions/cookiesManger";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const [isLoading, setIsloading] = useState(false);
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("emptyField"),
    last_name: Yup.string().required("emptyField"),
    email: Yup.string().email("invalidEmail").required("emptyField"),
    password: Yup.string().min(8, "passwordStrength").required("emptyField"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "passwordMismatch")
      .required("emptyField"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsloading(true);

      try {
        let response = await register({
          firstName: values.first_name,
          lastName: values.last_name,
          email: values.email,
          password: values.password,
          role: "user",
        });

        localStorage.setItem("refreshToken", response.refreshToken);
        toast("Successful Sign up.");
        router.push('/dashboard');
        setIsloading(false);
      } catch (error) {
        toast("Something went wrong!");
        setIsloading(false);
      }
    },
  });
  return (
    <form
      action={formik.handleSubmit}
      className="flex flex-col  gap-5 mb-10 w-full"
    >
      <div className="mx-auto w-full flex flex-col gap-5 px-10 ">
        <div className="grid w-full max-w-md  items-center gap-1.5">
          <InputField
            label="First Name"
            type="first_name"
            id="first_name"
            placeholder="First Name"
            name="first_name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.first_name}
            error={
              formik.touched.first_name &&
              formik.errors.first_name &&
              formik.errors.first_name
            }
          />
        </div>
        <div className="grid w-full max-w-md  items-center gap-1.5">
          <InputField
            label="Last Name"
            type="last_name"
            id="last_name"
            placeholder="Last Name"
            name="last_name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.last_name}
            error={
              formik.touched.last_name &&
              formik.errors.last_name &&
              formik.errors.last_name
            }
          />
        </div>
        <div className="grid w-full max-w-md  items-center gap-1.5">
          <InputField
            label="Email"
            type="email"
            id="email"
            placeholder="Email"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
            error={
              formik.touched.email && formik.errors.email && formik.errors.email
            }
          />
        </div>
        <div className="grid w-full max-w-md items-center gap-1.5">
          <InputField
            label="Password"
            type="password"
            id="password"
            placeholder="Enter Your Password"
            name={"password"}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
            error={
              formik.touched.password &&
              formik.errors.password &&
              formik.errors.password
            }
          />
        </div>
        <div className="grid w-full max-w-md items-center gap-1.5">
          <InputField
            label="Confirm Password"
            type="password"
            id="password_confirmation"
            name={"password_confirmation"}
            placeholder="Confirm Password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password_confirmation}
            error={
              formik.touched.password_confirmation &&
              formik.errors.password_confirmation &&
              formik.errors.password_confirmation
            }
          />
        </div>

        <MyButton type="submit" className=" min-[320px]:w-[246px] self-center">
          {isLoading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && "Sign up"}
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
