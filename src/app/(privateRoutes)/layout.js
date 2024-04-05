import { getCooKies } from "@/actions/cookiesManger"

export default async function layout({children}) {
let refreshToken = await getCooKies({name:"refreshToken"});
if(refreshToken)

{ 
    console.log("private Route")
    return <>{children}</>

}
  
}