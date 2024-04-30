"use client"
import { assignDevicesToUser } from "@/actions/Authenticate";
import MyButton from "./ui/MyButton";

export default function AssignDeviceToHome({ homeId, deviceId, email }) {
    return <MyButton onClick={
        async () => {
            await assignDevicesToUser({ email, homeId, deviceId })
        }
    } >
        Assign device to user
    </MyButton>
}