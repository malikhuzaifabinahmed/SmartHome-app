import { getHomeDevice } from "@/actions/Authenticate";
import DeviceForm from "@/components/Forms/DeviceForm";
import UpdateDeviceForm from "@/components/Forms/UpdateHomeDevice";

export default async function Page({ searchParams }) {
    console.log(searchParams)

    if (searchParams.homeId && searchParams.deviceId) {
        let device = await getHomeDevice({ deviceId: searchParams.deviceId, homeId: searchParams.homeId })
        console.log(device)

        // return <div> <UpdateDeviceForm home={searchParams.homeId} />   </div>
    }
}