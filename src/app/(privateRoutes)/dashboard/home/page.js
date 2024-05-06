import { getAllHomeList, getUserData, getUserHome } from "@/actions/Authenticate"
import { getCooKies } from "@/actions/cookiesManger";
import jwt from "jsonwebtoken"
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
import Link from "next/link";
import RequestButton from "@/components/RequestAccess";
import { objectsPresentInAOnly } from "@/lib/utils";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { object } from "yup";
export default async function Page() {
    return <Suspense fallback={<Loading />}>
        <div className="p-5">
            <Renderer />
        </div>

    </Suspense >
}
async function Renderer() {
    let response;

    let Homes;
    let refreshToken = await getCooKies({ name: "refreshToken" });
    let userData;
    let fullUserData

    if (refreshToken && refreshToken.value) {
        userData = jwt.decode(refreshToken.value);
        console.log('userData', userData)
        try {
            response = await getUserHome();
            Homes = await getAllHomeList();
            fullUserData = await getUserData({ email: userData.email });


        } catch (error) {

        }
    }
    else {

    }



    async function renderHome({ myhome }) {

        console.log('myhome', myhome)

        return (<div>
            <div className=" text-[18px]  capitalize  font-light  font-rubik ">
                You are {userData.role == "service_requestor" ?
                    "Service Requestor" : userData.role == "normal_user" ? "Normal User" : "admin  "} of the following Home
            </div>
            <div className=" text-[64px] uppercase font-fraunces_600"> {myhome.homeName}</div>


            <Table  >
                <TableCaption>A list of Devices of home for user with role {userData.role == "service_requestor" ?
                    "Service Requestor" : userData.role == "normal_user" ? "Normal User" : "admin  "}</TableCaption>
                <TableHeader>
                    <TableRow >
                        <TableHead className="w-[100px]  whitespace-nowrap">Device Name</TableHead>
                        <TableHead className="w-full">Properties</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {myhome.devices.map(device => (




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
                                <Link href={`/dashboard/home/updateDevice?homeId=${myhome.homeId}&deviceId=${device.deviceId}`}>
                                    <MyButton type='submit' variant='icon'> Edit</MyButton>
                                </Link>
                            </TableCell>
                        </TableRow>


                    ))}

                </TableBody>
            </Table>
            {(myhome.requests.serviceRequestors.length !== 0 || myhome.requests.normalUser.length !== 0) && <h3 className=" text-[24px] font-sigmar_one font-bold"> Requests</h3>}
            {(myhome.requests.serviceRequestors.length !== 0 || myhome.requests.normalUser.length !== 0) && <Table  >
                <TableCaption>A list of Request made on the home </TableCaption>
                <TableHeader>
                    <TableRow >
                        <TableHead className="w-[200px]  whitespace-nowrap">Requestor Email</TableHead>

                        <TableHead className="w-[100px]  whitespace-nowrap">Requestor role</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {myhome.requests.normalUser.map(normalUser => (




                        <TableRow>
                            <TableCell className="font-medium ">{normalUser}</TableCell>

                            <TableCell className="w-full   overflow-x-scroll ">

                                Normal User
                            </TableCell>
                            <TableCell>
                                <Link href={`/dashboard/home/assignDevices?homeId=${myhome.homeId}&email=${normalUser}`}>
                                    <MyButton type='submit' variant='icon'> Give Access</MyButton>
                                </Link>
                            </TableCell>
                        </TableRow>


                    ))}

                </TableBody>
                <TableBody>
                    {myhome.requests.serviceRequestors.map(reqeustor => (




                        <TableRow>
                            <TableCell className="font-medium ">{reqeustor}</TableCell>

                            <TableCell className="w-full   overflow-x-scroll ">

                                Service requestor
                            </TableCell>
                            <TableCell>
                                <Link href={`/dashboard/home/assignDevices?homeId=${myhome.homeId}&email=${reqeustor}`}>
                                    <MyButton type='submit' variant='icon'> Give Access</MyButton>
                                </Link>
                            </TableCell>
                        </TableRow>


                    ))}

                </TableBody>
            </Table>}

        </div>);
    }

    //For the role of admin
    if (response && response.isOk && response.response.admin && response.response.admin.length !== 0) {
        let adminhome = response.response.admin

        return <div>{adminhome.map(home => renderHome({ myhome: home }))}</div>
    }



    else if (userData.role == "normal_user" || userData.role == 'service_requestor') {
        let filteredHome = Homes?.homeList;
        let availableHome = [];
        let requestedHome;

        if (Object.keys(fullUserData.user.accessList.normalUser).length !== 0) {
            availableHome = response.response.normalUser


        }
        if (Object.keys(fullUserData.user.accessList.serviceRequestors).length !== 0) {
            availableHome = response.response.serviceRequestors



        }
        if (fullUserData.user.requests.normalUser.length !== 0) {
            requestedHome
                = Homes.homeList.filter(home =>

                    fullUserData.user.requests.normalUser.some(homeId => home.homeId == homeId)
                )
            requestedHome = requestedHome[0]


        }
        if (fullUserData.user.requests.serviceRequestors.length !== 0) {
            requestedHome = Homes.homeList.filter(home =>

                fullUserData.user.requests.serviceRequestors.some(homeId => home.homeId == homeId)
            )
            requestedHome = requestedHome[0]



        }

        console.log('Homes', Homes)
        console.log('response', response.response.serviceRequestors)
        console.log("availableHome", availableHome)

        console.log("requestedHome", requestedHome)
        // console.log("fittered", filteredHome)
        console.log("fullUserData.user.requests.serviceRequestors", fullUserData.user)
        // console.log("fullUserData.user.requests.normalUser", fullUserData.user.requests.normalUser)

        if (availableHome.length == 0 && !requestedHome) {
            return <div>

                <div>
                    You Dont have acces to home following is the list of homes
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
                            {Homes.homeList.map(device => (




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
                                        <RequestButton homeId={device.homeId} deviceId={"12"} />

                                    </TableCell>
                                </TableRow>


                            ))}

                        </TableBody>
                    </Table>

                </div>

            </div>
        }
        else
            if (availableHome.length !== 0) {
                console.log(availableHome)
                return <>{availableHome.map(home => renderHome({ myhome: home }))} </>

            }

        if (requestedHome) {
            return <div>

                You request of is pending for the aproval for the home Name {requestedHome.homeName}
            </div>
        }
    }



}
