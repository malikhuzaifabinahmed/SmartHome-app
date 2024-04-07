import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import MyButton from "@/components/ui/MyButton";
import { Button } from "@/components/ui/button";

import AddDevice from "@/components/AddDevice";
import { getCooKies } from "@/actions/cookiesManger";

export default async function Page() {
  console. log('some',await getCooKies({name:'some'}))

  return (
    <div className="pt-40  ">
      <MaxWidthWrapper>
        <div className="text-[2.5rem] font-fraunces_bold "> Smart Home</div>

        <div className=" border shadow-lg pb-5 md:pb-10 rounded-sm">
          <div className=" flex justify-between py-5 my-2 mx-2 rounded-sm items-center border  px-5 ">
            {<AddDevice />}
          </div>
          {/* //Todo create widget that will show name of device a switch to on and */}
          {/* off device change the properties of the devices // */}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
