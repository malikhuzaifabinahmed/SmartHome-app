'use server'
import { cookies } from 'next/headers'

export async function setCookies({ name, value, ...props }) {
    console.log({ ...props })
    await cookies().set({
        name: name,
        value: value,
        httpOnly: true,
        path: '/',
    })
    return true;
}
export async function getCooKies({ name

}) {
    return await cookies().get(name);
}
export async function deleteCookies({ name }) {
    cookies().delete(name)
    return true;
}