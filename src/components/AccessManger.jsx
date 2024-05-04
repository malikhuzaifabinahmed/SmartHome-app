'use client'

import { authenticateUser } from "@/actions/Authenticate";
import { deleteCookies, getCooKies, setCookies } from "@/actions/cookiesManger";
import { useEffect } from "react";
import jwt from "jsonwebtoken"

export default function AccessManager() {
    useEffect(() => {
        async function check() {
            let refreshToken = await getCooKies({ name: "refreshToken" });
            if (refreshToken && refreshToken.value != '') {
                let accessToken = await getCooKies({ name: "accessToken" });
                if (!accessToken || accessToken.value == '') {

                    let jsonUserData = jwt.decode(refreshToken.value);
                    let response = await authenticateUser({ email: jsonUserData.email });
                    if (response.isOk) { await setCookies({ name: "accessToken", value: response.accessToken }); }
                    else {
                        await deleteCookies({ name: "refreshToken" })
                    }
                }
                else {
                    const decodedToken = jwt.decode(accessToken.value);
                    const currentTimeInSeconds = Date.now() / 1000;
                    if (decodedToken.exp < currentTimeInSeconds) {
                        await deleteCookies({ name: 'accessToken' })
                    }
                }
            }
        }
        check()
    }, [])
    return;
}

