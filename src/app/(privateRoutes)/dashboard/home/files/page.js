import { getHomeDevice } from "@/actions/Authenticate";
import DownloadFile from "@/components/DowloadFile";
import DeviceForm from "@/components/Forms/DeviceForm";
import UpdateDeviceForm from "@/components/Forms/UpdateHomeDevice";
import UploadData from "@/components/UpdloadData";
import MyButton from "@/components/ui/MyButton";
import { Download } from "lucide-react";

export default async function Page({ searchParams }) {
    console.log(searchParams)

    function isoToCustomDate(isoDateString) {
        const MM = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const formattedDate = isoDateString.replace(
            /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/,
            function (_, year, month, day, hour, minute) {
                const monthName = MM[parseInt(month, 10) - 1];
                const formattedHour = (parseInt(hour, 10) % 12).toString().padStart(2, '0');
                const amPm = parseInt(hour, 10) >= 12 ? 'PM' : 'AM';
                return `${monthName} ${parseInt(day, 10)}, ${year} - ${formattedHour}:${minute} ${amPm}`;
            }
        );

        return formattedDate;
    }



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
            <div className="mt-10 flex flex-wrap gap-10 w-full max-w-[1400px]">

                {device.files && device.files.map(({ IpfsHash, Timestamp }) => (<div className="">

                    <div className=" flex justify-between items-center mb-5 ">
                        <h2 className=" ">{isoToCustomDate(Timestamp)} </h2>
                        <DownloadFile CID={IpfsHash} />
                    </div>
                    <p className="text-[18px]  capitalize font-rubik ">
                        Cammand Id : <span style={{ textTransform: 'none' }} className=" font-normal text-[14px]"> {IpfsHash}</span>

                    </p>

                </div>))}

            </div>



        </div>


    }
}