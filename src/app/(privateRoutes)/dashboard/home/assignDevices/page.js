import { assignDeviceToHome, getAllDevicesList, getAllHomeData, getUserData, getUserHome, updateDevice } from "@/actions/Authenticate";
import AssignDeviceToHome from "@/components/AssignDeviceToHome";
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
    let email = searchParams.email
    console.log(email, homeId)
    let response;
    let homeResponse;
    try {
        response = await getUserData({ email })
        homeResponse = await getUserHome();
        console.log(homeResponse)
        console.log(response)
    } catch (error) {
        console.log(error)
    }


    if (homeResponse.isOk) {
        let currentHome;
        let user = response.user;

        let fileteredList = [];
        if (user.role == "normal_user") {

            currentHome = homeResponse.response.admin.filter(home => home.homeId == homeId)
            currentHome = currentHome[0];
            console.log(currentHome)

            if (user.accessList.normalUser[`${homeId}`]) {
                fileteredList = currentHome.devices.filter(device =>
                    user.accessList.normalUser[`${homeId}`].some(deviceId => device.deviceId !== deviceId)

                )



            }
        }
        if (user.role == "service_requestor") {

            currentHome = homeResponse.response.admin.filter(home => home.homeId == homeId)
            currentHome = currentHome[0];
            console.log(currentHome)

            if (user.accessList.serviceRequestors[`${homeId}`]) {
                fileteredList = currentHome.devices.filter(device =>
                    user.accessList.serviceRequestors[`${homeId}`].some(deviceId => device.deviceId !== deviceId)

                )



            } else {
                fileteredList = currentHome.devices
            }
        }
        console.log(fileteredList)

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
                                <AssignDeviceToHome deviceId={device.deviceId} homeId={homeId} email={user.email} />
                            </TableCell>
                        </TableRow>


                    ))}

                </TableBody>
            </Table>

            {/* <div className=" w-full text-center font-fraunces_bold text-xl"> Assigned Devices </div> */}
            {/* <Table  >
                <TableCaption>A list of Devices Assigned by the Service Provider</TableCaption>
                <TableHeader>
                    <TableRow >
                        <TableHead className="w-[100px]  whitespace-nowrap">Device Name</TableHead>
                        <TableHead className="w-full">Properties</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {user.role == "service_requestor" ? object.keys(user.accessList.serviceRequestors).map(device => (




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


                    )) :
                        user.role == "normal_user" ? object.keys(user.accessList.serviceRequestors).map(houseId => (




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


                        )) : ""
                    }

                </TableBody>
            </Table> */}


        </div>
    }
    else {
        return <div>
            No devices found
        </div>
    }
}