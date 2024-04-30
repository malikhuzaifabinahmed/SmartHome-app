import { assignDeviceToHome, getAllDevicesList, getAllHomeData, updateDevice } from "@/actions/Authenticate";
import AssignButton from "@/components/AsssignButton";
import MyButton from "@/components/ui/MyButton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { object } from "yup";

export default async function Page({ searchParams }) {
    let homeId = searchParams.homeId;

    let response;
    let homeResponse;
    try {
        response = await getAllDevicesList()
        homeResponse = await getAllHomeData({ homeId })
        console.log(homeResponse)
    } catch (error) {
        console.log(error)
    }

    const sendAssign = async ({ deviceId, homeId }) => {
        await assignDeviceToHome({ deviceId: deviceId, homeId })
        return;
    }
    if (response.isOk && homeResponse.isOk) {

        let fileteredList = response.deviceList.filter(
            value => {
                console.log(homeResponse.home.devices.includes(value))
                return !homeResponse.home.devices.some(valueB => value.deviceId === valueB.deviceId)
            }
        )
        return <div className=' overflow-hidden'>
            <Table  >
                <TableCaption>A list of Devices created by the Service Provider</TableCaption>
                <TableHeader>
                    <TableRow >
                        <TableHead className="w-[100px]  whitespace-nowrap">Device Name</TableHead>
                        <TableHead className="w-full">Properties</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fileteredList.map(device => (




                        <TableRow>
                            <TableCell className="font-medium ">{device.deviceName}</TableCell>

                            <TableCell className="w-full   overflow-x-scroll ">

                                <Table className="w-fit whitespace-nowrap" >
                                    <TableHeader>
                                        <TableRow>
                                            {Object.keys(device.properties).map(property => (

                                                <TableHead > {property} </TableHead>


                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            {Object.keys(device.properties).map(property => (

                                                <TableCell > {device.properties[property]} </TableCell>


                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableCell>
                            <TableCell>
                                <AssignButton deviceId={device.deviceId} homeId={homeId} />
                            </TableCell>
                        </TableRow>


                    ))}

                </TableBody>
            </Table>

            <div className=" w-full text-center font-fraunces_bold text-xl"> Assigned Devices </div>
            <Table  >
                <TableCaption>A list of Devices Assigned by the Service Provider</TableCaption>
                <TableHeader>
                    <TableRow >
                        <TableHead className="w-[100px]  whitespace-nowrap">Device Name</TableHead>
                        <TableHead className="w-full">Properties</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {homeResponse.home.devices.map(device => (




                        <TableRow>
                            <TableCell className="font-medium ">{device.deviceName}</TableCell>

                            <TableCell className="w-full   overflow-x-scroll ">

                                <Table className="w-fit whitespace-nowrap" >
                                    <TableHeader>
                                        <TableRow>
                                            {Object.keys(device.properties).map(property => (

                                                <TableHead > {property} </TableHead>


                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            {Object.keys(device.properties).map(property => (

                                                <TableCell > {device.properties[property]} </TableCell>


                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableCell>

                        </TableRow>


                    ))}

                </TableBody>
            </Table>


        </div>
    }
    else {
        return <div>
            No devices found
        </div>
    }
}