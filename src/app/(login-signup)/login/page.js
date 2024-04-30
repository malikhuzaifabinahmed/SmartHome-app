import { getCooKies } from "@/actions/cookiesManger";
import LoginForm from "@/components/Forms/LoginForm";
import SinglePageLayout from "@/components/SinglePageLayout";
import { redirect } from "next/navigation";

export default async function Page() {
  let refreshToken = await getCooKies({name:"refreshToken"});
  if(refreshToken){
    redirect("/dashboard")
  }
  return (
    <>
      <SinglePageLayout
        backgroundImage="linear-gradient(215deg, rgba(0, 0, 0, 0.87) 50%, rgb(124, 58, 237) 0%) center center"
        logoSrc="/logo.png"
        additionalText={
          "If you have any questions or want any further information, drop us a message and our team will get back to you as soon as possible."
        }
        cardClass={"rounded-[24px]"}
      >
        <LoginForm />
      </SinglePageLayout>
    </>
  );
}
