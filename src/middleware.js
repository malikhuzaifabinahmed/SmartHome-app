import { getCooKies } from '@/actions/cookiesManger';
import jwt from "jsonwebtoken"
import { NextResponse } from 'next/server';
 
export async function middleware(request) {

    if (request.cookies.has("refreshToken" )) {
      
        }
        
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
 
export const config = {
  matcher: '/',
}