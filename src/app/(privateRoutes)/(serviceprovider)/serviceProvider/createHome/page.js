import HomeForm from "@/components/Forms/HomeForm";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h1 className="text-center font-fraunces_semibold text-[clamp(24px,5vw,60px)] text-gray-900">
                    New Home
                </h1>
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    <HomeForm />
                </div>
            </div>
        </div>
    );
}
