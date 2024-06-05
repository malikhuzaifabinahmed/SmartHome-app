"use client"

import { assignDeviceToHome } from "@/actions/Authenticate"
import MyButton from "./ui/MyButton"
import { useAssignStore } from "@/stores/DeviceStore"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function AssignButton({ deviceId, homeId }) {
    const isDisabled = useAssignStore((state) => state.isDisabled)
    console.log(isDisabled)
    const setIsDisabled = useAssignStore((state) => state.setIsDisabled)
    const [isLoading, setIsloading] = useState(false);

    return <MyButton disabled={isDisabled} onClick={async () => {
        setIsloading(true)
        setIsDisabled(true)
        await assignDeviceToHome({ deviceId, homeId })
        setIsDisabled(false)
        setIsloading(false)

    }} type='submit' variant='icon' >{!isLoading && "Assign"}
        {isLoading && <Loader2 className=" size-4 animate-spin" />}
    </MyButton>

}   