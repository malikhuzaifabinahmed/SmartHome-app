'use client'

import { useEffect, useState } from "react";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import MyButton from "../ui/MyButton";
import { RotateCw } from "lucide-react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCooKies } from "@/actions/cookiesManger";
import { createADevice } from "@/actions/Authenticate";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

export default function DeviceForm({ device, home }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0)
  const [tempProperties, setTempProperties] = useState([])
  const initialValues = {

    deviceName: "",
    properties: {},
  };

  const validationSchema = Yup.object({
    deviceName: Yup.string().required("emptyField"),
  });


  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      // Creating device object
      let properties = {};
      tempProperties.forEach(({ key, value }) => {
        properties[`${key}`] = value
      })


      try {

        let response = await createADevice({

          deviceName: values.deviceName,
          properties: properties,
        })
        console.log(response)
        toast('Device created succesfuly')
        router.push('/serviceProvider/deviceList')
        revalidatePath('/serviceProvider/deviceList')
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }

      setIsLoading(false);
      // router.push("/dashb");
    },
  });



  const handleAddProperty = () => {
    setTempProperties([...tempProperties, { key: `Property ${count}`, value: '' }]);
    setCount(count + 1);
  };
  // TODO need to update property to object  ot array
  const handleRemoveProperty = (key) => {

    setTempProperties(tempProperties.filter(property => property.key !== key));
    setCount(tempProperties.length - 1); // Update count based on the length of the filtered array
  };


  const handlePropertyChange = (index, value, field) => {
    let temp = [...tempProperties];
    console.log(index, value, field)
    if (field === "key") {
      temp[index].key = value
    }
    if (field === "value") {
      temp[index].value = value

    }
    console.log("temp", temp)
    setTempProperties(temp)

  };
  console.log(tempProperties)
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 mb-10 w-full max-w-[500px] mx-auto">
      <div className="mx-auto w-full flex flex-col gap-5 px-10 ">

        <div className="grid w-full max-w-md items-center gap-1.5">
          <InputField
            label="Device Name"
            type="text"
            id="deviceName"
            placeholder="Device Name"
            name="deviceName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.deviceName}
            error={formik.touched.deviceName && formik.errors.deviceName}
          />
        </div>
        <div className="grid w-full max-w-md items-center gap-1.5">
          <p className="text-lg font-semibold">Properties:</p>
          {tempProperties.map(({ key, value }, index) => (
            <div key={index} className="flex gap-2 justify-center items-end">
              <InputField
                type="text"
                placeholder="Key"
                value={key}
                onChange={(e) => handlePropertyChange(index, e.target.value, "key")}
              />
              <InputField
                type="text"
                placeholder="Value"
                value={value}
                onChange={(e) => handlePropertyChange(index, e.target.value, "value")}
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

        <MyButton type="submit" className="min-[320px]:w-[246px] self-center">
          {isLoading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && "Create Device"}
        </MyButton>

      </div>
    </form>
  );
}
