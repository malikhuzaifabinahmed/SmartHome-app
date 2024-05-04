import { getAllHomeList, getUserData, getUserHome } from "@/actions/Authenticate"
import { getCooKies } from "@/actions/cookiesManger";
import jwt from "jsonwebtoken"
import MyButton from "@/components/ui/MyButton";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import RequestButton from "@/components/RequestAccess";
import { objectsPresentInAOnly } from "@/lib/utils";
import { Suspense } from "react";
import Loading from "@/app/loading";
export default async function Page() {
  return <Suspense fallback={<Loading />}>
    <div className="p-5">
      <Renderer />
    </div>

  </Suspense >
}
async function Renderer() {


  return <div>
    Welcome to dashboard
  </div>


}
