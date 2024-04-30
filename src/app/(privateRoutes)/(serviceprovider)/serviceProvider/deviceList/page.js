import { getAllDevicesList, updateDevice } from "@/actions/Authenticate";
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

export default async function Page() {

    let response;
    try {
        response = await getAllDevicesList()

        console.log(response)
    } catch (error) {
        console.log(error)
    }

 if(response.deviceList ){   return <div className=' overflow-hidden'>
        <Table  >
            <TableCaption>A list of Devices created by the Service Provider</TableCaption>
            <TableHeader>
                <TableRow >
                    <TableHead className="w-[100px]  whitespace-nowrap">Device Name</TableHead>
                    <TableHead className="w-full">Properties</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
                {response.deviceList.map(device => (




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
                            <form action={updateDevice(device.deviceId, device.deviceName, device.properties)}>
                                <MyButton type='submit' variant='icon'> Edit</MyButton>
                            </form>
                        </TableCell>
                    </TableRow>


                ))}

            </TableBody>
        </Table>


    </div>}
    else{
        return <div>
            No devices found
        </div>
    }
}