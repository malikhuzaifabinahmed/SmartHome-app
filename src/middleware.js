import { getCooKies } from '@/actions/cookiesManger';
import jwt from "jsonwebtoken"
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware(request) {


  let path = request.nextUrl.pathname;
  console.log(path)


  if (request.cookies.has("refreshToken")) {

    let refreshToken = request.cookies.get("refreshToken")
    let userData = jwt.decode(refreshToken.value);
    if (userData.role === 'service_provider') {
      console.log("Inside access")
      if (path == '/serviceProvider') {
        return NextResponse.next()
      }
      else {
        return NextResponse.redirect(new URL('/serviceProvider', request.url))

      }
    } else {
      console.log("Inside no acces")
      if (path == '/dashboard') {
        return NextResponse.next()
      }
      else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

  }
  else {
    return NextResponse.redirect(new URL('/login', request.url))
  }


}

export const config = {
  matcher: ['/', '/dashboard', '/serviceProvider'],
}