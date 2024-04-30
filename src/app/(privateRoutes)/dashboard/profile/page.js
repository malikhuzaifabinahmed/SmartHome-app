import { getUserData } from "@/actions/Authenticate";
import { getCooKies } from "@/actions/cookiesManger";
import ProfileForm from "@/components/Forms/ProfileForm";
import jwt from "jsonwebtoken"
export default async function Page() {
    let accessToken = await getCooKies({ name: "accessToken" });
    if (!accessToken) {
        throw new Error("No access token found");
    }
    console.log('working')

    const decoded = jwt.decode(accessToken.value);
    let response;
    try {
        response = await getUserData({ email: decoded.email });
        console.log(response)
    } catch (error) {
        console.log(error)
    }
    return <ProfileForm user={response.user} />
}