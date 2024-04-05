'use client'

import { authenticateUser } from "@/actions/Authenticate";
import { getCooKies, setCookies } from "@/actions/cookiesManger";
import { useEffect } from "react";

export default function AccessManager(){
  useEffect(()=>{async  function check (){let refreshToken = await getCooKies({ name: "refreshToken" });
    if (refreshToken) {
        let accessToken = await getCooKies({ name: "accessToken" });
        if (!accessToken) {
            let userData = await getCooKies({ name: "userData" });
            if (!userData) {
                //get user data using refresh token

            }
            else {
                console.log(userData.value)
                let jsonUserData =  await JSON.parse(userData.value);
                console.log(jsonUserData)
                let response = await authenticateUser({ email: jsonUserData.email });
                console.log(response)
                setCookies({name:"accessToken", value:response.accessToken});

            }


        }
    }}
    check()})
return ;
}