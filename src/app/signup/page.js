import SignupForm from "@/components/Forms/SignupForm";
import SinglePageLayout from "@/components/SinglePageLayout";

export default async function Page() {
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
        <SignupForm />
      </SinglePageLayout>
    </>
  );
}
