
import Loading from "@/app/loading";
import HomePageWelcome from "../../../components/HomePageWelcome";
import { Suspense } from "react";
export default async function Page() {
  return <Suspense fallback={<Loading />}>
    <div className="p-5">
      <Renderer />
    </div>

  </Suspense >
}
async function Renderer() {


  return <div>
    <HomePageWelcome />
  </div>


}
