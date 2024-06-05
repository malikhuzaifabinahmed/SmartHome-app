import { getAllDevicesList } from "@/actions/Authenticate";
import MyButton from "@/components/ui/MyButton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function Page() {
    let response;

    try {
        response = await getAllDevicesList();
        console.log(response);
    } catch (error) {
        console.error('Failed to fetch devices:', error);
        return <div className="text-red-500">Error loading devices. Please try again later.</div>;
    }

    if (!response?.deviceList?.length) {
        return <div className="text-gray-500">No devices found.</div>;
    }

    return (
        <div className="overflow-hidden p-4">
            <h1 className=" font-fraunces_semibold text-[clamp(24px,5vw,60px)] font-bold my-10 w-fit mx-auto mb-4">Device List</h1>
            <div className="">
                <Table>
                    <TableCaption>A list of devices created by the Service Provider</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-[16px] sticky top-0 bg-white">#</TableHead>
                            <TableHead className="w-[150px] text-[20px] sticky top-0 bg-white whitespace-nowrap">Device Name</TableHead>
                            <TableHead className="w-full sticky  text-[20px] top-0 bg-white">Properties</TableHead>
                            <TableHead className="w-[100px] sticky text-[20px] top-0 bg-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.deviceList.map((device, index) => (
                            <TableRow key={device.deviceId}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-medium">{device.deviceName}</TableCell>
                                <TableCell className="w-full overflow-x-auto">
                                    <Table className="w-fit whitespace-nowrap">
                                        <TableHeader>
                                            <TableRow>
                                                {Object.keys(device.properties).map(property => (
                                                    <TableHead key={property}>{property}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                {Object.keys(device.properties).map(property => (
                                                    <TableCell key={property}>{device.properties[property]}</TableCell>
                                                ))}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
