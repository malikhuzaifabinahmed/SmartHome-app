import { assignDeviceToHome, getAllDevicesList, getAllHomeData, getUserData, getUserHome, updateDevice } from "@/actions/Authenticate";
import AssignDeviceToUser from "@/components/AssignDeviceToUser";
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
    let userHomes;
    let requestorData;
    try {
        requestorData = await getUserData({ email })
        userHomes = await getUserHome();

    } catch (error) {
        console.log(error)
    }


    if (userHomes.isOk) {
        let currentHome = userHomes.response.admin.filter(home => home.homeId == homeId)
        currentHome = currentHome[0];
        let user = requestorData.user;

        let fileteredDeviceList = [];
        if (user.role == "normal_user") {



            if (user.accessList.normalUser[`${homeId}`]) {
                fileteredDeviceList = currentHome.devices.filter(device => {

                    return !(user.accessList.normalUser[`${homeId}`].some(deviceId => {
                        console.log('deviceId', deviceId, 'device.deviceId ', device.deviceId)
                        return (device.deviceId === deviceId)
                    }))
                }

                )

            } else {
                fileteredDeviceList = currentHome.devices
            }
        }
        if (user.role == "service_requestor") {
            console.log('currentHome.devices', currentHome.devices)

            if (user.accessList.serviceRequestors[`${homeId}`]) {
                fileteredDeviceList = currentHome.devices.filter(device => {

                    return !(user.accessList.serviceRequestors[`${homeId}`].some(deviceId => {
                        console.log('deviceId', deviceId, 'device.deviceId ', device.deviceId)
                        return (device.deviceId === deviceId)
                    }))
                }

                )



            } else {
                fileteredDeviceList = currentHome.devices
            }
        }



        // console.log('requestorData', requestorData.user.accessList.serviceRequestors)
        // console.log('userHomes', userHomes)
        // console.log('currentHome', currentHome)

        // console.log("fileteredDeviceList", fileteredDeviceList)

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
                    {fileteredDeviceList.map(device => (




                        <TableRow key={device.deviceId}>
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
                                <AssignDeviceToUser deviceId={device.deviceId} homeId={homeId} email={user.email} />
                            </TableCell>
                        </TableRow>


                    ))}

                </TableBody>
            </Table>

            <div className=" w-full text-center font-fraunces_bold text-xl"> Assigned Devices </div>
            <Table  >
                <TableCaption>A list of Devices Assigned to user by home Admin </TableCaption>
                <TableHeader>
                    <TableRow >
                        <TableHead className="w-[100px]  whitespace-nowrap">Device Name</TableHead>
                        <TableHead className="w-full">Properties</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {user.role == "service_requestor" ? Object.keys(user.accessList.serviceRequestors).map(homeId => {
                        let devices = currentHome.devices.filter(device =>



                            user.accessList.serviceRequestors[homeId].some(deviceId => {

                                console.log('deviceId', deviceId)
                                return device.deviceId === deviceId
                            })
                        )




                        return (



                            <>{
                                devices.map(device => <TableRow>
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

                                </TableRow>)
                            }</>



                        )
                    }) :
                        user.role == "normal_user" ? Object.keys(user.accessList.normalUser).map(homeId => {

                            let devices = currentHome.devices.filter(device =>



                                user.accessList.normalUser[homeId].some(deviceId => {

                                    console.log('deviceId', deviceId)
                                    return device.deviceId === deviceId
                                })
                            )

                            return (



                                <>{
                                    devices.map(device => <TableRow>
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

                                    </TableRow>)
                                }</>



                            )



                        }) : ""
                    }

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