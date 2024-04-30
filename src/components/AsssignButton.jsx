"use client"

import { assignDeviceToHome } from "@/actions/Authenticate"
import MyButton from "./ui/MyButton"

export default function AssignButton({ deviceId, homeId }) {
    return <MyButton onClick={() => assignDeviceToHome({ deviceId, homeId })} type='submit' variant='icon'> Assign</MyButton>

}   