
'use client'
import { sendRequest } from "@/actions/Authenticate";
import MyButton from "./ui/MyButton";
import { revalidatePath } from "next/cache";

export default function RequestButton({ homeId, deviceId }) {

    return <MyButton onClick={

        async () => {
            await sendRequest({
                homeId,
                deviceId
            })
            // revalidatePath('/dashboard')
        }
    } variant='icon'> Request Access</MyButton>

}