import { deleteCookies, getCooKies } from '@/actions/cookiesManger';
import jwt from "jsonwebtoken"
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware(request) {


  let path = request.nextUrl.pathname;
  console.log(path)


  if (request.cookies.has("refreshToken")) {
    console.log('refresh cookies found')
    let refreshToken = request.cookies.get("refreshToken")

    if (refreshToken && refreshToken.value !== '') {
      let userData = jwt.decode(refreshToken.value);

      console.log('refresh cookies found but courupted')
      if (userData.role === 'service_provider') {
        if (path == '/serviceProvider') {
          return NextResponse.next()
        }
        else {
          return NextResponse.redirect(new URL('/serviceProvider', request.url))

        }
      } else {
        if (path == '/dashboard') {
          return NextResponse.next()
        }
        else {

          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    }
    else {
      console.log('Else refresh cookies found but courupted')
      const response = NextResponse.next();
      // await request.cookies.delete("refreshToken");
      // Delete specific cookies
      response.cookies.delete("refreshToken");
      return response
    }



  }
  else {
    console.log('No refresh cookies found')
    return NextResponse.redirect(new URL('/login', request.url))

  }


}

export const config = {
  matcher: ['/', '/dashboard', '/serviceProvider'],
}