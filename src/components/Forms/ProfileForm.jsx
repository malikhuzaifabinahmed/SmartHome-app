"use client"
import { use, useEffect, useState } from "react";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import { RotateCw } from "lucide-react";
import MyButton from "../ui/MyButton";
import { Formik, useFormik } from "formik";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { updateUser } from "@/actions/Authenticate";

export default function ProfileForm({ user }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object({
        first_name: Yup.string().required("First name is required"),
        last_name: Yup.string().required("Last name is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters"),
        password_confirmation: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
    });
    console.log(user)
    const formik = useFormik({
        initialValues: {
            first_name: user.firstName,
            last_name: user.lastName,
            password: "",
            password_confirmation: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);

            try {
                await updateUser({ firstName: values.first_name, lastName: values.last_name, password: values.password })
                toast("Profile updated successfully.");
                router.push('/dashboard/profile');
            } catch (error) {
                console.log(error)
                toast("Something went wrong!");
            }
            setIsLoading(false);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 mb-10 w-full">
            <div className="mx-auto w-full  max-w-[500px] flex flex-col gap-5 px-10 ">
                <div className="grid w-full max-w-md items-center gap-1.5">
                    <InputField
                        label="First Name"
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.first_name && formik.errors.first_name}
                    />
                </div>
                <div className="grid w-full max-w-md items-center gap-1.5">
                    <InputField
                        label="Last Name"
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.last_name && formik.errors.last_name}
                    />
                </div>
                <div className="grid w-full max-w-md items-center gap-1.5">
                    <InputField
                        label="Email"
                        type="email"
                        id="email"
                        value={user.email}
                        disabled
                    />
                </div>
                <div className="grid w-full max-w-md items-center gap-1.5">
                    <InputField
                        label="Password"
                        type="password"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password}
                    />
                </div>
                <div className="grid w-full max-w-md items-center gap-1.5">
                    <InputField
                        label="Confirm Password"
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formik.values.password_confirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password_confirmation && formik.errors.password_confirmation}
                    />
                </div>
                <MyButton type="submit" className="min-[320px] w-[246px] self-center">
                    {isLoading ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                </MyButton>
            </div>
        </form>
    );
}
