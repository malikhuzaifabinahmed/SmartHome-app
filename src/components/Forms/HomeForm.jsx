'use client'

import { useState } from "react";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import MyButton from "../ui/MyButton";
import { RotateCw } from "lucide-react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCooKies } from "@/actions/cookiesManger";
import { createADevice, createaHome, getUserData, register } from "@/actions/Authenticate";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

export default function HomeForm({ user }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [tempProperties, setTempProperties] = useState([]);
  const [userdoesnotexits, setUserdoesnotexits] = useState(false);

  const initialValues = {
    password: '',
    homeName: "",
    ownerEmail: "",
    properties: {},
  };

  const validationSchema = Yup.object({
    password: userdoesnotexits ? Yup.string().required("emptyField") : '',
    homeName: Yup.string().required("emptyField"),
    ownerEmail: Yup.string().email("invalidEmail").required("emptyField"),
    properties: Yup.object().test(
      'properties-test',
      'All properties must have keys and values',
      (value) => {
        if (!value) return true;
        return Object.keys(value).every((key) => key.trim() !== '' && value[key].trim() !== '');
      }
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      // Creating device object
      let properties = {};
      tempProperties.forEach(({ key, value }) => {
        properties[`${key}`] = value;
      });

      try {
        let user = await getUserData({ email: values.ownerEmail });
        if (user.isOk) {
          let response = await createaHome({
            homeName: values.homeName,
            properties: properties,
            ownerEmail: values.ownerEmail
          });
          toast('Home created successfully');
          router.push("/serviceProvider/homeList");
          revalidatePath('/serviceProvider/homeList');
        } else {
          if (userdoesnotexits) {
            let response = await register({
              firstName: "home", lastName: 'owner', email: values.ownerEmail, password: values.password, role: "admin", setCokkies: false
            });

            if (response.isOk) {
              let response = await createaHome({
                homeName: values.homeName,
                properties: properties,
                ownerEmail: values.ownerEmail
              });
              toast('Home created successfully');
              revalidatePath('/serviceProvider/homeList');
            } else {
              toast(response.message);
            }
          }
          setUserdoesnotexits(true);
          toast('The user does not exist, you must provide a password for the user');
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
      setIsLoading(false);
    },
  });

  const handleAddProperty = () => {
    setTempProperties([...tempProperties, { key: `Property ${count}`, value: '' }]);
    setCount(count + 1);
  };

  const handleRemoveProperty = (key) => {
    setTempProperties(tempProperties.filter(property => property.key !== key));
    setCount(tempProperties.length - 1);
  };

  const handlePropertyChange = (index, value, field) => {
    let temp = [...tempProperties];
    if (field === "key") {
      temp[index].key = value;
    }
    if (field === "value") {
      temp[index].value = value;
    }
    setTempProperties(temp);
    formik.setFieldValue('properties', temp.reduce((acc, cur) => {
      acc[cur.key] = cur.value;
      return acc;
    }, {}));
  };

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 mb-10 w-full max-w-[500px] mx-auto">
      <div className="mx-auto w-full flex flex-col gap-5 px-10 ">
        <div className="grid w-full max-w-md items-center gap-1.5">
          <InputField
            label="Home Name"
            type="text"
            id="homeName"
            placeholder="Home Name"
            name="homeName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.homeName}
            error={formik.touched.homeName && formik.errors.homeName}
          />
        </div>
        <div className="grid w-full max-w-md items-center gap-1.5">
          <InputField
            label="Owner Email"
            type="email"
            id="ownerEmail"
            placeholder="Owner Email"
            name="ownerEmail"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.ownerEmail}
            error={formik.touched.ownerEmail && formik.errors.ownerEmail}
          />
        </div>
        {userdoesnotexits && <div className="grid w-full max-w-md items-center gap-1.5">
          <InputField
            label="Create Owner Password"
            type="password"
            id="password"
            placeholder="Create Owner Password"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
            error={formik.touched.password && formik.errors.password}
          />
        </div>}
        <div className="grid w-full max-w-md items-center gap-1.5">
          <p className="text-lg font-semibold">Properties:</p>
          {tempProperties.map(({ key, value }, index) => (
            <div key={index} className="flex gap-2 justify-center items-end">
              <InputField
                type="text"
                placeholder="Key"
                value={key}
                onChange={(e) => handlePropertyChange(index, e.target.value, "key")}
                error={formik.errors.properties && formik.errors.properties[key]}
              />
              <InputField
                type="text"
                placeholder="Value"
                value={value}
                onChange={(e) => handlePropertyChange(index, e.target.value, "value")}
                error={formik.errors.properties && formik.errors.properties[key]}
              />
              <MyButton variant="destructive" onClick={() => handleRemoveProperty(key)}>
                Remove
              </MyButton>
            </div>
          ))}
          <MyButton type='button' variant="secondary" onClick={handleAddProperty}>
            Add Property
          </MyButton>
        </div>
        <MyButton disabled={isLoading} type="submit" className="min-[320px]:w-[246px] self-center">
          {isLoading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && "Create Home"}
        </MyButton>
      </div>
    </form>
  );
}
