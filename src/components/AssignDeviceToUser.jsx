"use client"
import { assignDevicesToUser } from "@/actions/Authenticate";
import MyButton from "./ui/MyButton";

export default function AssignDeviceToUser({ homeId, deviceId, email }) {

    // params are correct here
    console.log('deviceId', deviceId, 'homeId', homeId, 'email', email)


    return <MyButton onClick={
        async () => {
            await assignDevicesToUser({ email, homeId, deviceId })
        }
    } >
        Assign device to user
    </MyButton>
}