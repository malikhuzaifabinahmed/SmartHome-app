
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
import { updateDevice, updateDeviceToHome } from "@/actions/Authenticate"; // Assuming you have an update device action
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

export default function UpdateDeviceForm({ device, homeId }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [tempProperties, setTempProperties] = useState(Object.keys(device.properties).map(key => ({ key, value: device.properties[`${key}`] })) || []);
    console.log(device)
    const initialValues = {
        deviceName: device.deviceName || "", // Populate device name if available
        properties: device.properties || {}, // Populate properties if available
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
            });
            let response;
            try {
                response = await updateDeviceToHome({
                    deviceId: device.deviceId,
                    homeId: homeId, // Assuming device id is available
                    deviceName: values.deviceName,
                    properties: properties,
                });
                if (response.isOk) {
                    toast('Device updated successfully');

                    setIsLoading(false);
                } else {
                    throw new Error(response.message)
                }

            } catch (e) {
                toast(e)
                setIsLoading(false);
                // Handle error
            }

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
    };

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
                    {!isLoading && "Update Device"}
                </MyButton>

            </div>
        </form>
    );
}
