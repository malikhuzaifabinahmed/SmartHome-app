'use client'

import { authenticateUser } from "@/actions/Authenticate";
import { getCooKies, setCookies } from "@/actions/cookiesManger";
import { useEffect } from "react";
import jwt from "jsonwebtoken"

export default function AccessManager(){
  useEffect(()=>{async  function check (){
  let refreshToken = await getCooKies({ name: "refreshToken" });
  if (refreshToken && refreshToken.value != '') {
      let accessToken = await getCooKies({ name: "accessToken" });
      if (!accessToken || accessToken == '') {
          let userData = await getCooKies({ name: "userData" });
          if (!userData || userData.value =='') {
                //get user data using refresh token

            }
            else {
               


                console.log("userdata",userData)
                let jsonUserData =  jwt.decode(refreshToken.value);
               let response = await authenticateUser({ email: jsonUserData.email });
                await setCookies({name:"accessToken", value:response.accessToken});

            }
        

        }
    }}
    check()})
return ;
}

