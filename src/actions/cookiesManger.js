'use server'
import { cookies } from 'next/headers'

export async function setCookies({ name, value, ...props }) {
    "use server"
    console.log({ ...props })
    cookies().set({
        name: name,
        value: value,
        httpOnly: true,
        path: '/',
    })
    return true;
}
export async function getCooKies({ name

}) {
    return cookies().get(name);
}
export async function deleteCookies({ name }) {
    cookies().delete(name)
    return true;
}