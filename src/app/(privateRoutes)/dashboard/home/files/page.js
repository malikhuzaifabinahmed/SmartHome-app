import { getHomeDevice } from "@/actions/Authenticate";
import DeviceForm from "@/components/Forms/DeviceForm";
import UpdateDeviceForm from "@/components/Forms/UpdateHomeDevice";
import UploadData from "@/components/UpdloadData";

export default async function Page({ searchParams }) {
    console.log(searchParams)
    if (searchParams.homeId && searchParams.deviceId) {
        let response = await getHomeDevice({ deviceId: searchParams.deviceId, homeId: searchParams.homeId })
        console.log(device);
        if (response.isOk) {
            var device = response.device
        }




        return <div className=" px-20">

            <h2 className="text-[24px] font-rubik ">
                Device Name : <span className="text-[24px] font-normal "> {device.deviceName}</span>
            </h2>
            <p className="text-[18px] mt-3 font-rubik ">
                Device Id : <span className=" font-normal text-[14px]"> {device.deviceId}</span>
            </p>
            <div className="mt-10 flex flex-wrap gap-5 w-full max-w-[900px]">

                {Object.keys(device.properties).map((key) => (<p className="text-[18px]  capitalize font-rubik ">
                    {key} : <span style={{ textTransform: 'none' }} className=" font-normal text-[14px]"> {device.properties[`${key}`]}</span>
                </p>))}

            </div>
            <div className="mt-10 flex flex-wrap gap-5 w-full max-w-[1400px]">

                {device.files && device.files.map(({ IpfsHash, Timestamp }) => (<p className="text-[18px]  capitalize font-rubik ">
                    {Timestamp} : <span style={{ textTransform: 'none' }} className=" font-normal text-[14px]"> {IpfsHash}</span>
                </p>))}

            </div>



        </div>


    }
}