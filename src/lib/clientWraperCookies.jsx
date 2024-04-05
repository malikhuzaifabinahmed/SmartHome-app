'use server'

import { setCookies } from "@/actions/cookiesManger"

export  default async function setCookiesCC({ name, value, ...props }){
setCookies({ name, value, ...props })

}