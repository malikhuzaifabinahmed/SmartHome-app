import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import MyButton from "@/components/ui/MyButton";
import { Button } from "@/components/ui/button";

import AddDevice from "@/components/AddDevice";
import { getCooKies } from "@/actions/cookiesManger";
import DeviceForm from "@/components/Forms/DeviceForm";
import { getAllDevicesList } from "@/actions/Authenticate";

export default async function Page() {
  console. log('some',await getCooKies({name:'some'}))

  return (
    <div className="  ">
     Welcome to Dashboard 
    </div>
  );
}
