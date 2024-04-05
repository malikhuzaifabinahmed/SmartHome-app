
"use server"
import { getCooKies } from "@/actions/cookiesManger";
import { authenticateUser } from "@/actions/serverAuthenticatel";

export default async function layout({ children }) {
    let refreshToken = await getCooKies({ name: "refreshToken" });
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
                console.log("response",response)
                // setCookies({name:"accessToken", value:response.accessToken});

            }


        }
        

        return <>
            {children}</>

    }

}