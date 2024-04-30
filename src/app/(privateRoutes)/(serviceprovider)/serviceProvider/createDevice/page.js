import DeviceForm from "@/components/Forms/DeviceForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Page(){
    return  <div className="  ">
    <MaxWidthWrapper>
      <div className="text-[2.5rem] font-fraunces_bold "> Smart Home</div>

      <div className=" border shadow-lg pb-5 md:pb-10 rounded-sm">
        <div className=" flex justify-between py-5 my-2 mx-2 rounded-sm items-center border  px-5 ">
      
        </div>
      <DeviceForm/>
      </div>
    </MaxWidthWrapper>
  </div>
}