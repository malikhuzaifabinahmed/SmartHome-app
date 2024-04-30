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
  let userData = jwt.decode(refreshToken.value);
  let fullUserData
  console.log(userData)
  try {
    response = await getUserHome();
    Homes = await getAllHomeList();
    fullUserData = await getUserData({ email: userData.email });
    console.log(response);
    console.log(fullUserData);

  } catch (error) {

  }


  async function renderHome({ myhome }) {

    console.log('myhome', myhome)

    return (<div>
      <div>
        You are {userData.role == "service_requestor" ?
          "Service Requestor" : userData.role == "normal_user" ? "Normal User" : "admin  "} of the following Home
      </div>
      <div className=" text-[64px] uppercase"> {myhome.homeName}</div>


      <Table  >
        <TableCaption>A list of Devices created of user with role {userData.role == "service_requestor" ?
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
    </div>);
  }

  //For the role of admin
  if (response && response.isOk && Object.keys(response.response).length !== 0) {
    let adminhome = response.response.admin
    console.log("adminhomde", adminhome)

    return <div>{adminhome.map(home => renderHome({ myhome: home }))}</div>
  }



  else if (userData.role == "normal_user" || userData.role == 'service_requestor') {
    let filteredHome = Homes?.homeList;
    let availableHome;
    let requestedHome;

    console.log(fullUserData.user)
    if (fullUserData.user.accessList.normalUser.length !== 0) {
      availableHome = filteredHome = Homes.homeList.filter(home =>

        fullUserData.user.accessList.normalUser.some(homeId => home.homeId == homeId)
      )
      availableHome = availableHome[0]


    }
    if (fullUserData.user.accessList.serviceRequestors.length !== 0) {
      availableHome = filteredHome = Homes.homeList.filter(home =>

        fullUserData.user.accessList.serviceRequestors.some(homeId => home.homeId == homeId)
      )
      availableHome = availableHome[0]



    }
    if (fullUserData.user.requests.normalUser.length !== 0) {
      requestedHome
        = filteredHome = Homes.homeList.filter(home =>

          fullUserData.user.requests.normalUser.some(homeId => home.homeId == homeId)
        )
      requestedHome = requestedHome[0]


    }
    if (fullUserData.user.requests.serviceRequestors.length !== 0) {
      requestedHome = filteredHome = Homes.homeList.filter(home =>

        fullUserData.user.requests.serviceRequestors.some(homeId => home.homeId == homeId)
      )
      requestedHome = requestedHome[0]



    }



    if (!availableHome && !requestedHome) {
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
              {filteredHome.map(device => (




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
      if (availableHome) {
        return renderHome(availableHome)
      }
    if (requestedHome) {
      return <div>

        You request of is pending for the aproval for the home Name {requestedHome.homeName}
      </div>
    }
  }



}
