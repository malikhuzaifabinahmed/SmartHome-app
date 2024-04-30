import { getAllDevicesList, getAllHomeList, updateDevice } from "@/actions/Authenticate";
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
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { object } from "yup";

export default async function Page() {

    let response;
    try {
        response = await getAllHomeList()

        console.log(response)
    } catch (error) {
        console.log(error)
    }

    if (response.isOk) {
        return <div className=' overflow-hidden'>
            <Table  >
                <TableCaption>A list of Devices created by the Service Provider</TableCaption>
                <TableHeader>
                    <TableRow >
                        <TableHead className="w-[100px]  whitespace-nowrap">Home Name</TableHead>
                        <TableHead className="w-[100px]  whitespace-nowrap">Owner Name</TableHead>

                        <TableHead className="w-[100px]  whitespace-nowrap">Owner Email</TableHead>

                        <TableHead className="w-full">Properties</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {response.homeList.map(device => (




                        <TableRow>
                            <TableCell className="font-medium ">{device.homeName}</TableCell>

                            <TableCell className="font-medium ">{device.owner.firstName + " " + device.owner.lastName}</TableCell>
                            <TableCell className="font-medium ">{device.owner.email}</TableCell>

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
                                <Link href={`/serviceProvider/homeList/assignDevices?homeId=${device.homeId}`}>
                                    <MyButton type='submit' variant='icon'> Assign divices</MyButton>
                                </Link>

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