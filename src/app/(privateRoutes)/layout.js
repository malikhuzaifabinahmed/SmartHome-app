
import { getCooKies } from "@/actions/cookiesManger";

import { redirect } from "next/navigation";
import jwt from "jsonwebtoken"
import { authenticateUser } from "@/actions/Authenticate";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import AccessManager from "@/components/AccessManger";
export default async function layout({ request, children }) {
    let refreshToken = await getCooKies({ name: "refreshToken" });
    let accessToken = await getCooKies({ name: 'accessToken' })
    if (refreshToken && refreshToken.value != '') {
        if (!accessToken || accessToken?.value === '') {
            console.log('no access value')
            return <AccessManager />

        }

        return <>
            <AccessManager />
            {children}</>

    }
    else {
        redirect('/login')
    }

}