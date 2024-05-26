import DeviceForm from "@/components/Forms/DeviceForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <MaxWidthWrapper>
        <div className="text-center text-[2.5rem] font-fraunces_bold text-gray-900 mb-8">
          Smart Home
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <DeviceForm />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
