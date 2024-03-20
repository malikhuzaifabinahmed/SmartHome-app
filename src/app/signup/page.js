import SignupForm from "@/components/Forms/SignupForm";
import SinglePageLayout from "@/components/SinglePageLayout";

export default async function Page() {
  return (
    <>
      <SinglePageLayout
        backgroundImage="linear-gradient(110.56deg, rgba(147, 241, 251, 0.2) 12.99%, rgba(80, 131, 254, 0.2) 88.67%)"
        logoSrc="/logo.png"
        additionalText={
          "If you have any questions or want any further information, drop us a message and our team will get back to you as soon as possible."
        }
      >
        <SignupForm />
      </SinglePageLayout>
    </>
  );
}
